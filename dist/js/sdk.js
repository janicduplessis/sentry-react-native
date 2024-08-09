import { __awaiter } from "tslib";
import { getIntegrationsToSetup, Hub, initAndBind, makeMain, setExtra } from '@sentry/core';
import { defaultStackParser, getCurrentHub, makeFetchTransport, } from '@sentry/react';
import { logger, stackParserFromStackParserOptions } from '@sentry/utils';
import * as React from 'react';
import { ReactNativeClient } from './client';
import { getDefaultIntegrations } from './integrations/default';
import { shouldEnableNativeNagger } from './options';
import { ReactNativeScope } from './scope';
import { TouchEventBoundary } from './touchevents';
import { ReactNativeProfiler, ReactNativeTracing } from './tracing';
import { DEFAULT_BUFFER_SIZE, makeNativeTransportFactory } from './transports/native';
import { makeUtf8TextEncoder } from './transports/TextEncoder';
import { getDefaultEnvironment, isExpoGo, isRunningInMetroDevServer } from './utils/environment';
import { safeFactory, safeTracesSampler } from './utils/safe';
import { NATIVE } from './wrapper';
const DEFAULT_OPTIONS = {
    enableNativeCrashHandling: true,
    enableNativeNagger: true,
    autoInitializeNativeSdk: true,
    enableAutoPerformanceTracing: true,
    enableWatchdogTerminationTracking: true,
    patchGlobalPromise: true,
    transportOptions: {
        textEncoder: makeUtf8TextEncoder(),
    },
    sendClientReports: true,
    maxQueueSize: DEFAULT_BUFFER_SIZE,
    attachStacktrace: true,
    enableCaptureFailedRequests: false,
    enableNdk: true,
};
/**
 * Inits the SDK and returns the final options.
 */
export function init(passedOptions) {
    var _a, _b, _c, _d;
    if (isRunningInMetroDevServer()) {
        return;
    }
    const reactNativeHub = new Hub(undefined, new ReactNativeScope());
    makeMain(reactNativeHub);
    const maxQueueSize = (_c = (_a = passedOptions.maxQueueSize) !== null && _a !== void 0 ? _a : (_b = passedOptions.transportOptions) === null || _b === void 0 ? void 0 : _b.bufferSize) !== null && _c !== void 0 ? _c : DEFAULT_OPTIONS.maxQueueSize;
    const enableNative = passedOptions.enableNative === undefined || passedOptions.enableNative
        ? NATIVE.isNativeAvailable()
        : false;
    const options = Object.assign(Object.assign(Object.assign({}, DEFAULT_OPTIONS), passedOptions), { enableNative, enableNativeNagger: shouldEnableNativeNagger(passedOptions.enableNativeNagger), 
        // If custom transport factory fails the SDK won't initialize
        transport: passedOptions.transport
            || makeNativeTransportFactory({
                enableNative,
            })
            || makeFetchTransport, transportOptions: Object.assign(Object.assign(Object.assign({}, DEFAULT_OPTIONS.transportOptions), ((_d = passedOptions.transportOptions) !== null && _d !== void 0 ? _d : {})), { bufferSize: maxQueueSize }), maxQueueSize, integrations: [], stackParser: stackParserFromStackParserOptions(passedOptions.stackParser || defaultStackParser), beforeBreadcrumb: safeFactory(passedOptions.beforeBreadcrumb, { loggerMessage: 'The beforeBreadcrumb threw an error' }), initialScope: safeFactory(passedOptions.initialScope, { loggerMessage: 'The initialScope threw an error' }) });
    if ('tracesSampler' in options) {
        options.tracesSampler = safeTracesSampler(options.tracesSampler);
    }
    if (!('environment' in options)) {
        options.environment = getDefaultEnvironment();
    }
    const defaultIntegrations = passedOptions.defaultIntegrations === undefined
        ? getDefaultIntegrations(options)
        : passedOptions.defaultIntegrations;
    options.integrations = getIntegrationsToSetup({
        integrations: safeFactory(passedOptions.integrations, { loggerMessage: 'The integrations threw an error' }),
        defaultIntegrations,
    });
    initAndBind(ReactNativeClient, options);
    if (isExpoGo()) {
        logger.info('Offline caching, native errors features are not available in Expo Go.');
        logger.info('Use EAS Build / Native Release Build to test these features.');
    }
}
/**
 * Inits the Sentry React Native SDK with automatic instrumentation and wrapped features.
 */
export function wrap(RootComponent, options) {
    var _a, _b;
    const tracingIntegration = getCurrentHub().getIntegration(ReactNativeTracing);
    if (tracingIntegration) {
        tracingIntegration.useAppStartWithProfiler = true;
    }
    const profilerProps = Object.assign(Object.assign({}, ((_a = options === null || options === void 0 ? void 0 : options.profilerProps) !== null && _a !== void 0 ? _a : {})), { name: (_b = RootComponent.displayName) !== null && _b !== void 0 ? _b : 'Root' });
    const RootApp = (appProps) => {
        var _a;
        return (React.createElement(TouchEventBoundary, Object.assign({}, ((_a = options === null || options === void 0 ? void 0 : options.touchEventBoundaryProps) !== null && _a !== void 0 ? _a : {})),
            React.createElement(ReactNativeProfiler, Object.assign({}, profilerProps),
                React.createElement(RootComponent, Object.assign({}, appProps)))));
    };
    return RootApp;
}
/**
 * Deprecated. Sets the release on the event.
 * NOTE: Does not set the release on sessions.
 * @deprecated
 */
export function setRelease(release) {
    setExtra('__sentry_release', release);
}
/**
 * Deprecated. Sets the dist on the event.
 * NOTE: Does not set the dist on sessions.
 * @deprecated
 */
export function setDist(dist) {
    setExtra('__sentry_dist', dist);
}
/**
 * If native client is available it will trigger a native crash.
 * Use this only for testing purposes.
 */
export function nativeCrash() {
    const client = getCurrentHub().getClient();
    if (client) {
        client.nativeCrash();
    }
}
/**
 * Flushes all pending events in the queue to disk.
 * Use this before applying any realtime updates such as code-push or expo updates.
 */
export function flush() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = getCurrentHub().getClient();
            if (client) {
                const result = yield client.flush();
                return result;
            }
            // eslint-disable-next-line no-empty
        }
        catch (_) { }
        logger.error('Failed to flush the event queue.');
        return false;
    });
}
/**
 * Closes the SDK, stops sending events.
 */
export function close() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = getCurrentHub().getClient();
            if (client) {
                yield client.close();
            }
        }
        catch (e) {
            logger.error('Failed to close the SDK');
        }
    });
}
/**
 * Captures user feedback and sends it to Sentry.
 */
export function captureUserFeedback(feedback) {
    var _a;
    (_a = getCurrentHub().getClient()) === null || _a === void 0 ? void 0 : _a.captureUserFeedback(feedback);
}
/**
 * Creates a new scope with and executes the given operation within.
 * The scope is automatically removed once the operation
 * finishes or throws.
 *
 * This is essentially a convenience function for:
 *
 *     pushScope();
 *     callback();
 *     popScope();
 *
 * @param callback that will be enclosed into push/popScope.
 */
export function withScope(callback) {
    const safeCallback = (scope) => {
        try {
            return callback(scope);
        }
        catch (e) {
            logger.error('Error while running withScope callback', e);
            return undefined;
        }
    };
    return getCurrentHub().withScope(safeCallback);
}
/**
 * Callback to set context information onto the scope.
 * @param callback Callback function that receives Scope.
 */
export function configureScope(callback) {
    const safeCallback = (scope) => {
        try {
            callback(scope);
        }
        catch (e) {
            logger.error('Error while running configureScope callback', e);
        }
    };
    getCurrentHub().configureScope(safeCallback);
}
/**
 * Returns if the app crashed in the last run.
 */
export function crashedLastRun() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = getCurrentHub().getClient();
        if (client) {
            return client.crashedLastRun();
        }
        return false;
    });
}
//# sourceMappingURL=sdk.js.map