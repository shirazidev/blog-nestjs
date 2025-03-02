export enum BadRequestMessage {
  InvalidLoginData = 'اطلاعات ارسال شده برای احراز هویت نامعتبر است',
  InvalidRegisterData = 'اطلاعات ارسال شده برای ثبت نام نامعتبر است',
  SomeThingWrong = 'خطایی رخ داده است',
  InvalidCategory = 'دسته بندی ها را به درستی وارد کنید.',
  InvalidComment = 'متن نظر را به درستی وارد کنید.',
  CannotComment = 'شما نمیتوانید در این مقاله نظر بگذارید',
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
  PhoneExist = 'این شماره موبایل از قبل وجود دارد.',
  InvalidEmail = 'ایمیل نامعتبر است',
  InvalidPhone = 'شماره موبایل نامعتبر است',
  UsernameExist = 'این نام کاربری از قبل وجود دارد.',
}
export enum NotFoundMessage {
  NotFoundCategory = 'دسته بندی یافت نشد.',
  NotFoundBlog = 'مقاله مورد نظر یافت نشد.',
}
export enum ValidationMessage {
  ImageFormatIncorrect = 'فرمت تصویر باید یکی از فرمت های زیر باشد: png, jpg, jpeg, gif, svg, webp, bmp, tiff, ico, jpe',
  EmailIsInvalid = 'ایمیل نامعتبر است',
  PhoneIsInvalid = 'شماره موبایل نامعتبر است',
  BlogIsNotYours = 'این مقاله متعلق به شما نیست',
}
export enum PublicMessage {
  LoggedIn = 'با موفقیت وارد شدید',
  Created = ' با موفقیت ساخته شد.',
  Deleted = 'با موفقیت حذف شد.',
  Updated = 'با موفقیت به روز رسانی شد',
  SentOtp = 'کد اعتبارسنجی به شما ارسال شد',
  Liked = 'با موفقیت لایک شد',
  DisLiked = 'لایک شما با موفقیت برداشته شد',
  Bookmarked = 'با موفقیت نشانه گذاری شد',
  unBookmarked = 'نشانه گذاری شما با موفقیت برداشته شد',
  Accepted = 'با موفقیت تایید شد',
  Rejected = 'با موفقیت رد شد',
}

export enum ConflictMessage {
  CategoryTitle = 'این دسته بندی از قبل وجود دارد.',
}
