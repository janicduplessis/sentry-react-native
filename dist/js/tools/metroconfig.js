Object.defineProperty(exports, "__esModule", { value: true });
exports.withSentryFramesCollapsed = exports.withSentryBabelTransformer = exports.getSentryExpoConfig = exports.withSentryConfig = void 0;
const tslib_1 = require("tslib");
const utils_1 = require("@sentry/utils");
const process = require("process");
const process_1 = require("process");
const enableLogger_1 = require("./enableLogger");
const sentryBabelTransformerUtils_1 = require("./sentryBabelTransformerUtils");
const sentryMetroSerializer_1 = require("./sentryMetroSerializer");
tslib_1.__exportStar(require("./sentryMetroSerializer"), exports);
(0, enableLogger_1.enableLogger)();
/**
 * Adds Sentry to the Metro config.
 *
 * Adds Debug ID to the output bundle and source maps.
 * Collapses Sentry frames from the stack trace view in LogBox.
 */
function withSentryConfig(config, { annotateReactComponents = false } = {}) {
    setSentryMetroDevServerEnvFlag();
    let newConfig = config;
    newConfig = withSentryDebugId(newConfig);
    newConfig = withSentryFramesCollapsed(newConfig);
    if (annotateReactComponents) {
        newConfig = withSentryBabelTransformer(newConfig);
    }
    return newConfig;
}
exports.withSentryConfig = withSentryConfig;
/**
 * This function returns Default Expo configuration with Sentry plugins.
 */
function getSentryExpoConfig(projectRoot, options = {}) {
    setSentryMetroDevServerEnvFlag();
    const getDefaultConfig = options.getDefaultConfig || loadExpoMetroConfigModule().getDefaultConfig;
    const config = getDefaultConfig(projectRoot, Object.assign(Object.assign({}, options), { unstable_beforeAssetSerializationPlugins: [
            ...(options.unstable_beforeAssetSerializationPlugins || []),
            sentryMetroSerializer_1.unstable_beforeAssetSerializationPlugin,
        ] }));
    let newConfig = withSentryFramesCollapsed(config);
    if (options.annotateReactComponents) {
        newConfig = withSentryBabelTransformer(newConfig);
    }
    return newConfig;
}
exports.getSentryExpoConfig = getSentryExpoConfig;
function loadExpoMetroConfigModule() {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return require('expo/metro-config');
    }
    catch (e) {
        throw new Error('Unable to load `expo/metro-config`. Make sure you have Expo installed.');
    }
}
/**
 * Adds Sentry Babel transformer to the Metro config.
 */
function withSentryBabelTransformer(config) {
    const defaultBabelTransformerPath = config.transformer && config.transformer.babelTransformerPath;
    utils_1.logger.debug('Default Babel transformer path from `config.transformer`:', defaultBabelTransformerPath);
    if (!defaultBabelTransformerPath) {
        // This has to be console.warn because the options is enabled but won't be used
        // eslint-disable-next-line no-console
        console.warn('`transformer.babelTransformerPath` is undefined.');
        // eslint-disable-next-line no-console
        console.warn('Sentry Babel transformer cannot be used. Not adding it...');
        return config;
    }
    if (defaultBabelTransformerPath) {
        (0, sentryBabelTransformerUtils_1.saveDefaultBabelTransformerPath)(defaultBabelTransformerPath);
        process.on('exit', () => {
            (0, sentryBabelTransformerUtils_1.cleanDefaultBabelTransformerPath)();
        });
    }
    return Object.assign(Object.assign({}, config), { transformer: Object.assign(Object.assign({}, config.transformer), { babelTransformerPath: require.resolve('./sentryBabelTransformer') }) });
}
exports.withSentryBabelTransformer = withSentryBabelTransformer;
function withSentryDebugId(config) {
    var _a;
    const customSerializer = (0, sentryMetroSerializer_1.createSentryMetroSerializer)(((_a = config.serializer) === null || _a === void 0 ? void 0 : _a.customSerializer) || undefined);
    // MetroConfig types customSerializers as async only, but sync returns are also supported
    // The default serializer is sync
    return Object.assign(Object.assign({}, config), { serializer: Object.assign(Object.assign({}, config.serializer), { customSerializer }) });
}
/**
 * Collapses Sentry internal frames from the stack trace view in LogBox.
 */
function withSentryFramesCollapsed(config) {
    var _a;
    const originalCustomizeFrame = (_a = config.symbolicator) === null || _a === void 0 ? void 0 : _a.customizeFrame;
    const collapseSentryInternalFrames = (frame) => typeof frame.file === 'string' &&
        (frame.file.includes('node_modules/@sentry/utils/cjs/instrument.js') ||
            frame.file.includes('node_modules/@sentry/utils/cjs/logger.js'));
    const customizeFrame = (frame) => {
        const originalOrSentryCustomizeFrame = (originalCustomization) => (Object.assign(Object.assign({}, originalCustomization), { collapse: (originalCustomization && originalCustomization.collapse) || collapseSentryInternalFrames(frame) }));
        const maybePromiseCustomization = (originalCustomizeFrame && originalCustomizeFrame(frame)) || undefined;
        if (maybePromiseCustomization !== undefined && 'then' in maybePromiseCustomization) {
            return maybePromiseCustomization.then(originalCustomization => originalOrSentryCustomizeFrame(originalCustomization));
        }
        return originalOrSentryCustomizeFrame(maybePromiseCustomization);
    };
    return Object.assign(Object.assign({}, config), { symbolicator: Object.assign(Object.assign({}, config.symbolicator), { customizeFrame }) });
}
exports.withSentryFramesCollapsed = withSentryFramesCollapsed;
/**
 * Sets the `___SENTRY_METRO_DEV_SERVER___` environment flag.
 * This is used to determine if the SDK is running in Node in Metro Dev Server.
 * For example during static routes generation in `expo-router`.
 */
function setSentryMetroDevServerEnvFlag() {
    process_1.env.___SENTRY_METRO_DEV_SERVER___ = 'true';
}
//# sourceMappingURL=metroconfig.js.map