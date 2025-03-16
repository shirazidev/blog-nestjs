import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { TokenService } from './tokens.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './guards/auth.guard';
import { GoogleAuthController } from './google.controller';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [forwardRef(() => UserModule)],
  controllers: [AuthController, GoogleAuthController],
  providers: [AuthService, JwtService, TokenService, AuthGuard, GoogleStrategy],
  exports: [AuthGuard, AuthService, JwtService, TokenService],
})
export class AuthModule {}
