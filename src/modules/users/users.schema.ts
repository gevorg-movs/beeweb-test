import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Injectable } from '@nestjs/common'

export type UserDocument = User & Document

@Schema()
@Injectable()
export class User {
    @Prop()
    email: string

    @Prop()
    password: string

    @Prop()
    avatar?: string
}

export const UserSchema = SchemaFactory.createForClass(User)
export const UserModel = MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
])
