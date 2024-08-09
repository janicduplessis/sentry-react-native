export type { Breadcrumb, Request, SdkInfo, Event, Exception, StackFrame, Stacktrace, Thread, User, UserFeedback, } from '@sentry/types';
export { addGlobalEventProcessor, addBreadcrumb, captureException, captureEvent, captureMessage, getHubFromCarrier, getCurrentHub, Hub, Scope, setContext, setExtra, setExtras, setTag, setTags, setUser, startTransaction, startInactiveSpan, startSpan, startSpanManual, getActiveSpan, spanToJSON, spanIsSampled, setMeasurement, getCurrentScope, getGlobalScope, getIsolationScope, getClient, setCurrentClient, addEventProcessor, metrics, } from '@sentry/core';
export { Integrations as BrowserIntegrations, ErrorBoundary, withErrorBoundary, createReduxEnhancer, Profiler, useProfiler, withProfiler, } from '@sentry/react';
export { lastEventId } from '@sentry/browser';
import * as Integrations from './integrations';
export * from './integrations/exports';
export { SDK_NAME, SDK_VERSION } from './version';
export type { ReactNativeOptions } from './options';
export { ReactNativeClient } from './client';
export { init, wrap, setDist, setRelease, nativeCrash, flush, close, captureUserFeedback, withScope, configureScope, crashedLastRun, } from './sdk';
export { TouchEventBoundary, withTouchEventBoundary } from './touchevents';
export { ReactNativeTracing, ReactNavigationV4Instrumentation, ReactNavigationV5Instrumentation, ReactNavigationInstrumentation, ReactNativeNavigationInstrumentation, RoutingInstrumentation, sentryTraceGesture, TimeToInitialDisplay, TimeToFullDisplay, startTimeToInitialDisplaySpan, startTimeToFullDisplaySpan, } from './tracing';
export type { ReactNavigationTransactionContext, TimeToDisplayProps } from './tracing';
export { 
/** @deprecated Import the integration function directly, e.g. `screenshotIntegration()` instead of `new Integrations.Screenshot(). */
Integrations, };
//# sourceMappingURL=index.d.ts.map