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
  async changeProfile(files: any, profileDto: ProfileDto) {
    console.log(files);
    
    const user = this.req.user;
    if (!user) {
      throw new UnauthorizedException(AuthMessage.LoginIsRequired);
    }
    const { nick_name, bio, gender, birth_date, linkedin, twitter } =
      profileDto;
    const { id, profileId } = user;
    let profile = await this.profileRepository.findOneBy({ userId: id });
    if (profile) {
        if (bio) profile.bio = bio;
        if(nick_name) profile.nick_name = nick_name
        if(gender && Object.values(Gender).includes(gender as any)) profile.gender = gender
        if(birth_date && isDate(birth_date)) profile.birth_date = new Date(birth_date)
        if(linkedin) profile.linkedin = linkedin
        if(twitter) profile.twitter = twitter
    }
    if (!profile) {
        profile = this.profileRepository.create({
            nick_name,
            bio,
            gender,
            birth_date,
            linkedin,
            twitter,
            userId: id,
          });
    }
    profile = await this.profileRepository.save(profile);
    if (!profileId) {
      await this.userRepository.update({ id }, { profileId: profile.id });
    }
    return { message: PublicMessage.Updated };
  }
}
