import { forwardRef, Module } from '@nestjs/common'
import { WorkspacesController } from './workspaces.controller'
import { WorkspacesService } from './workspaces.service'
import { WorkspaceModel } from './workspaces.schema'
import { UniqueField } from './validations/uniqueField.validation'
import { WorkspaceExists } from './validations/exists.validation'
import { ChannelsModule } from '../channels/channels.module'

@Module({
    controllers: [WorkspacesController],
    providers: [WorkspacesService, UniqueField, WorkspaceExists],
    imports: [WorkspaceModel, forwardRef(() => ChannelsModule)],
    exports: [WorkspaceModel, WorkspacesService],
})
export class WorkspacesModule {}
