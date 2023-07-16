import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AbstractDocument } from '@app/common';
import { User } from './user.schema';

export enum RoleEnum {
  USER = 'user',
  ADMIN = 'admin',
}

@Schema({ timestamps: true })
export class Role extends AbstractDocument {
  @Prop({ type: String })
  role: RoleEnum;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  users: User[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
