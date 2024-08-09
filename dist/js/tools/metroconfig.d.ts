import type { MetroConfig } from 'metro';
import type { DefaultConfigOptions } from './vendor/expo/expoconfig';
export * from './sentryMetroSerializer';
export interface SentryMetroConfigOptions {
    /**
     * Annotates React components with Sentry data.
     * @default false
     */
    annotateReactComponents?: boolean;
}
export interface SentryExpoConfigOptions {
    /**
     * Pass a custom `getDefaultConfig` function to override the default Expo configuration getter.
     */
    getDefaultConfig?: typeof getSentryExpoConfig;
}
/**
 * Adds Sentry to the Metro config.
 *
 * Adds Debug ID to the output bundle and source maps.
 * Collapses Sentry frames from the stack trace view in LogBox.
 */
export declare function withSentryConfig(config: MetroConfig, { annotateReactComponents }?: SentryMetroConfigOptions): MetroConfig;
/**
 * This function returns Default Expo configuration with Sentry plugins.
 */
export declare function getSentryExpoConfig(projectRoot: string, options?: DefaultConfigOptions & SentryExpoConfigOptions & SentryMetroConfigOptions): MetroConfig;
/**
 * Adds Sentry Babel transformer to the Metro config.
 */
export declare function withSentryBabelTransformer(config: MetroConfig): MetroConfig;
/**
 * Collapses Sentry internal frames from the stack trace view in LogBox.
 */
export declare function withSentryFramesCollapsed(config: MetroConfig): MetroConfig;
//# sourceMappingURL=metroconfig.d.ts.map