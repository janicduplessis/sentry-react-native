import { __awaiter, __rest } from "tslib";
import { logger, normalize, SentryError } from '@sentry/utils';
import { NativeModules, Platform } from 'react-native';
import { isHardCrash } from './misc';
import { isTurboModuleEnabled } from './utils/environment';
import { ReactNativeLibraries } from './utils/rnlibraries';
import { base64StringFromByteArray, utf8ToBytes } from './vendor';
/**
 * Returns the RNSentry module. Dynamically resolves if NativeModule or TurboModule is used.
 */
export function getRNSentryModule() {
    return isTurboModuleEnabled()
        ? ReactNativeLibraries.TurboModuleRegistry && ReactNativeLibraries.TurboModuleRegistry.get('RNSentry')
        : NativeModules.RNSentry;
}
const RNSentry = getRNSentryModule();
const EOL = utf8ToBytes('\n');
/**
 * Our internal interface for calling native functions
 */
export const NATIVE = {
    fetchModules() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.enableNative) {
                throw this._DisabledNativeError;
            }
            if (!this._isModuleLoaded(RNSentry)) {
                throw this._NativeClientError;
            }
            const raw = yield RNSentry.fetchModules();
            if (raw) {
                return JSON.parse(raw);
            }
            return null;
        });
    },
    /**
     * Sending the envelope over the bridge to native
     * @param envelope Envelope
     */
    sendEnvelope(envelope) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.enableNative) {
                logger.warn('Event was skipped as native SDK is not enabled.');
                return;
            }
            if (!this._isModuleLoaded(RNSentry)) {
                throw this._NativeClientError;
            }
            const [envelopeHeader, envelopeItems] = envelope;
            const headerString = JSON.stringify(envelopeHeader);
            const headerBytes = utf8ToBytes(headerString);
            let envelopeBytes = new Uint8Array(headerBytes.length + EOL.length);
            envelopeBytes.set(headerBytes);
            envelopeBytes.set(EOL, headerBytes.length);
            let hardCrashed = false;
            for (const rawItem of envelopeItems) {
                const [itemHeader, itemPayload] = this._processItem(rawItem);
                let bytesContentType;
                let bytesPayload;
                if (typeof itemPayload === 'string') {
                    bytesContentType = 'text/plain';
                    bytesPayload = utf8ToBytes(itemPayload);
                }
                else if (itemPayload instanceof Uint8Array) {
                    bytesContentType =
                        typeof itemHeader.content_type === 'string' ? itemHeader.content_type : 'application/octet-stream';
                    bytesPayload = itemPayload;
                }
                else {
                    bytesContentType = 'application/json';
                    bytesPayload = utf8ToBytes(JSON.stringify(itemPayload));
                    if (!hardCrashed) {
                        hardCrashed = isHardCrash(itemPayload);
                    }
                }
                // Content type is not inside BaseEnvelopeItemHeaders.
                itemHeader.content_type = bytesContentType;
                itemHeader.length = bytesPayload.length;
                const serializedItemHeader = JSON.stringify(itemHeader);
                const bytesItemHeader = utf8ToBytes(serializedItemHeader);
                const newBytes = new Uint8Array(envelopeBytes.length + bytesItemHeader.length + EOL.length + bytesPayload.length + EOL.length);
                newBytes.set(envelopeBytes);
                newBytes.set(bytesItemHeader, envelopeBytes.length);
                newBytes.set(EOL, envelopeBytes.length + bytesItemHeader.length);
                newBytes.set(bytesPayload, envelopeBytes.length + bytesItemHeader.length + EOL.length);
                newBytes.set(EOL, envelopeBytes.length + bytesItemHeader.length + EOL.length + bytesPayload.length);
                envelopeBytes = newBytes;
            }
            yield RNSentry.captureEnvelope(base64StringFromByteArray(envelopeBytes), { hardCrashed });
        });
    },
    /**
     * Starts native with the provided options.
     * @param options ReactNativeClientOptions
     */
    initNativeSdk(originalOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = Object.assign({ enableNative: true, autoInitializeNativeSdk: true }, originalOptions);
            if (!options.enableNative) {
                if (options.enableNativeNagger) {
                    logger.warn('Note: Native Sentry SDK is disabled.');
                }
                this.enableNative = false;
                return false;
            }
            if (!options.autoInitializeNativeSdk) {
                if (options.enableNativeNagger) {
                    logger.warn('Note: Native Sentry SDK was not initialized automatically, you will need to initialize it manually. If you wish to disable the native SDK and get rid of this warning, pass enableNative: false');
                }
                this.enableNative = true;
                return false;
            }
            if (!options.dsn) {
                logger.warn('Warning: No DSN was provided. The Sentry SDK will be disabled. Native SDK will also not be initalized.');
                this.enableNative = false;
                return false;
            }
            if (!this._isModuleLoaded(RNSentry)) {
                throw this._NativeClientError;
            }
            // filter out all the options that would crash native.
            /* eslint-disable @typescript-eslint/unbound-method,@typescript-eslint/no-unused-vars */
            const { beforeSend, beforeBreadcrumb, beforeSendTransaction, integrations } = options, filteredOptions = __rest(options, ["beforeSend", "beforeBreadcrumb", "beforeSendTransaction", "integrations"]);
            /* eslint-enable @typescript-eslint/unbound-method,@typescript-eslint/no-unused-vars */
            const nativeIsReady = yield RNSentry.initNativeSdk(filteredOptions);
            this.nativeIsReady = nativeIsReady;
            this.enableNative = true;
            return nativeIsReady;
        });
    },
    /**
     * Fetches the release from native
     */
    fetchNativeRelease() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.enableNative) {
                throw this._DisabledNativeError;
            }
            if (!this._isModuleLoaded(RNSentry)) {
                throw this._NativeClientError;
            }
            return RNSentry.fetchNativeRelease();
        });
    },
    /**
     * Fetches the Sdk info for the native sdk.
     */
    fetchNativeSdkInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.enableNative) {
                throw this._DisabledNativeError;
            }
            if (!this._isModuleLoaded(RNSentry)) {
                throw this._NativeClientError;
            }
            return RNSentry.fetchNativeSdkInfo();
        });
    },
    /**
     * Fetches the device contexts. Not used on Android.
     */
    fetchNativeDeviceContexts() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.enableNative) {
                throw this._DisabledNativeError;
            }
            if (!this._isModuleLoaded(RNSentry)) {
                throw this._NativeClientError;
            }
            return RNSentry.fetchNativeDeviceContexts();
        });
    },
    fetchNativeAppStart() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.enableNative) {
                logger.warn(this._DisabledNativeError);
                return null;
            }
            if (!this._isModuleLoaded(RNSentry)) {
                logger.error(this._NativeClientError);
                return null;
            }
            return RNSentry.fetchNativeAppStart();
        });
    },
    fetchNativeFrames() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.enableNative) {
                throw this._DisabledNativeError;
            }
            if (!this._isModuleLoaded(RNSentry)) {
                throw this._NativeClientError;
            }
            return RNSentry.fetchNativeFrames();
        });
    },
    /**
     * Triggers a native crash.
     * Use this only for testing purposes.
     */
    nativeCrash() {
        if (!this.enableNative) {
            return;
        }
        if (!this._isModuleLoaded(RNSentry)) {
            throw this._NativeClientError;
        }
        RNSentry.crash();
    },
    /**
     * Sets the user in the native scope.
     * Passing null clears the user.
     */
    setUser(user) {
        if (!this.enableNative) {
            return;
        }
        if (!this._isModuleLoaded(RNSentry)) {
            throw this._NativeClientError;
        }
        // separate and serialize all non-default user keys.
        let userKeys = null;
        let userDataKeys = null;
        if (user) {
            const { id, ip_address, email, username, segment } = user, otherKeys = __rest(user, ["id", "ip_address", "email", "username", "segment"]);
            const requiredUser = {
                id,
                ip_address,
                email,
                username,
                segment,
            };
            userKeys = this._serializeObject(requiredUser);
            userDataKeys = this._serializeObject(otherKeys);
        }
        RNSentry.setUser(userKeys, userDataKeys);
    },
    /**
     * Sets a tag in the native module.
     * @param key string
     * @param value string
     */
    setTag(key, value) {
        if (!this.enableNative) {
            return;
        }
        if (!this._isModuleLoaded(RNSentry)) {
            throw this._NativeClientError;
        }
        const stringifiedValue = typeof value === 'string' ? value : JSON.stringify(value);
        RNSentry.setTag(key, stringifiedValue);
    },
    /**
     * Sets an extra in the native scope, will stringify
     * extra value if it isn't already a string.
     * @param key string
     * @param extra any
     */
    setExtra(key, extra) {
        if (!this.enableNative) {
            return;
        }
        if (!this._isModuleLoaded(RNSentry)) {
            throw this._NativeClientError;
        }
        // we stringify the extra as native only takes in strings.
        const stringifiedExtra = typeof extra === 'string' ? extra : JSON.stringify(extra);
        RNSentry.setExtra(key, stringifiedExtra);
    },
    /**
     * Adds breadcrumb to the native scope.
     * @param breadcrumb Breadcrumb
     */
    addBreadcrumb(breadcrumb) {
        if (!this.enableNative) {
            return;
        }
        if (!this._isModuleLoaded(RNSentry)) {
            throw this._NativeClientError;
        }
        RNSentry.addBreadcrumb(Object.assign(Object.assign({}, breadcrumb), { 
            // Process and convert deprecated levels
            level: breadcrumb.level ? this._processLevel(breadcrumb.level) : undefined }));
    },
    /**
     * Clears breadcrumbs on the native scope.
     */
    clearBreadcrumbs() {
        if (!this.enableNative) {
            return;
        }
        if (!this._isModuleLoaded(RNSentry)) {
            throw this._NativeClientError;
        }
        RNSentry.clearBreadcrumbs();
    },
    /**
     * Sets context on the native scope. Not implemented in Android yet.
     * @param key string
     * @param context key-value map
     */
    setContext(key, context) {
        if (!this.enableNative) {
            return;
        }
        if (!this._isModuleLoaded(RNSentry)) {
            throw this._NativeClientError;
        }
        RNSentry.setContext(key, context !== null ? normalize(context) : null);
    },
    /**
     * Closes the Native Layer SDK
     */
    closeNativeSdk() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.enableNative) {
                return;
            }
            if (!this._isModuleLoaded(RNSentry)) {
                return;
            }
            return RNSentry.closeNativeSdk().then(() => {
                this.enableNative = false;
            });
        });
    },
    disableNativeFramesTracking() {
        if (!this.enableNative) {
            return;
        }
        if (!this._isModuleLoaded(RNSentry)) {
            return;
        }
        RNSentry.disableNativeFramesTracking();
    },
    enableNativeFramesTracking() {
        if (!this.enableNative) {
            return;
        }
        if (!this._isModuleLoaded(RNSentry)) {
            return;
        }
        RNSentry.enableNativeFramesTracking();
    },
    isNativeAvailable() {
        return this._isModuleLoaded(RNSentry);
    },
    captureScreenshot() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.enableNative) {
                logger.warn(this._DisabledNativeError);
                return null;
            }
            if (!this._isModuleLoaded(RNSentry)) {
                logger.error(this._NativeClientError);
                return null;
            }
            let raw;
            try {
                raw = yield RNSentry.captureScreenshot();
            }
            catch (e) {
                logger.warn('Failed to capture screenshot', e);
            }
            if (raw) {
                return raw.map((item) => (Object.assign(Object.assign({}, item), { data: new Uint8Array(item.data) })));
            }
            else {
                return null;
            }
        });
    },
    fetchViewHierarchy() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.enableNative) {
                throw this._DisabledNativeError;
            }
            if (!this._isModuleLoaded(RNSentry)) {
                throw this._NativeClientError;
            }
            const raw = yield RNSentry.fetchViewHierarchy();
            return raw ? new Uint8Array(raw) : null;
        });
    },
    startProfiling() {
        if (!this.enableNative) {
            throw this._DisabledNativeError;
        }
        if (!this._isModuleLoaded(RNSentry)) {
            throw this._NativeClientError;
        }
        const { started, error } = RNSentry.startProfiling();
        if (started) {
            logger.log('[NATIVE] Start Profiling');
        }
        else {
            logger.error('[NATIVE] Start Profiling Failed', error);
        }
        return !!started;
    },
    stopProfiling() {
        if (!this.enableNative) {
            throw this._DisabledNativeError;
        }
        if (!this._isModuleLoaded(RNSentry)) {
            throw this._NativeClientError;
        }
        const { profile, nativeProfile, androidProfile, error } = RNSentry.stopProfiling();
        if (!profile || error) {
            logger.error('[NATIVE] Stop Profiling Failed', error);
            return null;
        }
        if (Platform.OS === 'ios' && !nativeProfile) {
            logger.warn('[NATIVE] Stop Profiling Failed: No Native Profile');
        }
        if (Platform.OS === 'android' && !androidProfile) {
            logger.warn('[NATIVE] Stop Profiling Failed: No Android Profile');
        }
        try {
            return {
                hermesProfile: JSON.parse(profile),
                nativeProfile: nativeProfile,
                androidProfile: androidProfile,
            };
        }
        catch (e) {
            logger.error('[NATIVE] Failed to parse Hermes Profile JSON', e);
            return null;
        }
    },
    fetchNativePackageName() {
        if (!this.enableNative) {
            return null;
        }
        if (!this._isModuleLoaded(RNSentry)) {
            return null;
        }
        return RNSentry.fetchNativePackageName() || null;
    },
    fetchNativeStackFramesBy(instructionsAddr) {
        if (!this.enableNative) {
            return null;
        }
        if (!this._isModuleLoaded(RNSentry)) {
            return null;
        }
        return RNSentry.fetchNativeStackFramesBy(instructionsAddr) || null;
    },
    initNativeReactNavigationNewFrameTracking() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.enableNative) {
                return;
            }
            if (!this._isModuleLoaded(RNSentry)) {
                return;
            }
            return RNSentry.initNativeReactNavigationNewFrameTracking();
        });
    },
    captureReplay(isHardCrash) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.enableNative) {
                logger.warn(`[NATIVE] \`${this.captureReplay.name}\` is not available when native is disabled.`);
                return Promise.resolve(null);
            }
            if (!this._isModuleLoaded(RNSentry)) {
                logger.warn(`[NATIVE] \`${this.captureReplay.name}\` is not available when native is not available.`);
                return Promise.resolve(null);
            }
            return (yield RNSentry.captureReplay(isHardCrash)) || null;
        });
    },
    getCurrentReplayId() {
        if (!this.enableNative) {
            logger.warn(`[NATIVE] \`${this.getCurrentReplayId.name}\` is not available when native is disabled.`);
            return null;
        }
        if (!this._isModuleLoaded(RNSentry)) {
            logger.warn(`[NATIVE] \`${this.getCurrentReplayId.name}\` is not available when native is not available.`);
            return null;
        }
        return RNSentry.getCurrentReplayId() || null;
    },
    crashedLastRun() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.enableNative) {
                return false;
            }
            if (!this._isModuleLoaded(RNSentry)) {
                return false;
            }
            return RNSentry.crashedLastRun();
        });
    },
    /**
     * Gets the event from envelopeItem and applies the level filter to the selected event.
     * @param data An envelope item containing the event.
     * @returns The event from envelopeItem or undefined.
     */
    _processItem(item) {
        const [itemHeader, itemPayload] = item;
        if (itemHeader.type == 'event' || itemHeader.type == 'transaction') {
            const event = this._processLevels(itemPayload);
            if (NATIVE.platform === 'android') {
                if ('message' in event) {
                    // @ts-expect-error Android still uses the old message object, without this the serialization of events will break.
                    event.message = { message: event.message };
                }
            }
            return [itemHeader, event];
        }
        return item;
    },
    /**
     * Serializes all values of root-level keys into strings.
     * @param data key-value map.
     * @returns An object where all root-level values are strings.
     */
    _serializeObject(data) {
        const serialized = {};
        Object.keys(data).forEach(dataKey => {
            const value = data[dataKey];
            serialized[dataKey] = typeof value === 'string' ? value : JSON.stringify(value);
        });
        return serialized;
    },
    /**
     * Convert js severity level in event.level and event.breadcrumbs to more widely supported levels.
     * @param event
     * @returns Event with more widely supported Severity level strings
     */
    _processLevels(event) {
        var _a;
        const processed = Object.assign(Object.assign({}, event), { level: event.level ? this._processLevel(event.level) : undefined, breadcrumbs: (_a = event.breadcrumbs) === null || _a === void 0 ? void 0 : _a.map(breadcrumb => (Object.assign(Object.assign({}, breadcrumb), { level: breadcrumb.level ? this._processLevel(breadcrumb.level) : undefined }))) });
        return processed;
    },
    /**
     * Convert js severity level which has critical and log to more widely supported levels.
     * @param level
     * @returns More widely supported Severity level strings
     */
    _processLevel(level) {
        if (level == 'log') {
            return 'debug';
        }
        return level;
    },
    /**
     * Checks whether the RNSentry module is loaded.
     */
    _isModuleLoaded(module) {
        return !!module;
    },
    _DisabledNativeError: new SentryError('Native is disabled'),
    _NativeClientError: new SentryError("Native Client is not available, can't start on native."),
    enableNative: true,
    nativeIsReady: false,
    platform: Platform.OS,
};
//# sourceMappingURL=wrapper.js.map