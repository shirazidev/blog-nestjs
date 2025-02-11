export type CookiePayload = {
    userId: number
}
export type JwtPayload = {
    userId: number,
    username: string
}
export type JwtVerify = {
    token: string,
}