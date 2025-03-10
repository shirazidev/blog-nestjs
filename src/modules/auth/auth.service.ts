import { TokenService } from './tokens.service';
import {
  BadRequestException,
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto, CheckOtpDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthTypeEnum } from './enums/type.enum';
import { AuthMethod } from './enums/method.enum';
import { isEmail, isMobilePhone } from 'class-validator';
import { ProfileEntity } from '../user/entities/profile.entity';
import {
  AuthMessage,
  BadRequestMessage,
  PublicMessage,
} from 'src/common/enums/message.enum';
import { OtpEntity } from '../user/entities/otp.entity';
import { randomInt } from 'crypto';
import { Request, Response } from 'express';
import { cookieKeys } from 'src/common/enums/cookie.enum';
import { AuthResponse } from './types/response';
import { REQUEST } from '@nestjs/core';
import { CookiesOptionsToken } from 'src/common/utils/cookie.util';
import { KavenegarService } from '../http/kavenegar.service';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(OtpEntity)
    private otpRepository: Repository<OtpEntity>,
    private tokenService: TokenService,
    private kavenegarService: KavenegarService,
    @Inject(REQUEST) private request: Request,
  ) {}
  async userExistence(authDto: AuthDto, res: Response) {
    const { username, method, type } = authDto;
    let result: AuthResponse;
    switch (type) {
      case AuthTypeEnum.Login:
        result = await this.login(username, method, res);
        await this.sendOtp(method, username, result.otpcode);
        return this.sendResponse(result, res);
      case AuthTypeEnum.Register:
        result = await this.register(username, method, res);
        await this.sendOtp(method, username, result.otpcode);
        return this.sendResponse(result, res);
      default:
        throw new UnauthorizedException('Invalid auth type');
    }
  }
  async sendOtp(method: AuthMethod, username: string, code: string) {
    if (method === AuthMethod.Email) {
    } else if (method === AuthMethod.Phone) {
      await this.kavenegarService.SendVerificationSMS(username, code);
    }
  }
  async login(username: string, method: AuthMethod, res: Response) {
    const validUsername = this.usernameValidator(username, method);
    let user: UserEntity = await this.checkExistUser(method, validUsername);
    if (!user) throw new UnauthorizedException(AuthMessage.UserNotFound);
    const otp = await this.SaveOtp(user.id, method);
    const token = this.tokenService.createOtpToken({ userId: user.id });
    res.cookie(cookieKeys.OTP, token, { httpOnly: true });
    return {
      otpcode: otp.code,
      token,
    };
  }
  async register(username: string, method: AuthMethod, res: Response) {
    const validUsername = this.usernameValidator(username, method);
    let user: UserEntity = await this.checkExistUser(method, validUsername);
    if (user) throw new UnauthorizedException(AuthMessage.InvalidAuthType);
    if (method === AuthMethod.Username)
      throw new UnauthorizedException(BadRequestMessage.InvalidRegisterData);
    user = this.userRepository.create({ [method]: username });
    user = await this.userRepository.save(user);
    await this.userRepository.update(user.id, { username: `m_${user.id},` });
    const otp = await this.SaveOtp(user.id, method);
    otp.method = method;
    await this.otpRepository.save(otp);
    const token = this.tokenService.createOtpToken({ userId: user.id });
    res.cookie(cookieKeys.OTP, token, { httpOnly: true });
    return {
      otpcode: otp.code,
      token,
      mobile: user.phone,
    };
  }
  async sendResponse(result: AuthResponse, res: Response) {
    const { token } = result;
    res.cookie(cookieKeys.OTP, token, CookiesOptionsToken());
    res.json({
      message: AuthMessage.SentOtp,
    });
  }
  async SaveOtp(userId: number, method: AuthMethod) {
    const code = randomInt(10000, 99999).toString();
    const expires_in = new Date(Date.now() + 60000 * 2);
    let otp = await this.otpRepository.findOneBy({ userId: userId });
    let existOtp = false;
    if (otp) {
      if (otp.expires_in > new Date())
        throw new UnauthorizedException(AuthMessage.OtpNotExpired);
      existOtp = true;
      otp.code = code;
      otp.expires_in = expires_in;
      otp.method = method;
    } else {
      otp = this.otpRepository.create({ code, expires_in, userId, method });
    }
    otp = await this.otpRepository.save(otp);
    // #todo send sms as email or phone
    if (!existOtp) {
      await this.userRepository.update(userId, { otpId: otp.id });
    }
    return otp;
  }
  async checkOtp(checkOtpDto: CheckOtpDto) {
    const { code } = checkOtpDto;
    let token = this.request?.cookies[cookieKeys.OTP];
    let user: any;
    if (!token) throw new UnauthorizedException(AuthMessage.ExpiredCode);
    const { userId } = this.tokenService.verifyOtpToken(token);
    const otp = await this.otpRepository.findOneBy({ userId });
    const now = new Date();
    if (!otp || otp.code !== code || otp.expires_in < now)
      throw new UnauthorizedException(AuthMessage.ExpiredCode);

    user = await this.userRepository.findOneBy({ id: userId });
    let payload = {
      userId: user?.id,
      username: user?.username,
    };
    const { accessToken, refreshToken } =
      this.tokenService.createJwtToken(payload);
    if (otp.method === AuthMethod.Email) {
      await this.userRepository.update(
        { id: userId },
        {
          verifyEmail: true,
        },
      );
    } else if (otp.method === AuthMethod.Phone) {
      await this.userRepository.update(
        { id: userId },
        {
          verifyPhone: true,
        },
      );
    }

    return { accessToken, refreshToken, message: PublicMessage.LoggedIn };
  }
  async checkExistUser(method: AuthMethod, username: string) {
    let user;
    if (method === AuthMethod.Username) {
      user = await this.userRepository.findOneBy({ username: username });
    } else if (method === AuthMethod.Phone) {
      user = await this.userRepository.findOneBy({ phone: username });
    } else if (method === AuthMethod.Email) {
      user = await this.userRepository.findOneBy({ email: username });
    } else {
      throw new UnauthorizedException(BadRequestMessage.InvalidLoginData);
    }
    return user;
  }
  usernameValidator(username: string, method: AuthMethod) {
    switch (method) {
      case AuthMethod.Email:
        if (isEmail(username)) return username;
        throw new BadRequestException('Invalid email');
      case AuthMethod.Phone:
        if (isMobilePhone(username, 'fa-IR')) return username;
        throw new BadRequestException('Invalid phone number');
      case AuthMethod.Username:
        return username;

      default:
        throw new UnauthorizedException('Invalid username data');
    }
  }
  async validateAccessToken(token: string) {
    const { userId } = await this.tokenService.verifyJwtToken(token);
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        phone: true,
        newPhone: true,
        email: true,
        newEmail: true,
        verifyEmail: true,
        profileId: true,
      },
    });
    if (!user) throw new UnauthorizedException(AuthMessage.LoginAgain);
    return user;
  }
}
