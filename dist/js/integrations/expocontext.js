import { convertIntegrationFnToClass } from '@sentry/core';
import { getExpoDevice } from '../utils/expomodules';
const INTEGRATION_NAME = 'ExpoContext';
/** Load device context from expo modules. */
export const expoContextIntegration = () => {
    return {
        name: INTEGRATION_NAME,
        setupOnce: () => {
            // noop
        },
        processEvent,
    };
};
/**
 * Load device context from expo modules.
 *
 * @deprecated Use `expoContextIntegration()` instead.
 */
// eslint-disable-next-line deprecation/deprecation
export const ExpoContext = convertIntegrationFnToClass(INTEGRATION_NAME, expoContextIntegration);
function processEvent(event) {
    const expoDeviceContext = getExpoDeviceContext();
    if (expoDeviceContext) {
        event.contexts = event.contexts || {};
        event.contexts.device = Object.assign(Object.assign({}, expoDeviceContext), event.contexts.device);
    }
    const expoOsContext = getExpoOsContext();
    if (expoOsContext) {
        event.contexts = event.contexts || {};
        event.contexts.os = Object.assign(Object.assign({}, expoOsContext), event.contexts.os);
    }
    return event;
}
/**
 * Returns the Expo Device context if present
 */
function getExpoDeviceContext() {
    const expoDevice = getExpoDevice();
    if (!expoDevice) {
        return undefined;
    }
    return {
        name: expoDevice.deviceName,
        simulator: !(expoDevice === null || expoDevice === void 0 ? void 0 : expoDevice.isDevice),
        model: expoDevice.modelName,
        manufacturer: expoDevice.manufacturer,
        memory_size: expoDevice.totalMemory,
    };
}
/**
 * Returns the Expo OS context if present
 */
function getExpoOsContext() {
    const expoDevice = getExpoDevice();
    if (!expoDevice) {
        return undefined;
    }
    return {
        build: expoDevice.osBuildId,
        version: expoDevice.osVersion,
        name: expoDevice.osName,
    };
}
//# sourceMappingURL=expocontext.js.map