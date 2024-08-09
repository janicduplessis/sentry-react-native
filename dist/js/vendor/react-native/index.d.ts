export type StackFrame = {
    column?: number;
    file?: string;
    lineNumber?: number;
    methodName: string;
    collapse?: boolean;
};
export type CodeFrame = Readonly<{
    content: string;
    location?: {
        [key: string]: unknown;
        row: number;
        column: number;
    };
    fileName: string;
}>;
export type SymbolicatedStackTrace = Readonly<{
    stack: Array<StackFrame>;
    codeFrame?: CodeFrame;
}>;
export type DevServerInfo = {
    [key: string]: unknown;
    url: string;
    fullBundleUrl?: string;
    bundleLoadedFromServer: boolean;
};
type TurboModule = {
    getConstants?(): object;
};
export type TurboModuleRegistry = {
    get<T extends TurboModule>(name: string): T | null;
    getEnforcing<T extends TurboModule>(name: string): T;
};
export type ReactNativeVersion = {
    version: {
        major: number;
        minor: number;
        patch: number;
        prerelease?: number | null | undefined;
    };
};
export {};
//# sourceMappingURL=index.d.ts.map