import { IsString, Validate } from 'class-validator'
import { ObjectId } from 'mongoose'
import { IsValidObjectId } from '../../../validations/custom-validations/ObjectId.validation'
import { WorkspaceExists } from '../validations/exists.validation'

export class UpdateWorkspaceParams {
    @IsValidObjectId()
    @Validate(WorkspaceExists)
    workspaceId: ObjectId
}

export class UpdateWorkspaceDto {
    @IsString()
    name: string

    @IsString()
    slug: string
}
