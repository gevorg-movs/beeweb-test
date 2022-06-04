import { Validate } from 'class-validator'
import { ObjectId } from 'mongoose'
import { IsValidObjectId } from '../../../validations/custom-validations/ObjectId.validation'
import { WorkspaceExists } from '../validations/exists.validation'

export class DeleteWorkspaceParams {
    @IsValidObjectId()
    @Validate(WorkspaceExists)
    workspaceId: ObjectId
}
