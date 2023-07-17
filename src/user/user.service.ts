import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { UserRepository } from './user.repository';
import { USER_VALIDATION_ERRORS } from './user.constants';
import { WalletRepository } from '@wallet/wallet.repository';
import { TokenRepository } from '@auth/token/token.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly walletRepository: WalletRepository,
    private readonly tokenRepository: TokenRepository,
  ) {}

  async deleteUser(deleteUserDto: DeleteUserDto) {
    const { email } = deleteUserDto;
    try {
      const user = await this.userRepository.findOne({ email });

      if (!user) {
        throw new NotFoundException(USER_VALIDATION_ERRORS.USER_NOT_FOUND);
      }

      await this.walletRepository.deleteOne({ user: user });
      await this.tokenRepository.deleteOne({ userId: user._id });
      await this.userRepository.deleteOne({ _id: user._id });
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
}
