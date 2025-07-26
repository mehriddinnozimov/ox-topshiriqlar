export const OTP_KEY = 'otp';
export const OTP_LENGTH = 6;
export const MAX_OTP_INTEGER = 10 ** OTP_LENGTH - 1;
export const MIN_OTP_INTEGER = 0;
export const OTP_TTL_IN_SECONDS = 5 * 60;
export const OTS_LENGTH = 16;

export const ACCESS_JWT_TTL = '1d';
export const REFRESH_JWT_TTL = '7d';

export const SWAGGER_PATH = '/docs';

export const REFRESH_JWT_COOKIE_KEY = 'rt';

export const ACCESS_JWT_TTL_IN_MS = 24 * 60 * 60 * 1000; // 1 day
export const REFRESH_JWT_TTL_IN_MS = 7 * 24 * 60 * 1000; // 7 days

export const SWAGGER_AUTH_KEY = 'Authorization';
export const FORBIDDEN_TOKEN_KEY = 'forbidden_token';
