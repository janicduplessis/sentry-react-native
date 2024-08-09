import type { Breadcrumb, Envelope, EnvelopeItem, Event, Package, SeverityLevel, User } from '@sentry/types';
import { Platform } from 'react-native';
import type { NativeAppStartResponse, NativeDeviceContextsResponse, NativeFramesResponse, NativeReleaseResponse, NativeStackFrames, Spec } from './NativeRNSentry';
import type { ReactNativeClientOptions } from './options';
import type * as Hermes from './profiling/hermes';
import type { NativeAndroidProfileEvent, NativeProfileEvent } from './profiling/nativeTypes';
import type { MobileReplayOptions } from './replay/mobilereplay';
/**
 * Returns the RNSentry module. Dynamically resolves if NativeModule or TurboModule is used.
 */
export declare function getRNSentryModule(): Spec | undefined;
export interface Screenshot {
    data: Uint8Array;
    contentType: string;
    filename: string;
}
export type NativeSdkOptions = Partial<ReactNativeClientOptions> & {
    mobileReplayOptions: MobileReplayOptions | undefined;
};
interface SentryNativeWrapper {
    enableNative: boolean;
    nativeIsReady: boolean;
    platform: typeof Platform.OS;
    _NativeClientError: Error;
    _DisabledNativeError: Error;
    _processItem(envelopeItem: EnvelopeItem): EnvelopeItem;
    _processLevels(event: Event): Event;
    _processLevel(level: SeverityLevel): SeverityLevel;
    _serializeObject(data: {
        [key: string]: unknown;
    }): {
        [key: string]: string;
    };
    _isModuleLoaded(module: Spec | undefined): module is Spec;
    isNativeAvailable(): boolean;
    initNativeSdk(options: NativeSdkOptions): PromiseLike<boolean>;
    closeNativeSdk(): PromiseLike<void>;
    sendEnvelope(envelope: Envelope): Promise<void>;
    captureScreenshot(): Promise<Screenshot[] | null>;
    fetchNativeRelease(): PromiseLike<NativeReleaseResponse>;
    fetchNativeDeviceContexts(): PromiseLike<NativeDeviceContextsResponse | null>;
    fetchNativeAppStart(): PromiseLike<NativeAppStartResponse | null>;
    fetchNativeFrames(): PromiseLike<NativeFramesResponse | null>;
    fetchNativeSdkInfo(): PromiseLike<Package | null>;
    disableNativeFramesTracking(): void;
    enableNativeFramesTracking(): void;
    addBreadcrumb(breadcrumb: Breadcrumb): void;
    setContext(key: string, context: {
        [key: string]: unknown;
    } | null): void;
    clearBreadcrumbs(): void;
    setExtra(key: string, extra: unknown): void;
    setUser(user: User | null): void;
    setTag(key: string, value: string): void;
    nativeCrash(): void;
    fetchModules(): Promise<Record<string, string> | null>;
    fetchViewHierarchy(): PromiseLike<Uint8Array | null>;
    startProfiling(): boolean;
    stopProfiling(): {
        hermesProfile: Hermes.Profile;
        nativeProfile?: NativeProfileEvent;
        androidProfile?: NativeAndroidProfileEvent;
    } | null;
    fetchNativePackageName(): string | null;
    /**
     * Fetches native stack frames and debug images for the instructions addresses.
     */
    fetchNativeStackFramesBy(instructionsAddr: number[]): NativeStackFrames | null;
    initNativeReactNavigationNewFrameTracking(): Promise<void>;
    captureReplay(isHardCrash: boolean): Promise<string | null>;
    getCurrentReplayId(): string | null;
    crashedLastRun(): Promise<boolean>;
}
/**
 * Our internal interface for calling native functions
 */
export declare const NATIVE: SentryNativeWrapper;
export {};
//# sourceMappingURL=wrapper.d.ts.map