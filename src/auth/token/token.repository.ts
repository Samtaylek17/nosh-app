import { Injectable, Logger } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { AbstractRepository, RefreshToken } from '@app/common';

@Injectable()
export class TokenRepository extends AbstractRepository<RefreshToken> {
  protected readonly logger = new Logger(TokenRepository.name);

  constructor(
    @InjectModel(RefreshToken.name) refreshTokenModel: Model<RefreshToken>,
    @InjectConnection() connection: Connection,
  ) {
    super(refreshTokenModel, connection);
  }
}
