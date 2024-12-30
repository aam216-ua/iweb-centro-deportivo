import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserSession } from './types/user-session.type';
import { UserRole } from 'src/users/enums/user-role.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = ((request) => {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    })(request);

    this.logger.debug(
      `Received token with ${token ? 'defined' : 'undefined'} value`
    );

    if (!token) throw new UnauthorizedException('missing token');

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      this.logger.debug(
        `The received token corresponds to user '${payload.id}' with role '${payload.role}'`
      );

      request['session'] = {
        id: payload.id,
        role: payload.role as UserRole,
      } as UserSession;

      return true;
    } catch {
      throw new UnauthorizedException('invalid token');
    }
  }
}
