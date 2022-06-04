import { Module } from '@nestjs/common'
import { ProfileController } from './profile.controller'
import { ProfileService } from './profile.service'
import { UsersModule } from '../users/users.module'
import { WorkspacesModule } from '../workspaces/workspaces.module'

@Module({
    controllers: [ProfileController],
    providers: [ProfileService],
    imports: [UsersModule, WorkspacesModule],
    exports: [ProfileService],
})
export class ProfileModule {}
