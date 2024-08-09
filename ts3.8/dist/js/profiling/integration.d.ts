import type { Integration, IntegrationClass, IntegrationFn, ThreadCpuProfile } from '@sentry/types';
import type { NativeAndroidProfileEvent, NativeProfileEvent } from './nativeTypes';
import type { AndroidCombinedProfileEvent, CombinedProfileEvent, HermesProfileEvent } from './types';
/**
 * Profiling integration creates a profile for each transaction and adds it to the event envelope.
 *
 * @experimental
 */
export declare const hermesProfilingIntegration: IntegrationFn;
/**
 * Profiling integration creates a profile for each transaction and adds it to the event envelope.
 *
 * @deprecated Use `hermesProfilingIntegration()` instead.
 */
export declare const HermesProfiling: IntegrationClass<Integration>;
/**
 * Starts Profilers and returns the timestamp when profiling started in nanoseconds.
 */
export declare function startProfiling(): number | null;
/**
 * Stops Profilers and returns collected combined profile.
 */
export declare function stopProfiling(profileStartTimestampNs: number): CombinedProfileEvent | AndroidCombinedProfileEvent | null;
/**
 * Creates Android profile event with attached javascript profile.
 */
export declare function createAndroidWithHermesProfile(hermes: HermesProfileEvent, nativeAndroid: NativeAndroidProfileEvent, durationNs: number): AndroidCombinedProfileEvent;
/**
 * Merges Hermes and Native profile events into one.
 */
export declare function addNativeProfileToHermesProfile(hermes: HermesProfileEvent, native: NativeProfileEvent): CombinedProfileEvent;
/**
 * Merges Hermes And Native profiles into one.
 */
export declare function addNativeThreadCpuProfileToHermes(hermes: ThreadCpuProfile, native: ThreadCpuProfile, hermes_active_thread_id: string | undefined): CombinedProfileEvent['profile'];
//# sourceMappingURL=integration.d.ts.map
