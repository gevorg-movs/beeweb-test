import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UserModel } from './users.schema'
import { UserExists } from './validations/exists.validation'

@Module({
    controllers: [],
    providers: [UsersService, UserExists],
    imports: [UserModel],
    exports: [UserModel, UsersService],
})
export class UsersModule {}
