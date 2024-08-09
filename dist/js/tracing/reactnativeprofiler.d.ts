import { Profiler } from '@sentry/react';
/**
 * Custom profiler for the React Native app root.
 */
export declare class ReactNativeProfiler extends Profiler {
    readonly name: string;
    constructor(props: ConstructorParameters<typeof Profiler>[0]);
    /**
     * Get the app root mount time.
     */
    componentDidMount(): void;
    /**
     * Notifies the Tracing integration that the app start has finished.
     */
    private _reportAppStart;
}
//# sourceMappingURL=reactnativeprofiler.d.ts.map