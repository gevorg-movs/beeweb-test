import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator'
import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Workspace, WorkspaceDocument } from '../workspaces.schema'

@ValidatorConstraint({ name: 'WorkspaceExists', async: true })
@Injectable()
export class WorkspaceExists implements ValidatorConstraintInterface {
    constructor(
        @InjectModel(Workspace.name)
        private workspaceModel: Model<WorkspaceDocument>,
    ) {}

    async validate(workspaceId: string) {
        const workspace = await this.workspaceModel.findById(workspaceId)

        return !!workspace
    }

    defaultMessage(validationArguments): string {
        return `Workspace not exists`
    }
}
