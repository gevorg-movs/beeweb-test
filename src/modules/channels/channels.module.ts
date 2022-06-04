import {forwardRef, Module} from '@nestjs/common'
import { ChannelsController } from './channels.controller'
import { ChannelsService } from './channels.service'
import { ChannelModel } from './channels.schema'
import { UniqueField } from './validations/uniqueField.validation'
import { ChannelExists } from './validations/exists.validation'
import { WorkspacesModule } from '../workspaces/workspaces.module'

@Module({
    controllers: [ChannelsController],
    providers: [ChannelsService, UniqueField, ChannelExists],
    imports: [ChannelModel, forwardRef(() => WorkspacesModule)],
    exports: [ChannelModel, ChannelsService],
})
export class ChannelsModule {}
