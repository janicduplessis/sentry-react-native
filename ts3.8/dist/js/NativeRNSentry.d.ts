import type { Package } from '@sentry/types';
import type { TurboModule } from 'react-native';
import type { UnsafeObject } from './utils/rnlibrariesinterface';
export interface Spec extends TurboModule {
    addListener: (eventType: string) => void;
    removeListeners: (id: number) => void;
    addBreadcrumb(breadcrumb: UnsafeObject): void;
    captureEnvelope(bytes: string, options: {
        hardCrashed: boolean;
    }): Promise<boolean>;
    captureScreenshot(): Promise<NativeScreenshot[] | undefined | null>;
    clearBreadcrumbs(): void;
    crash(): void;
    closeNativeSdk(): Promise<void>;
    disableNativeFramesTracking(): void;
    fetchNativeRelease(): Promise<NativeReleaseResponse>;
    fetchNativeSdkInfo(): Promise<Package | null>;
    fetchNativeDeviceContexts(): Promise<NativeDeviceContextsResponse | null>;
    fetchNativeAppStart(): Promise<NativeAppStartResponse | null>;
    fetchNativeFrames(): Promise<NativeFramesResponse | null>;
    initNativeSdk(options: UnsafeObject): Promise<boolean>;
    setUser(defaultUserKeys: UnsafeObject | null, otherUserKeys: UnsafeObject | null): void;
    setContext(key: string, value: UnsafeObject | null): void;
    setExtra(key: string, value: string): void;
    setTag(key: string, value: string): void;
    enableNativeFramesTracking(): void;
    fetchModules(): Promise<string | undefined | null>;
    fetchViewHierarchy(): Promise<number[] | undefined | null>;
    startProfiling(): {
        started?: boolean;
        error?: string;
    };
    stopProfiling(): {
        profile?: string;
        nativeProfile?: UnsafeObject;
        androidProfile?: UnsafeObject;
        error?: string;
    };
    fetchNativePackageName(): string | undefined | null;
    fetchNativeStackFramesBy(instructionsAddr: number[]): NativeStackFrames | undefined | null;
    initNativeReactNavigationNewFrameTracking(): Promise<void>;
    captureReplay(isHardCrash: boolean): Promise<string | undefined | null>;
    getCurrentReplayId(): string | undefined | null;
    crashedLastRun(): Promise<boolean>;
}
export type NativeStackFrame = {
    platform: string;
    /**
     * The instruction address of this frame.
     * Formatted as hex with 0x prefix.
     */
    instruction_addr: string;
    package?: string;
    /**
     * The debug image address of this frame.
     * Formatted as hex with 0x prefix.
     */
    image_addr?: string;
    in_app?: boolean;
    /**
     * The symbol name of this frame.
     * If symbolicated locally.
     */
    function?: string;
    /**
     * The symbol address of this frame.
     * If symbolicated locally.
     * Formatted as hex with 0x prefix.
     */
    symbol_addr?: string;
};
export type NativeDebugImage = {
    name?: string;
    type?: string;
    uuid?: string;
    debug_id?: string;
    image_addr?: string;
    image_size?: number;
    code_file?: string;
    image_vmaddr?: string;
};
export type NativeStackFrames = {
    frames: NativeStackFrame[];
    debugMetaImages?: NativeDebugImage[];
};
export type NativeAppStartResponse = {
    type: 'cold' | 'warm' | 'unknown';
    has_fetched: boolean;
    app_start_timestamp_ms?: number;
    spans: {
        description: string;
        start_timestamp_ms: number;
        end_timestamp_ms: number;
    }[];
};
export type NativeFramesResponse = {
    totalFrames: number;
    slowFrames: number;
    frozenFrames: number;
};
export type NativeReleaseResponse = {
    build: string;
    id: string;
    version: string;
};
/**
 * This type describes serialized scope from sentry-cocoa and sentry-android
 * https://github.com/getsentry/sentry-cocoa/blob/master/Sources/Sentry/SentryScope.m
 * https://github.com/getsentry/sentry-java/blob/a461f7e125b65240004e6162b341f383ce2e1394/sentry-android-core/src/main/java/io/sentry/android/core/InternalSentrySdk.java#L32
 */
export type NativeDeviceContextsResponse = {
    [key: string]: unknown;
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
    contexts?: Record<string, Record<string, unknown>>;
    user?: {
        userId?: string;
        email?: string;
        username?: string;
        ipAddress?: string;
        segment?: string;
        data?: Record<string, unknown>;
    };
    dist?: string;
    environment?: string;
    fingerprint?: string[];
    level?: string;
    breadcrumbs?: {
        level?: string;
        timestamp?: string;
        category?: string;
        type?: string;
        message?: string;
        data?: Record<string, unknown>;
    }[];
};
export type NativeScreenshot = {
    data: number[];
    contentType: string;
    filename: string;
};
declare const _default: Spec;
export default _default;
//# sourceMappingURL=NativeRNSentry.d.ts.map
