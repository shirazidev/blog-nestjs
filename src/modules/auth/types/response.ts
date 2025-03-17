export type AuthResponse = {
  otpcode: string;
  token: string;
};
export type GoogleUser = {
  firstName?: string;
  lastName?: string;
  email: string;
  picture?: string;
  accessToken: string;
  refreshToken: string;
};
