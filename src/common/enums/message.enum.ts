export enum BadRequestMessage {
    InvalidLoginData="اطلاعات ارسال شده برای احراز هویت نامعتبر است",
    InvalidRegisterData="اطلاعات ارسال شده برای ثبت نام نامعتبر است",
    }
export enum AuthMessage {
    InvalidAuthType = 'حساب کاربری با این مشخصات قبلا ثبت شده است',
    InvalidLogin = 'Invalid login',
    UserNotFound = 'User not found',
    OtpNotExpired = 'کد اعتبارسنجی قبلی شما هنوز منقضی نشده است',
    SentOtp = "کد اعتبارسنجی به شما ارسال شد",
    ExpiredCode = "کد اعتبارسنجی منقضی شده است",
    TryAgain = "لطفا دوباره تلاش کنید",
    LoginAgain = "لطفا دوباره وارد شوید",
    }
export enum NotFoundMessage {

}
export enum ValidationMessage {

}
export enum PublicMessage {
    LoggedIn = 'با موفقیت وارد شدید',
}