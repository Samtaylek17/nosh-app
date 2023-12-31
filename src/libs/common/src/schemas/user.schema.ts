import { AbstractDocument } from '@app/common';
import { hash } from 'bcrypt';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Schema({ timestamps: true })
export class User extends AbstractDocument {
  @Prop({ required: true, type: String })
  firstName: string;

  @Prop({ required: true, type: String })
  lastName: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    type: String,
  })
  email: string;

  @Prop({ required: true, select: false, type: String })
  password: string;

  @Prop({ type: String, default: Role.USER })
  roles?: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 12);
  }
});
