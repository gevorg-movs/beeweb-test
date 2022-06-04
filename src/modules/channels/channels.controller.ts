import {
    Body,
    Controller, Delete,
    Get,
    Param,
    Post,
    Put,
    Req,
    UseGuards,
} from '@nestjs/common'
import { ChannelsService } from './channels.service'
import { ObjectId } from 'mongoose'
import { JwtAuthGuard } from '../auth/auth.jwt-auth.guard'
import { CreateChannelDto, CreateChannelParams } from './dto/create-channel.dto'
import { UpdateChannelDto, UpdateChannelParams } from './dto/update-channel.dto'
import { AddMessageDto, AddMessageParams } from './dto/add-message.dto'
import { AddUserParams } from './dto/add-user.dto'
import {DeleteChannelParams} from "./dto/delete-channel.dto";

@Controller('workspaces/:workspaceId/channels')
@UseGuards(JwtAuthGuard)
export class ChannelsController {
    constructor(private readonly channelsService: ChannelsService) {}

    @Get()
    async findAll(@Param() params, @Req() { user }) {
        return await this.channelsService.findAll({
            ...params,
            userId: user._id,
        })
    }

    @Get('channelId')
    async findOne(@Param('channelId') channelId: ObjectId) {
        return await this.channelsService.findById(channelId)
    }

    @Post()
    async createChannel(
        @Param() { workspaceId }: CreateChannelParams,
        @Req() { user },
        @Body() createChannelDto: CreateChannelDto,
    ) {
        const channel = await this.channelsService.create(
            workspaceId,
            user._id,
            createChannelDto,
        )

        return {
            message: 'Channel has been updated successfully',
            channel,
        }
    }

    @Put(':channelId')
    async updateChannel(
        @Param() { channelId }: UpdateChannelParams,
        @Body() updateChannelDto: UpdateChannelDto,
    ) {
        await this.channelsService.update(channelId, updateChannelDto)

        const channel = await this.channelsService.findById(channelId)

        return {
            message: 'Channel has been updated successfully',
            channel,
        }
    }

    @Post(':channelId/messages')
    async addMessage(
        @Param() { workspaceId, channelId }: AddMessageParams,
        @Req() { user },
        @Body() addMessageDto: AddMessageDto,
    ) {
        await this.channelsService.addMessage(
            channelId,
            user._id,
            addMessageDto.message,
        )

        const channel = await this.channelsService.findById(channelId)

        return {
            message: 'Message has been added successfully',
            channel,
        }
    }

    @Post(':channelId/users/:userId')
    async addUser(
        @Param() { workspaceId, channelId, userId }: AddUserParams,
        @Req() { user },
    ) {
        await this.channelsService.checkUserAccessToChannel(channelId, user._id)

        await this.channelsService.addUser(channelId, userId)

        const channel = await this.channelsService.findById(channelId)

        return {
            message: 'User has been added to the channel',
            channel,
        }
    }

    @Delete(':channelId')
    async delete(
       @Param() { workspaceId, channelId }: DeleteChannelParams,
       @Req() { user },
    ) {
        await this.channelsService.checkUserAccessToChannel(channelId, user._id)

        await this.channelsService.delete(channelId)

        return {
            message: 'Channel has been deleted successfully',
        }
    }
}
