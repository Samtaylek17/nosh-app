import { Injectable } from '@nestjs/common';
import { JwtSignOptionEnum } from './token.constants';
import { JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  private [JwtSignOptionEnum.AccessToken]: JwtSignOptions;
  private [JwtSignOptionEnum.RefreshToken]: JwtSignOptions;

  // constructor(
  //   private readonly tokenRepository
  // )
}
