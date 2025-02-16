export enum BadRequestMessage {
  InvalidLoginData = 'اطلاعات ارسال شده برای احراز هویت نامعتبر است',
  InvalidRegisterData = 'اطلاعات ارسال شده برای ثبت نام نامعتبر است',
  SomeThingWrong = 'خطایی رخ داده است',
}
export enum AuthMessage {
  InvalidAuthType = 'حساب کاربری با این مشخصات قبلا ثبت شده است',
  InvalidLogin = 'Invalid login',
  UserNotFound = 'User not found',
  OtpNotExpired = 'کد اعتبارسنجی قبلی شما هنوز منقضی نشده است',
  SentOtp = 'کد اعتبارسنجی به شما ارسال شد',
  ExpiredCode = 'کد اعتبارسنجی منقضی شده است',
  TryAgain = 'لطفا دوباره تلاش کنید',
  LoginAgain = 'لطفا دوباره وارد شوید',
  LoginIsRequired = 'لطفا وارد حساب کاربری خود شوید',
  EmailExist = 'این ایمیل از قبل وجود دارد.',
  InvalidEmail = 'ایمیل نامعتبر است',
  InvalidPhone = 'شماره موبایل نامعتبر است',
}
export enum NotFoundMessage {
  NotFoundCategory = 'دسته بندی یافت نشد.',
}
export enum ValidationMessage {
  ImageFormatIncorrect = 'فرمت تصویر باید یکی از فرمت های زیر باشد: png, jpg, jpeg, gif, svg, webp, bmp, tiff, ico, jpe',
  EmailIsInvalid = 'ایمیل نامعتبر است',
  PhoneIsInvalid = 'شماره موبایل نامعتبر است',
}
export enum PublicMessage {
  LoggedIn = 'با موفقیت وارد شدید',
  Created = ' با موفقیت ساخته شد.',
  Deleted = 'با موفقیت حذف شد.',
  Updated = 'با موفقیت به روز رسانی شد',
  SentOtp = 'کد اعتبارسنجی به شما ارسال شد',
}

export enum ConflictMessage {
  CategoryTitle = 'این دسته بندی از قبل وجود دارد.',
}
