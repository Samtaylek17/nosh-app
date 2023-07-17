import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtSignOptionEnum } from './token.constants';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { TokenRepository } from './token.repository';
import { ConfigService } from '@nestjs/config';
import { AuthCacheService } from '../auth.cache.service';
import { AUTH_VALIDATION_ERRORS } from '../auth.constants';
import { Types } from 'mongoose';
import {
  PayloadTokenInterface,
  jwtTokensInterface,
} from './interfaces/token.interface';

@Injectable()
export class TokenService {
  private [JwtSignOptionEnum.AccessToken]: JwtSignOptions;
  private [JwtSignOptionEnum.RefreshToken]: JwtSignOptions;

  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authCacheService: AuthCacheService,
  ) {}

  public async getTokens(userId: Types.ObjectId): Promise<jwtTokensInterface> {
    const {
      accessTokenSecret,
      accessTokenExpirationTime,
      refreshTokenSecret,
      refreshTokenExpirationTime,
    } = this.configService.get('jwt');

    const payload = {
      userId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessTokenSecret,
        expiresIn: accessTokenExpirationTime,
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshTokenSecret,
        expiresIn: refreshTokenExpirationTime,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  public async verifyToken(token: string): Promise<{ userId: string }> {
    return this.jwtService.verifyAsync(
      token,
      this[JwtSignOptionEnum.AccessToken],
    );
  }

  public async saveRefreshToken(
    refreshToken: string,
    userId: Types.ObjectId,
    userAgent: string,
  ): Promise<void> {
    await this.tokenRepository.create({
      refreshToken,
      userId,
      userAgent,
    });
  }

  public async updateAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.tokenRepository.findOne({ refreshToken });

    if (!user) {
      throw new BadRequestException(AUTH_VALIDATION_ERRORS.TOKEN_NOT_FOUND);
    }

    const { accessToken } = await this.getTokens(user._id);

    await this.authCacheService.saveAccessTokenToRedis(user._id, accessToken);

    return { accessToken: accessToken };
  }

  public async updateRefreshToken(
    refreshToken: string,
  ): Promise<jwtTokensInterface> {
    const user = await this.tokenRepository.findOne({ refreshToken });

    if (!user) {
      throw new BadRequestException(AUTH_VALIDATION_ERRORS.TOKEN_NOT_FOUND);
    }

    const tokens = await this.getTokens(user._id);

    await Promise.all([
      this.authCacheService.saveAccessTokenToRedis(
        user._id,
        tokens.accessToken,
      ),
      await this.tokenRepository.findOneAndUpdate(
        { userId: user._id },
        { refreshToken: tokens.refreshToken },
      ),
    ]);

    return {
      ...tokens,
    };
  }

  public async saveUserTokens(
    userId: Types.ObjectId,
    tokens: jwtTokensInterface,
    userAgent: string,
  ): Promise<void> {
    const { accessToken, refreshToken } = tokens;

    await Promise.all([
      this.saveRefreshToken(refreshToken, userId, userAgent),
      this.authCacheService.saveAccessTokenToRedis(userId, accessToken),
    ]);
  }

  public decodeToken(token: string): PayloadTokenInterface {
    return this.jwtService.decode(token) as PayloadTokenInterface;
  }
}
