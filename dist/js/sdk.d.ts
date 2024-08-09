import type { Scope } from '@sentry/core';
import { Hub } from '@sentry/core';
import type { UserFeedback } from '@sentry/types';
import * as React from 'react';
import type { ReactNativeOptions, ReactNativeWrapperOptions } from './options';
/**
 * Inits the SDK and returns the final options.
 */
export declare function init(passedOptions: ReactNativeOptions): void;
/**
 * Inits the Sentry React Native SDK with automatic instrumentation and wrapped features.
 */
export declare function wrap<P extends Record<string, unknown>>(RootComponent: React.ComponentType<P>, options?: ReactNativeWrapperOptions): React.ComponentType<P>;
/**
 * Deprecated. Sets the release on the event.
 * NOTE: Does not set the release on sessions.
 * @deprecated
 */
export declare function setRelease(release: string): void;
/**
 * Deprecated. Sets the dist on the event.
 * NOTE: Does not set the dist on sessions.
 * @deprecated
 */
export declare function setDist(dist: string): void;
/**
 * If native client is available it will trigger a native crash.
 * Use this only for testing purposes.
 */
export declare function nativeCrash(): void;
/**
 * Flushes all pending events in the queue to disk.
 * Use this before applying any realtime updates such as code-push or expo updates.
 */
export declare function flush(): Promise<boolean>;
/**
 * Closes the SDK, stops sending events.
 */
export declare function close(): Promise<void>;
/**
 * Captures user feedback and sends it to Sentry.
 */
export declare function captureUserFeedback(feedback: UserFeedback): void;
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
export declare function withScope<T>(callback: (scope: Scope) => T): T | undefined;
/**
 * Callback to set context information onto the scope.
 * @param callback Callback function that receives Scope.
 */
export declare function configureScope(callback: (scope: Scope) => void): ReturnType<Hub['configureScope']>;
/**
 * Returns if the app crashed in the last run.
 */
export declare function crashedLastRun(): Promise<boolean>;
//# sourceMappingURL=sdk.d.ts.map