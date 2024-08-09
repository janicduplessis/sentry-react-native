import type { IdleTransaction, Span as SpanClass, Transaction } from '@sentry/core';
import type { Span, TransactionContext, TransactionSource } from '@sentry/types';
export declare const defaultTransactionSource: TransactionSource;
export declare const customTransactionSource: TransactionSource;
export declare const getBlankTransactionContext: (name: string) => TransactionContext;
/**
 * A margin of error of 50ms is allowed for the async native bridge call.
 * Anything larger would reduce the accuracy of our frames measurements.
 */
export declare const MARGIN_OF_ERROR_SECONDS = 0.05;
/**
 *
 */
export declare function adjustTransactionDuration(maxDurationMs: number, transaction: IdleTransaction, endTimestamp: number): void;
/**
 * Returns the timestamp where the JS global scope was initialized.
 */
export declare function getTimeOriginMilliseconds(): number;
/**
 * Calls the callback every time a child span of the transaction is finished.
 */
export declare function instrumentChildSpanFinish(transaction: Transaction, callback: (span: SpanClass, endTimestamp?: number) => void): void;
/**
 * Determines if the timestamp is now or within the specified margin of error from now.
 */
export declare function isNearToNow(timestamp: number): boolean;
/**
 * Sets the duration of the span as a measurement.
 * Uses `setMeasurement` function from @sentry/core.
 */
export declare function setSpanDurationAsMeasurement(name: string, span: Span): void;
/**
 * Returns unix timestamp in ms of the bundle start time.
 *
 * If not available, returns undefined.
 */
export declare function getBundleStartTimestampMs(): number | undefined;
//# sourceMappingURL=utils.d.ts.map
