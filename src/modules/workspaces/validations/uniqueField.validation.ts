import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator'
import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Workspace, WorkspaceDocument } from '../workspaces.schema'

interface UniqueValidationArguments extends ValidationArguments {
    constraints: [property: string]
}

@ValidatorConstraint({ name: 'UniqueField', async: true })
@Injectable()
export class UniqueField implements ValidatorConstraintInterface {
    constructor(
        @InjectModel(Workspace.name)
        private workspaceModel: Model<WorkspaceDocument>,
    ) {}

    async validate(value: string, args: UniqueValidationArguments) {
        const [property] = args.constraints

        const workspace = await this.workspaceModel.findOne({
            [property]: value,
        })

        return !workspace
    }

    defaultMessage(validationArguments): string {
        return `Workspace with the following ${validationArguments.property} already exists`
    }
}
