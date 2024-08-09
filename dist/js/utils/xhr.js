import { RN_GLOBAL_OBJ } from './worldwide';
const __sentry_original__ = '__sentry_original__';
/**
 * The DONE ready state for XmlHttpRequest
 *
 * Defining it here as a constant b/c XMLHttpRequest.DONE is not always defined
 * (e.g. during testing, it is `undefined`)
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState}
 */
export const XHR_READYSTATE_DONE = 4;
/**
 * Creates a new XMLHttpRequest object which is not instrumented by the SDK.
 *
 * This request won't be captured by the HttpClient Errors integration
 * and won't be added to breadcrumbs and won't be traced.
 */
export function createStealthXhr(customGlobal = RN_GLOBAL_OBJ) {
    if (!customGlobal.XMLHttpRequest) {
        return null;
    }
    const xhr = new customGlobal.XMLHttpRequest();
    if (xhr.open.__sentry_original__) {
        xhr.open = xhr.open.__sentry_original__;
    }
    if (xhr.send.__sentry_original__) {
        xhr.send = xhr.send.__sentry_original__;
    }
    return xhr;
}
//# sourceMappingURL=xhr.js.map