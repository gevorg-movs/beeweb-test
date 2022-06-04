import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, ObjectId, SchemaTypes } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { Workspace } from '../workspaces/workspaces.schema'
import { User } from '../users/users.schema'

export type ChannelDocument = Channel & Document

export interface ChannelMessage {
    user: ObjectId
    text: string
    createdAt: Date
    updatedAt: Date
}

@Schema()
@Injectable()
export class Channel {
    @Prop()
    name: string

    @Prop({ type: SchemaTypes.ObjectId, ref: Workspace.name })
    workspace: Workspace

    @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: User.name }] })
    users: User[]

    @Prop()
    messages: ChannelMessage[]
}

export const ChannelSchema = SchemaFactory.createForClass(Channel)
export const ChannelModel = MongooseModule.forFeature([
    { name: Channel.name, schema: ChannelSchema },
])
