import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator'
import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Channel, ChannelDocument } from '../channels.schema'

@ValidatorConstraint({ name: 'ChannelExists', async: true })
@Injectable()
export class ChannelExists implements ValidatorConstraintInterface {
    constructor(
        @InjectModel(Channel.name)
        private channelModel: Model<ChannelDocument>,
    ) {}

    async validate(channelId: string) {
        const channel = await this.channelModel.findById(channelId)

        return !!channel
    }

    defaultMessage(validationArguments): string {
        return `Channel not exists`
    }
}
