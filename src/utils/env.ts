/**
 * Original ENV
 */
export const originalEnv = process.env;

/**
 * Defines the current environment type (client or server)
 */
export const isClient = () => window && typeof window === 'object';

/**
 * Defines the current environment type (development or production)
 */
export const isProduction = () => process.env.NODE_ENV === 'production';

/**
 * Defines if the current environment type is "test"
 */
export const isTest = () => !isProduction() && process.env.NODE_ENV === 'test';
