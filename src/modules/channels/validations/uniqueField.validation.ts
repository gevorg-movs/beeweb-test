import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator'
import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Channel, ChannelDocument } from '../channels.schema'

interface UniqueValidationArguments extends ValidationArguments {
    constraints: [property: string]
}

@ValidatorConstraint({ name: 'UniqueField', async: true })
@Injectable()
export class UniqueField implements ValidatorConstraintInterface {
    constructor(
        @InjectModel(Channel.name)
        private channelModel: Model<ChannelDocument>,
    ) {}

    async validate(value: string, args: UniqueValidationArguments) {
        const [property] = args.constraints

        const workspace = await this.channelModel.findOne({
            [property]: value,
        })

        return !workspace
    }

    defaultMessage(validationArguments): string {
        return `Channel with the following ${validationArguments.property} already exists`
    }
}
