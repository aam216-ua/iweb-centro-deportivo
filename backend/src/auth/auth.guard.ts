import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserSession } from './types/user-session.type';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = ((request) => {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];

      this.logger.debug(
        `Received token of type '${type}' with value '${token}'`
      );

      if (type == 'Bearer') return token;
    })(request);

    if (!token) throw new UnauthorizedException('missing token');

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        // secret: process.env.JWT_SECRET,
      });

      this.logger.debug(
        `The received token corresponds to user '${payload.id}' with role '${payload.role}'`
      );

      request['session'] = payload as UserSession;
    } catch (err) {
      this.logger.error(err);

      throw new UnauthorizedException('invalid token');
    }

    return true;
  }
}
