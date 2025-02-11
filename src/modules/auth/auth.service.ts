import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthTypeEnum } from './enums/type.enum';
import { AuthMethod } from './enums/method.enum';
import { isEmail, isMobilePhone } from 'class-validator';
import { ProfileEntity } from '../user/entities/profile.entity';
import { AuthMessage, BadRequestMessage } from 'src/common/enums/message.enum';
import { OtpEntity } from '../user/entities/otp.entity';
import { randomInt } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(OtpEntity)
    private otpRepository: Repository<OtpEntity>,
  ) {}
  async userExistence(authDto: AuthDto) {
    const { username, method, type } = authDto;
    switch (type) {
      case AuthTypeEnum.Login:
        return this.login(username, method);
      case AuthTypeEnum.Register:
        return this.register(username, method);
      default:
        throw new UnauthorizedException('Invalid auth type');
    }
  }
  async login(username: string, method: AuthMethod) {
    const validUsername = this.usernameValidator(username, method);
    let user: UserEntity = await this.checkExistUser(method, validUsername);
    if (!user) throw new UnauthorizedException(AuthMessage.UserNotFound);
    const otp = await this.SaveOtp(user.id);
    return {
      message: `کد اعتبارسنجی به ${method} شما ارسال شد`,
      otpcode: otp.code,
    };
  }
  async register(username: string, method: AuthMethod) {
    const validUsername = this.usernameValidator(username, method);
    let user: UserEntity = await this.checkExistUser(method, validUsername);
    if (user) throw new UnauthorizedException(AuthMessage.InvalidAuthType);
    if (method === AuthMethod.Username)
      throw new UnauthorizedException(BadRequestMessage.InvalidRegisterData);
    user = this.userRepository.create({ [method]: username });
    user = await this.userRepository.save(user);
    await this.userRepository.update(user.id, {username: `m_${user.id},`});
    const otp = await this.SaveOtp(user.id);
    return {
      message: `کد اعتبارسنجی به ${method} شما ارسال شد`,
      otpcode: otp.code,
    };
  }
  async SaveOtp(userId: number) {
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
    } else {
      otp = this.otpRepository.create({ code, expires_in, userId });
    }
    otp = await this.otpRepository.save(otp);
    // #todo send sms as email or phone
    if (!existOtp) {
      await this.userRepository.update(userId, { otpId: otp.id });
    }
    return otp;
  }
  async checkOtp() {}
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
}
