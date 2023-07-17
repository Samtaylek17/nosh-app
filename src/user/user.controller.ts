import { Controller, Body, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SWAGGER_USER_SUMMARY } from './user.constants';
import { Role, User } from '@app/common';
import { DeleteUserDto } from './dto/delete-user.dto';
import { Roles } from '@auth/decorators/roles.decorator';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';

@ApiTags('user')
@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: SWAGGER_USER_SUMMARY.DELETE_USER })
  @ApiCreatedResponse({ type: User })
  @ApiBody({ type: DeleteUserDto })
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @Delete('delete-user')
  public async deleteUser(@Body() deleteUserDto: DeleteUserDto) {
    return this.userService.deleteUser(deleteUserDto);
  }
}
