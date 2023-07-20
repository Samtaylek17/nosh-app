import { Controller, Post, Body, Headers, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SWAGGER_AUTH_SUMMARY } from './auth.constants';
import { MongoExceptionFilter, User } from '@app/common';
import { SignupDto } from './dto/signup.dto';
import { jwtTokensInterface } from './token/interfaces/token.interface';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@UseFilters(MongoExceptionFilter)
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: SWAGGER_AUTH_SUMMARY.REGISTRATION })
  @ApiCreatedResponse({
    type: User,
  })
  @ApiBody({ type: SignupDto })
  @ApiBearerAuth()
  @Post('signup')
  public async signup(
    @Body() signupDto: SignupDto,
    @Headers() headers: string,
  ): Promise<{
    status: boolean;
    message: string;
    user: User;
    tokens: jwtTokensInterface;
  }> {
    return this.authService.signup(signupDto, headers['user-agent']);
  }

  @ApiOperation({ summary: SWAGGER_AUTH_SUMMARY.LOGIN })
  @ApiCreatedResponse({
    type: User,
  })
  @ApiBody({ type: LoginDto })
  @ApiBearerAuth()
  @Post('login')
  public async login(
    @Body() loginDto: LoginDto,
    @Headers() headers: string,
  ): Promise<{
    status: boolean;
    message: string;
    user: User;
    tokens: jwtTokensInterface;
  }> {
    return this.authService.login(loginDto, headers['user-agent']);
  }
}
