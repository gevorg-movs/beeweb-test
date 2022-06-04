import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator'
import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from '../users.schema'

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
export class UserExists implements ValidatorConstraintInterface {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
    ) {}

    async validate(userId: string) {
        const user = await this.userModel.findById(userId)

        return !!user
    }

    defaultMessage(validationArguments): string {
        return `User not exists`
    }
}
