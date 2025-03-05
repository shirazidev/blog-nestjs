import {
  ExecutionContext,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../modules/auth/auth.service';
import { Reflector } from '@nestjs/core';
import { SKIP_AUTH } from '../decorators/skip-auth.decorator';
import { AuthMessage } from '../enums/message.enum';
import { isJWT } from 'class-validator';
@Injectable()
export class AddUseroReqWOV implements NestMiddleware {
  constructor(private authService: AuthService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractToken(req);
    if (!token) return next();
    try {
      let user = await this.authService.validateAccessToken(token);
      if (user) req.user = user;
    } catch (error) {
      console.log(error);
    }
    next();
  }

  protected extractToken(request: Request) {
    const authorization = request?.headers?.authorization;
    if (!authorization || authorization?.trim() == '') {
      return null;
    }
    const [bearer, token] = authorization.split(' ');
    if (bearer?.toLowerCase() !== 'bearer' || !token || !isJWT(token))
      return null;
    return token;
  }
}
