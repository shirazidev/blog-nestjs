import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserEntity } from '../user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from '../user/entities/profile.entity';
import { UserModule } from '../user/user.module';
import { TokenService } from './tokens.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService, TokenService],
})
export class AuthModule {}
