/**
 * Original ENV.
 * Guarded against environments where the global "process" object does not
 * exist at all (e.g. some non-Node SSR/edge runtimes), since this is a
 * top-level statement executed immediately on module import.
 */
export const originalEnv = typeof process !== 'undefined' ? process.env : ({} as NodeJS.ProcessEnv);

/**
 * Defines the current environment type (client or server).
 * Guarded with "typeof" checks (rather than referencing "window"/"document"
 * directly) so this never throws a ReferenceError when imported/rendered in
 * a non-browser environment (e.g. SSR via "react-dom/server").
 */
export const isClient = () => typeof window !== 'undefined' && typeof document !== 'undefined';

/**
 * Defines the current environment type (development or production).
 * Guarded so this never throws in an environment where the global "process"
 * object does not exist (e.g. some non-Node SSR/edge runtimes).
 */
export const isProduction = () => typeof process !== 'undefined' && process.env?.NODE_ENV === 'production';

/**
 * Defines if the current environment type is "test"
 */
export const isTest = () => !isProduction() && typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';
