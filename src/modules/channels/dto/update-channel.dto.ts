import { IsString, Validate } from 'class-validator'
import { IsValidObjectId } from '../../../validations/custom-validations/ObjectId.validation'
import { WorkspaceExists } from '../../workspaces/validations/exists.validation'
import { ObjectId } from 'mongoose'
import { ChannelExists } from '../validations/exists.validation'

export class UpdateChannelParams {
    @IsValidObjectId()
    @Validate(WorkspaceExists)
    workspaceId: ObjectId

    @IsValidObjectId()
    @Validate(ChannelExists)
    channelId: ObjectId
}

export class UpdateChannelDto {
    @IsString()
    name: string
}
