import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
  CookiePayload,
  EmailPayload,
  JwtPayload,
  JwtVerify,
  PhonePayload,
} from "./types/payload";
import { AuthMessage, BadRequestMessage } from "src/common/enums/message.enum";

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}
  createOtpToken(payload: CookiePayload) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.OTP_TOKEN_SECRET,
      expiresIn: 60 * 2,
    });
    return token;
  }
  verifyOtpToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.OTP_TOKEN_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException(AuthMessage.TryAgain);
    }
  }
  createJwtToken(payload: JwtPayload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESSTOKENJWT,
      expiresIn: "30d",
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESHTOKENJWT,
      expiresIn: "1y",
    });
    return {
      accessToken,
      refreshToken,
    };
  }
  verifyJwtToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.ACCESSTOKENJWT,
      });
    } catch (error) {
      throw new UnauthorizedException(AuthMessage.LoginAgain);
    }
  }
  createEmailToken(payload: EmailPayload) {
    const emailToken = this.jwtService.sign(payload, {
      secret: process.env.EMAIL_TOKEN_SECRET,
      expiresIn: 60 * 2,
    });
    return {
      emailToken,
    };
  }
  verifyEmailToken(token: string): EmailPayload {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.EMAIL_TOKEN_SECRET,
      });
    } catch (error) {
      throw new BadRequestException(BadRequestMessage.SomeThingWrong);
    }
  }
  createPhoneToken(payload: PhonePayload) {
    const emailToken = this.jwtService.sign(payload, {
      secret: process.env.PHONE_TOKEN_SECRET,
      expiresIn: 60 * 2,
    });
    return {
      emailToken,
    };
  }
  verifyPhoneToken(token: string): PhonePayload {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.PHONE_TOKEN_SECRET,
      });
    } catch (error) {
      throw new BadRequestException(BadRequestMessage.SomeThingWrong);
    }
  }
}
