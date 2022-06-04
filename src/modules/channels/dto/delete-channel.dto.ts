import { Validate } from 'class-validator'
import { IsValidObjectId } from '../../../validations/custom-validations/ObjectId.validation'
import { ObjectId } from 'mongoose'
import { WorkspaceExists } from '../../workspaces/validations/exists.validation'
import { ChannelExists } from '../validations/exists.validation'
import { UserExists } from '../../users/validations/exists.validation'

export class DeleteChannelParams {
    @IsValidObjectId()
    @Validate(WorkspaceExists)
    workspaceId: ObjectId

    @IsValidObjectId()
    @Validate(ChannelExists)
    channelId: ObjectId
}
