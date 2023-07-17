import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { TransferDto } from './dto/transfer.dto';
import { UserRepository } from '@user/user.repository';
import { WalletRepository } from './wallet.repository';
import {
  WALLET_SUCCESS_MESSAGES,
  WALLET_VALIDATION_ERRORS,
} from './wallet.constants';
import { Types } from 'mongoose';
import { Wallet } from '@app/common';

@Injectable()
export class WalletService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly walletRepository: WalletRepository,
  ) {}

  async createAccount(
    createWalletDto: CreateWalletDto,
    userId: Types.ObjectId,
  ): Promise<{
    status: boolean;
    message: string;
    account: Wallet;
  }> {
    const { accountNumber, initialBalance } = createWalletDto;

    try {
      const user = await this.userRepository.findOne({ _id: userId });

      if (!user) {
        throw new UnauthorizedException();
      }

      /** Check if account already exists*/
      const userExist = await this.walletRepository.findOne({
        user,
      });

      if (userExist) {
        throw new BadRequestException(
          WALLET_VALIDATION_ERRORS.ACCOUNT_ALREADY_EXIST,
        );
      }

      /** Check if user already created wallet */
      const accountExist = await this.walletRepository.findOne({
        accountNumber,
      });

      if (accountExist) {
        throw new BadRequestException(
          WALLET_VALIDATION_ERRORS.ACCOUNT_ALREADY_EXIST,
        );
      }

      const account = await this.walletRepository.create({
        accountNumber,
        balance: initialBalance,
        user: user,
      });

      return {
        status: true,
        message: WALLET_SUCCESS_MESSAGES.ACCOUNT_CREATED,
        account,
      };
    } catch (err) {
      throw new HttpException(
        err.message || WALLET_VALIDATION_ERRORS.GENERIC_ERROR,
        err.status,
      );
    }
  }

  async transferFunds(transferDto: TransferDto, userId: Types.ObjectId) {
    const { toAccountNumber, amount } = transferDto;

    try {
      /**  Check if recipient account exists. */
      const accountExist = await this.walletRepository.findOne({
        accountNumber: toAccountNumber,
      });

      if (!accountExist) {
        throw new NotFoundException(WALLET_VALIDATION_ERRORS.ACCOUNT_NOT_FOUND);
      }

      /** Find Sending Account */
      const sendingAccount = await this.walletRepository.findOne({
        user: userId,
      });

      if (!sendingAccount) {
        throw new NotFoundException(
          WALLET_VALIDATION_ERRORS.SENDING_ACCOUNT_NOT_FOUND,
        );
      }

      /** Update Sender's balance */
      await this.walletRepository.upsert(
        {
          accountNumber: sendingAccount.accountNumber,
        },
        {
          $inc: {
            balance: -amount,
          },
        },
      );

      /** Update Recipient's wallet */
      await this.walletRepository.upsert(
        {
          accountNumber: accountExist.accountNumber,
        },
        {
          $inc: {
            balance: amount,
          },
        },
      );

      return {
        status: true,
        message: WALLET_SUCCESS_MESSAGES.TRANSFER_SUCCESSFUL,
      };
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
}
