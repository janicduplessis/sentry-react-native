export { addGlobalEventProcessor, addBreadcrumb, captureException, captureEvent, captureMessage, getHubFromCarrier, getCurrentHub, Hub, Scope, setContext, setExtra, setExtras, setTag, setTags, setUser, startTransaction, 
// v8 spans
startInactiveSpan, startSpan, startSpanManual, getActiveSpan, spanToJSON, spanIsSampled, setMeasurement, 
// v8 scopes
getCurrentScope, getGlobalScope, getIsolationScope, getClient, setCurrentClient, addEventProcessor, metrics, } from '@sentry/core';
import { _addTracingExtensions } from './tracing/addTracingExtensions';
_addTracingExtensions();
export { Integrations as BrowserIntegrations, ErrorBoundary, withErrorBoundary, createReduxEnhancer, Profiler, useProfiler, withProfiler, } from '@sentry/react';
export { lastEventId } from '@sentry/browser';
import * as Integrations from './integrations';
export * from './integrations/exports';
export { SDK_NAME, SDK_VERSION } from './version';
export { ReactNativeClient } from './client';
export { init, wrap, 
// eslint-disable-next-line deprecation/deprecation
setDist, 
// eslint-disable-next-line deprecation/deprecation
setRelease, nativeCrash, flush, close, captureUserFeedback, withScope, configureScope, crashedLastRun, } from './sdk';
export { TouchEventBoundary, withTouchEventBoundary } from './touchevents';
export { ReactNativeTracing, ReactNavigationV4Instrumentation, 
// eslint-disable-next-line deprecation/deprecation
ReactNavigationV5Instrumentation, ReactNavigationInstrumentation, ReactNativeNavigationInstrumentation, RoutingInstrumentation, sentryTraceGesture, TimeToInitialDisplay, TimeToFullDisplay, startTimeToInitialDisplaySpan, startTimeToFullDisplaySpan, } from './tracing';
export { 
/** @deprecated Import the integration function directly, e.g. `screenshotIntegration()` instead of `new Integrations.Screenshot(). */
Integrations, };
//# sourceMappingURL=index.js.map