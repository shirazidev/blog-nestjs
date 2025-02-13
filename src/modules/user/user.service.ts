import { UserEntity } from 'src/modules/user/entities/user.entity';
import { TokenService } from './../auth/tokens.service';
import { AuthService } from './../auth/auth.service';
import {
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ProfileDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from './entities/profile.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { AuthMessage, PublicMessage } from 'src/common/enums/message.enum';
import { REQUEST } from '@nestjs/core';
import { isDate } from 'class-validator';
import { Gender } from './enums/gender.enum';
import { ProfileImages } from './types/files';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private tokenService: TokenService,
    @Inject(REQUEST) private req: Request,
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
      select: ['id', 'username', 'email', 'phone', 'created_at', 'updated_at','profile']
    });
    return profile;
  }
}
