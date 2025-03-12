import { UserEntity } from 'src/modules/user/entities/user.entity';
import { TokenService } from './../auth/tokens.service';
import { AuthService } from './../auth/auth.service';
import {
  BadRequestException,
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangeEmailDto, ProfileDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from './entities/profile.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import {
  AuthMessage,
  BadRequestMessage,
  PublicMessage,
} from 'src/common/enums/message.enum';
import { REQUEST } from '@nestjs/core';
import { isDate } from 'class-validator';
import { Gender } from './enums/gender.enum';
import { ProfileImages } from './types/files';
import { OtpEntity } from './entities/otp.entity';
import { cookieKeys } from 'src/common/enums/cookie.enum';
import { AuthMethod } from '../auth/enums/method.enum';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private tokenService: TokenService,
    @Inject(REQUEST) private req: Request,
    private authService: AuthService,
    @InjectRepository(OtpEntity)
    private otpRepository: Repository<OtpEntity>,
  ) {}
  async changeProfile(files: ProfileImages, profileDto: ProfileDto) {
    let { image_profile, image_bg } = files;
    if (image_profile && image_profile?.length > 0) {
      let [image] = image_profile;
      profileDto.image_profile = image.path.slice(7);
    }
    if (image_bg && image_bg?.length > 0) {
      let [image] = image_bg;
      profileDto.image_bg = image.path.slice(7);
    }
    const user = this.req.user;
    if (!user) {
      throw new UnauthorizedException(AuthMessage.LoginIsRequired);
    }
    let { nick_name, bio, gender, birth_date, linkedin, twitter } = profileDto;
    birth_date = new Date(birth_date);
    const { id, profileId } = user;
    let profile = await this.profileRepository.findOneBy({ userId: id });
    if (profile) {
      if (bio) profile.bio = bio;
      if (nick_name) profile.nick_name = nick_name;
      if (gender && Object.values(Gender).includes(gender as any))
        profile.gender = gender;
      if (birth_date && isDate(birth_date)) profile.birth_date = birth_date;
      if (linkedin) profile.linkedin = linkedin;
      if (twitter) profile.twitter = twitter;
      if (image_bg) profile.image_bg = profileDto.image_bg;
      if (image_profile) profile.image_profile = profileDto.image_profile;
    }
    if (!profile) {
      profile = this.profileRepository.create({
        nick_name,
        bio,
        gender,
        birth_date: birth_date,
        linkedin,
        twitter,
        image_bg: profileDto.image_bg,
        image_profile: profileDto.image_profile,
        userId: id,
      });
    }
    profile = await this.profileRepository.save(profile);
    if (!profileId) {
      await this.userRepository.update({ id }, { profileId: profile.id });
    }
    return { message: PublicMessage.Updated };
  }
  async getProfile() {
    const user = this.req?.user;
    if (!user) {
      throw new UnauthorizedException(AuthMessage.LoginIsRequired);
    }
    const profile = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['profile'],
      select: [
        'id',
        'username',
        'email',
        'phone',
        'created_at',
        'updated_at',
        'profile',
      ],
    });
    return profile;
  }
  async changeUserName(username: string) {
    const req = this.req.user;
    if (!req) throw new UnauthorizedException(AuthMessage.LoginIsRequired);
    const user = await this.userRepository.findOneBy({ username });
    if (user && user.id !== req.id) {
      throw new ConflictException(AuthMessage.UsernameExist);
    } else if (user && user.id === req.id) {
      return {
        message: PublicMessage.Updated,
      };
    }
    await this.userRepository.update({ id: req.id }, { username });
    return {
      message: PublicMessage.Updated,
    };
  }
  async changeEmail(changeEmailDto: ChangeEmailDto) {
    const reqUser = this.req.user;
    if (!reqUser) throw new UnauthorizedException(AuthMessage.LoginIsRequired);
    const user = await this.userRepository.findOneBy({
      email: changeEmailDto.email,
    });
    if (user && user?.id !== reqUser.id) {
      throw new ConflictException(AuthMessage.EmailExist);
    } else if (user && user.id == reqUser.id) {
      return {
        message: PublicMessage.Updated,
      };
    }
    await this.userRepository.update(
      { id: reqUser.id },
      { newEmail: changeEmailDto.email },
    );

    const otp = await this.authService.SaveOtp(reqUser.id, AuthMethod.Email);
    const { emailToken } = this.tokenService.createEmailToken({
      email: changeEmailDto.email,
    });
    return {
      code: otp.code,
      emailToken,
    };
  }
  async verifyEmail(code: string) {
    const req = this.req.user;
    if (!req) throw new BadRequestException(AuthMessage.LoginIsRequired);
    const { id, newEmail, username } = req;
    let token = this.req.cookies[cookieKeys.EmailOTP];
    if (!token) throw new BadRequestException(AuthMessage.ExpiredCode);
    const { email } = this.tokenService.verifyEmailToken(token);
    if (email !== newEmail) {
      throw new BadRequestException(BadRequestMessage.SomeThingWrong);
    }

    const otp = await this.checkOtp(id, code);
    if (otp.method !== AuthMethod.Email) {
      throw new BadRequestException(BadRequestMessage.SomeThingWrong);
    }
    await this.userRepository.update(
      { id },
      { email: newEmail, verifyEmail: true, newEmail: '' },
    );
    return {
      message: PublicMessage.Updated,
    };
  }
  async changePhone(phone: string) {
    const reqUser = this.req.user;
    if (!reqUser) throw new UnauthorizedException(AuthMessage.LoginIsRequired);
    const user = await this.userRepository.findOneBy({
      phone,
    });
    if (user && user?.id !== reqUser.id) {
      throw new ConflictException(AuthMessage.PhoneExist);
    } else if (user && user.id == reqUser.id) {
      return {
        message: PublicMessage.Updated,
      };
    }
    await this.userRepository.update({ id: reqUser.id }, { newPhone: phone });

    const otp = await this.authService.SaveOtp(reqUser.id, AuthMethod.Phone);
    const { phoneToken } = this.tokenService.createPhoneToken({
      phone,
    });
    return {
      code: otp.code,
      phoneToken,
    };
  }
  async verifyPhone(code: string) {
    const req = this.req.user;
    if (!req) throw new BadRequestException(AuthMessage.LoginIsRequired);
    const { id, newPhone } = req;
    let token = this.req.cookies[cookieKeys.PhoneOTP];
    if (!token) throw new BadRequestException(AuthMessage.ExpiredCode);
    const { phone } = this.tokenService.verifyPhoneToken(token);
    if (phone !== newPhone) {
      throw new BadRequestException(BadRequestMessage.SomeThingWrong);
    }

    const otp = await this.checkOtp(id, code);
    if (otp.method !== AuthMethod.Phone) {
      throw new BadRequestException(BadRequestMessage.SomeThingWrong);
    }
    await this.userRepository.update(
      { id },
      { phone: newPhone, verifyPhone: true, newPhone: '' },
    );
    return {
      message: PublicMessage.Updated,
    };
  }
  async checkOtp(userId: number, code: string) {
    const otp = await this.otpRepository.findOneBy({ userId });
    if (!otp) throw new BadRequestException(AuthMessage.LoginAgain);
    const now = new Date();
    if (otp.expires_in < now) {
      throw new BadRequestException(AuthMessage.ExpiredCode);
    }
    if (code !== otp.code)
      throw new BadRequestException(AuthMessage.InvalidLogin);
    return otp;
  }
}
