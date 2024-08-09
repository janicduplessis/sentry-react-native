import { eventFromException, eventFromMessage } from '@sentry/browser';
import { BaseClient } from '@sentry/core';
import { dateTimestampInSeconds, logger, SentryError } from '@sentry/utils';
import { Alert } from 'react-native';
import { createIntegration } from './integrations/factory';
import { defaultSdkInfo } from './integrations/sdkinfo';
import { MOBILE_REPLAY_INTEGRATION_NAME } from './replay/mobilereplay';
import { ReactNativeTracing } from './tracing';
import { createUserFeedbackEnvelope, items } from './utils/envelope';
import { ignoreRequireCycleLogs } from './utils/ignorerequirecyclelogs';
import { mergeOutcomes } from './utils/outcome';
import { NATIVE } from './wrapper';
/**
 * The Sentry React Native SDK Client.
 *
 * @see ReactNativeClientOptions for documentation on configuration options.
 * @see SentryClient for usage documentation.
 */
export class ReactNativeClient extends BaseClient {
    /**
     * Creates a new React Native SDK instance.
     * @param options Configuration options for this SDK.
     */
    constructor(options) {
        ignoreRequireCycleLogs();
        options._metadata = options._metadata || {};
        options._metadata.sdk = options._metadata.sdk || defaultSdkInfo;
        super(options);
        this._outcomesBuffer = [];
    }
    /**
     * @inheritDoc
     */
    eventFromException(exception, hint = {}) {
        return eventFromException(this._options.stackParser, exception, hint, this._options.attachStacktrace);
    }
    /**
     * @inheritDoc
     */
    eventFromMessage(message, level, hint) {
        if (this._options.useThreadsForMessageStack) {
            return eventFromMessage(this._options.stackParser, message, level, hint, this._options.attachStacktrace).then((event) => {
                var _a;
                // TMP! Remove this function once JS SDK uses threads for messages
                if (!((_a = event.exception) === null || _a === void 0 ? void 0 : _a.values) || event.exception.values.length <= 0) {
                    return event;
                }
                const values = event.exception.values.map((exception) => ({
                    stacktrace: exception.stacktrace,
                }));
                event.threads = { values };
                delete event.exception;
                return event;
            });
        }
        return eventFromMessage(this._options.stackParser, message, level, hint, this._options.attachStacktrace);
    }
    /**
     * If native client is available it will trigger a native crash.
     * Use this only for testing purposes.
     */
    nativeCrash() {
        NATIVE.nativeCrash();
    }
    /**
     * @inheritDoc
     */
    close() {
        // As super.close() flushes queued events, we wait for that to finish before closing the native SDK.
        return super.close().then((result) => {
            return NATIVE.closeNativeSdk().then(() => result);
        });
    }
    /**
     * Sends user feedback to Sentry.
     */
    captureUserFeedback(feedback) {
        const envelope = createUserFeedbackEnvelope(feedback, {
            metadata: this._options._metadata,
            dsn: this.getDsn(),
            tunnel: undefined,
        });
        this._sendEnvelope(envelope);
    }
    /**
     * @inheritDoc
     */
    init() {
        super.init();
        this._initNativeSdk();
    }
    /**
     * Returns if the app crashed in the last run.
     */
    crashedLastRun() {
        return NATIVE.crashedLastRun();
    }
    /**
     * Sets up the integrations
     */
    _setupIntegrations() {
        var _a;
        super._setupIntegrations();
        const tracing = this.getIntegration(ReactNativeTracing);
        const routingName = (_a = tracing === null || tracing === void 0 ? void 0 : tracing.options.routingInstrumentation) === null || _a === void 0 ? void 0 : _a.name;
        if (routingName) {
            this.addIntegration(createIntegration(routingName));
        }
        const enableUserInteractionTracing = tracing === null || tracing === void 0 ? void 0 : tracing.options.enableUserInteractionTracing;
        if (enableUserInteractionTracing) {
            this.addIntegration(createIntegration('ReactNativeUserInteractionTracing'));
        }
    }
    /**
     * @inheritdoc
     */
    _sendEnvelope(envelope) {
        const outcomes = this._clearOutcomes();
        this._outcomesBuffer = mergeOutcomes(this._outcomesBuffer, outcomes);
        if (this._options.sendClientReports) {
            this._attachClientReportTo(this._outcomesBuffer, envelope);
        }
        let shouldClearOutcomesBuffer = true;
        if (this._isEnabled() && this._transport && this._dsn) {
            this.emit('beforeEnvelope', envelope);
            this._transport.send(envelope).then(null, reason => {
                if (reason instanceof SentryError) {
                    // SentryError is thrown by SyncPromise
                    shouldClearOutcomesBuffer = false;
                    // If this is called asynchronously we want the _outcomesBuffer to be cleared
                    logger.error('SentryError while sending event, keeping outcomes buffer:', reason);
                }
                else {
                    logger.error('Error while sending event:', reason);
                }
            });
        }
        else {
            logger.error('Transport disabled');
        }
        if (shouldClearOutcomesBuffer) {
            this._outcomesBuffer = []; // if send fails synchronously the _outcomesBuffer will stay intact
        }
    }
    /**
     * Starts native client with dsn and options
     */
    _initNativeSdk() {
        NATIVE.initNativeSdk(Object.assign(Object.assign({}, this._options), { mobileReplayOptions: this._integrations[MOBILE_REPLAY_INTEGRATION_NAME] &&
                'options' in this._integrations[MOBILE_REPLAY_INTEGRATION_NAME]
                ? this._integrations[MOBILE_REPLAY_INTEGRATION_NAME].options
                : undefined }))
            .then((result) => {
            return result;
        }, () => {
            this._showCannotConnectDialog();
            return false;
        })
            .then((didCallNativeInit) => {
            var _a, _b;
            (_b = (_a = this._options).onReady) === null || _b === void 0 ? void 0 : _b.call(_a, { didCallNativeInit });
        })
            .then(undefined, error => {
            logger.error('The OnReady callback threw an error: ', error);
        });
    }
    /**
     * If the user is in development mode, and the native nagger is enabled then it will show an alert.
     */
    _showCannotConnectDialog() {
        if (__DEV__ && this._options.enableNativeNagger) {
            Alert.alert('Sentry', 'Warning, could not connect to Sentry native SDK.\nIf you do not want to use the native component please pass `enableNative: false` in the options.\nVisit: https://docs.sentry.io/platforms/react-native/ for more details.');
        }
    }
    /**
     * Attaches a client report from outcomes to the envelope.
     */
    _attachClientReportTo(outcomes, envelope) {
        if (outcomes.length > 0) {
            const clientReportItem = [
                { type: 'client_report' },
                {
                    timestamp: dateTimestampInSeconds(),
                    discarded_events: outcomes,
                },
            ];
            envelope[items].push(clientReportItem);
        }
    }
}
//# sourceMappingURL=client.js.map