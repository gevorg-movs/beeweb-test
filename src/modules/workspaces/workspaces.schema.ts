import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, SchemaTypes } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { Channel } from '../channels/channels.schema'
import { User } from '../users/users.schema'

export type WorkspaceDocument = Workspace & Document

@Schema()
@Injectable()
export class Workspace {
    @Prop()
    name: string

    @Prop()
    slug: string

    @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Channel' }] })
    channels: Channel[]

    @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: User.name }] })
    users: User[]
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace)
export const WorkspaceModel = MongooseModule.forFeature([
    { name: Workspace.name, schema: WorkspaceSchema },
])
