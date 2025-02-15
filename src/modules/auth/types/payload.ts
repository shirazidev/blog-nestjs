export type CookiePayload = {
  userId: number;
};
export type JwtPayload = {
  userId: number;
  username: string;
};
export type JwtVerify = {
  token: string;
};
export type EmailPayload = {
  email: string;
};
export type PhonePayload = {
    phone: string;
}
