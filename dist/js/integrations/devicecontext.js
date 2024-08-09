import { __awaiter } from "tslib";
/* eslint-disable complexity */
import { convertIntegrationFnToClass } from '@sentry/core';
import { logger, severityLevelFromString } from '@sentry/utils';
import { AppState } from 'react-native';
import { breadcrumbFromObject } from '../breadcrumb';
import { NATIVE } from '../wrapper';
const INTEGRATION_NAME = 'DeviceContext';
/** Load device context from native. */
export const deviceContextIntegration = () => {
    return {
        name: INTEGRATION_NAME,
        setupOnce: () => {
            /* noop */
        },
        processEvent,
    };
};
/**
 * Load device context from native.
 *
 * @deprecated Use `deviceContextIntegration()` instead.
 */
// eslint-disable-next-line deprecation/deprecation
export const DeviceContext = convertIntegrationFnToClass(INTEGRATION_NAME, deviceContextIntegration);
function processEvent(event) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let native = null;
        try {
            native = yield NATIVE.fetchNativeDeviceContexts();
        }
        catch (e) {
            logger.log(`Failed to get device context from native: ${e}`);
        }
        if (!native) {
            return event;
        }
        const nativeUser = native.user;
        if (!event.user && nativeUser) {
            event.user = nativeUser;
        }
        let nativeContexts = native.contexts;
        if (AppState.currentState !== 'unknown') {
            nativeContexts = nativeContexts || {};
            nativeContexts.app = Object.assign(Object.assign({}, nativeContexts.app), { in_foreground: AppState.currentState === 'active' });
        }
        if (nativeContexts) {
            event.contexts = Object.assign(Object.assign({}, nativeContexts), event.contexts);
            if (nativeContexts.app) {
                event.contexts.app = Object.assign(Object.assign({}, nativeContexts.app), event.contexts.app);
            }
        }
        const nativeTags = native.tags;
        if (nativeTags) {
            event.tags = Object.assign(Object.assign({}, nativeTags), event.tags);
        }
        const nativeExtra = native.extra;
        if (nativeExtra) {
            event.extra = Object.assign(Object.assign({}, nativeExtra), event.extra);
        }
        const nativeFingerprint = native.fingerprint;
        if (nativeFingerprint) {
            event.fingerprint = ((_a = event.fingerprint) !== null && _a !== void 0 ? _a : []).concat(nativeFingerprint.filter(item => { var _a; return ((_a = event.fingerprint) !== null && _a !== void 0 ? _a : []).indexOf(item) < 0; }));
        }
        const nativeLevel = typeof native['level'] === 'string' ? severityLevelFromString(native['level']) : undefined;
        if (!event.level && nativeLevel) {
            event.level = nativeLevel;
        }
        const nativeEnvironment = native['environment'];
        if (!event.environment && nativeEnvironment) {
            event.environment = nativeEnvironment;
        }
        const nativeBreadcrumbs = Array.isArray(native['breadcrumbs'])
            ? native['breadcrumbs'].map(breadcrumbFromObject)
            : undefined;
        if (nativeBreadcrumbs) {
            event.breadcrumbs = nativeBreadcrumbs;
        }
        return event;
    });
}
//# sourceMappingURL=devicecontext.js.map