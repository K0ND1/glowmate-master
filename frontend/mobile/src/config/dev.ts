/**
 * Set this to true to enable auth bypass in development mode.
 * The bypass will ONLY work when __DEV__ is also true (dev builds).
 */
const ENABLE_AUTH_BYPASS = true;

export const devConfig = {
  /**
   * True only in development mode (automatically detected via __DEV__)
   */
  isDev: __DEV__,

  /**
   * Bypasses login/register flow in development when ENABLE_AUTH_BYPASS is true.
   */
  bypassAuth: __DEV__ && ENABLE_AUTH_BYPASS,

  /**
   * Mock user data used when bypassAuth is enabled
   */
  mockUser: {
    id: "dev-user-123",
    email: "dev@glowmate.test",
    name: "Dev User",
  },
};
