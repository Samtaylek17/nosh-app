import { AbstractDocument, User } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Wallet extends AbstractDocument {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
  })
  user: User;

  @Prop({ required: true, type: String, unique: true })
  accountNumber: string;

  @Prop({ type: Number, required: true, default: 0 })
  balance: number;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
