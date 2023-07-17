import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AbstractDocument } from '@app/common';

@Schema({ timestamps: true })
export class RefreshToken extends AbstractDocument {
  @Prop({ type: String })
  refreshToken: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: mongoose.Types.ObjectId;

  @Prop({ type: String })
  userAgent: string;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
