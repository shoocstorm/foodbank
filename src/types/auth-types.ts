
export interface User {
  uid: string;
  displayName: string;
  email: string;
  role?: string;
  status?: string; // active, pending, blocked
  organization?: string;
  avatar?: string;
  isVerified?: boolean;
}

export interface SignInError {
    code: string;
    message: string;
  }
  
  export enum SignInErrorCode {
    INVALID_CREDENTIAL = 'auth/invalid-credential',
    INVALID_EMAIL = 'auth/invalid-email',
    USER_DISABLED = 'auth/user-disabled',
    USER_NOT_FOUND = 'auth/user-not-found',
    INVALID_API_KEY = 'auth/invalid-api-key',
    EMAIL_EXISTS = 'auth/email-already-in-use',
    OPERATION_NOT_ALLOWED = 'auth/operation-not-allowed',
    TOO_MANY_REQUESTS = 'auth/too-many-requests',
    WEAK_PASSWORD = 'auth/weak-password',
    INVALID_PASSWORD = 'auth/wrong-password',
    CREDENTIAL_ALREADY_IN_USE = 'auth/credential-already-in-use',
    INVALID_VERIFICATION_CODE = 'auth/invalid-verification-code',
    INVALID_VERIFICATION_ID = 'auth/invalid-verification-id',
    INVALID_PROVIDER_ID = 'auth/invalid-provider-id',
    INVALID_USER_TOKEN = 'auth/invalid-user-token',
    USER_MISMATCH = 'auth/user-mismatch',
    REQUIRES_RECENT_LOGIN = 'auth/requires-recent-login',
    INVALID_ID_TOKEN = 'auth/invalid-id-token',
    INVALID_ACCESS_TOKEN = 'auth/invalid-access-token',
    INVALID_REFRESH_TOKEN = 'auth/invalid-refresh-token',
    INVALID_APP_CREDENTIAL = 'auth/invalid-app-credential',
    INVALID_APP_ID = 'auth/invalid-app-id',
    INVALID_MESSAGING_SENDER_ID = 'auth/invalid-messaging-sender-id',
    INVALID_RECAPTCHA_PARAM = 'auth/invalid-recaptcha-param',
    INVALID_RECAPTCHA_TOKEN = 'auth/invalid-recaptcha-token',
    INVALID_SESSION_COOKIE = 'auth/invalid-session-cookie',
    INVALID_CUSTOM_TOKEN = 'auth/invalid-custom-token',
    INVALID_PERSISTENCE_TYPE = 'auth/invalid-persistence-type',
    UNKNOWN_ERROR = 'auth/unknown-error'
  }
  
  