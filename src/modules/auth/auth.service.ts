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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
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
  login(username: string, method: AuthMethod) {
    this.usernameValidator(username, method);
  }
  register(username: string, method: AuthMethod) {
    this.usernameValidator(username, method);
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
