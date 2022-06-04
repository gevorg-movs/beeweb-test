import { IsString, Validate } from 'class-validator'
import { UniqueField } from '../validations/uniqueField.validation'
import { IsValidObjectId } from '../../../validations/custom-validations/ObjectId.validation'
import { WorkspaceExists } from '../../workspaces/validations/exists.validation'
import { ObjectId } from 'mongoose'

export class CreateChannelParams {
    @IsValidObjectId()
    @Validate(WorkspaceExists)
    workspaceId: ObjectId
}

export class CreateChannelDto {
    @IsString()
    @Validate(UniqueField, ['name'])
    name: string
}
