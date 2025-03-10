namespace NodeJS {
  interface ProcessEnv {
    // Application
    PORT: number;

    // Database
    DBPORT: number;
    DBHOST: string;
    DBUSERNAME: string;
    DBPASSWORD: string;
    DB: string;

    // Secrets
    COOKIE_SECRET: string;
    OTP_TOKEN_SECRET: string;
    ACCESSTOKENJWT: string;
    REFRESHTOKENJWT: string;
    PHONE_SECRET_TOKEN: string;
    EMAIL_SECRET_TOKEN: string;
    SEND_SMS_URL: string;
  }
}
