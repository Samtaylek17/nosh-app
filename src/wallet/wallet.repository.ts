import { Injectable, Logger } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { AbstractRepository, Wallet } from '@app/common';

@Injectable()
export class WalletRepository extends AbstractRepository<Wallet> {
  protected readonly logger = new Logger(WalletRepository.name);

  constructor(
    @InjectModel(Wallet.name) walletModel: Model<Wallet>,
    @InjectConnection() connection: Connection,
  ) {
    super(walletModel, connection);
  }
}
