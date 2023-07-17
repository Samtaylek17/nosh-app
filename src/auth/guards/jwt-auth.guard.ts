import {
  CanActivate,
  ExecutionContext,
  Global,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthCacheService } from '../auth.cache.service';
import { TokenService } from '../token/token.service';

@Global()
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private authCacheService: AuthCacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers?.authorization;

    if (!authHeader) {
      throw new UnauthorizedException();
    }

    const accessToken = authHeader.split(' ')[1];

    try {
      const { userId } = await this.tokenService.verifyToken(accessToken);

      const findTokenInRedis = await this.authCacheService.isAccessTokenExist(
        userId,
        accessToken,
      );

      if (!findTokenInRedis) {
        throw new UnauthorizedException();
      }

      request.user = { userId, accessToken };

      return true;
    } catch (err) {
      await this.removeAccessTokenFromRedis(accessToken);

      throw new UnauthorizedException();
    }
  }

  private async removeAccessTokenFromRedis(accessToken: string): Promise<void> {
    const tokenPayload = this.tokenService.decodeToken(accessToken);

    await this.authCacheService.removeAccessTokenFromRedis(
      accessToken,
      tokenPayload.userId,
    );
  }
}
