import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { TokenService } from './token/token.service';
import { AuthCacheService } from './auth.cache.service';
import { UserService } from '@user/user.service';
import { UserRepository } from '@user/user.repository';
import {
  AUTH_SUCCESS_MESSAGES,
  AUTH_VALIDATION_ERRORS,
} from './auth.constants';
import { User } from '@app/common';
import { jwtTokensInterface } from './token/interfaces/token.interface';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly authCacheService: AuthCacheService,
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
  ) {}

  public async signup(
    signupDto: SignupDto,
    userAgent: string,
  ): Promise<{
    status: boolean;
    message: string;
    user: User;
    tokens: jwtTokensInterface;
  }> {
    const { firstName, lastName, email, password } = signupDto;
    try {
      const userExist = await this.userRepository.findOne({ email });

      if (userExist) {
        throw new UnauthorizedException(
          AUTH_VALIDATION_ERRORS.MAIL_ALREADY_EXISTS,
        );
      }

      const user = await this.userRepository.create({
        email,
        password,
        firstName,
        lastName,
      });

      const tokens = await this.tokenService.getTokens(user._id);

      await this.tokenService.saveUserTokens(user._id, tokens, userAgent);

      return {
        status: true,
        message: AUTH_SUCCESS_MESSAGES.SIGNUP_SUCCESSFUL,
        user,
        tokens,
      };
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  public async login(
    loginDto: LoginDto,
    userAgent: string,
  ): Promise<{
    status: boolean;
    message: string;
    user: User;
    tokens: jwtTokensInterface;
  }> {
    const { email, password } = loginDto;

    try {
      const user = await this.userRepository.findOne(
        { email },
        { path: 'password' },
        'password',
      );

      if (!user) {
        throw new UnauthorizedException(
          AUTH_VALIDATION_ERRORS.AUTHORIZATION_ERROR,
        );
      }

      const passwordDecryption = await bcrypt.compare(password, user.password);

      if (!passwordDecryption) {
        throw new BadRequestException(
          AUTH_VALIDATION_ERRORS.WRONG_CREDENTIALS_PROVIDED,
        );
      }

      const tokens = await this.tokenService.getTokens(user._id);

      await this.tokenService.saveUserTokens(user._id, tokens, userAgent);

      return {
        status: true,
        message: AUTH_SUCCESS_MESSAGES.LOGIN_SUCCESSFUL,
        user,
        tokens,
      };
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
}
