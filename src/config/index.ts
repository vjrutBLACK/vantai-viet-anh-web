/**
 * App configuration - Single source of truth
 */

export const APP_CONFIG = {
  /** API base URL - change for production */
  API_BASE_URL: import.meta.env.VITE_API_URL || '/api/v1',

  /** App title */
  APP_TITLE: 'Vận Tải Anh Việt',

  /** Token storage key */
  TOKEN_KEY: 'vantai_token',

  /** User storage key */
  USER_KEY: 'vantai_user',
} as const;
