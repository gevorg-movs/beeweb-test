import { Model, ObjectId } from 'mongoose'
import {
    HttpException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Channel, ChannelDocument } from './channels.schema'
import { CreateChannelDto } from './dto/create-channel.dto'
import { UpdateChannelDto } from './dto/update-channel.dto'
import { Workspace, WorkspaceDocument } from '../workspaces/workspaces.schema'

@Injectable()
export class ChannelsService {
    constructor(
        @InjectModel(Channel.name) private channelModel: Model<ChannelDocument>,
        @InjectModel(Workspace.name)
        private workspaceModel: Model<WorkspaceDocument>,
    ) {}

    async findAll(params: any): Promise<Channel[]> {
        const { workspaceId, userId } = params
        const filter: Record<string, string | number> = {
            users: userId,
        }

        if (workspaceId) {
            filter.workspace = workspaceId
        }

        return this.channelModel.find(filter)
    }

    async findById(id: ObjectId): Promise<Channel> {
        return this.channelModel.findById(id)
    }

    async create(
        workspaceId: ObjectId,
        userId: ObjectId,
        createChannelDto: CreateChannelDto,
    ): Promise<Channel> {
        const channel = await this.channelModel.create({
            workspace: workspaceId,
            users: [userId],
            ...createChannelDto,
        })

        await this.workspaceModel.findByIdAndUpdate(workspaceId, {
            $push: {
                channels: channel._id,
            },
        })

        return channel
    }

    async update(
        channelId: ObjectId,
        updateChannelDto: UpdateChannelDto,
    ): Promise<Channel> {
        const channelWithName = await this.channelModel.findOne({
            _id: { $ne: channelId },
            name: updateChannelDto.name,
        })

        if (channelWithName) {
            throw new HttpException(
                {
                    message: 'The channel name already in use',
                },
                400,
            )
        }

        return this.channelModel.findByIdAndUpdate(channelId, updateChannelDto)
    }

    async addMessage(
        channelId: ObjectId,
        userId: ObjectId,
        message: string,
    ): Promise<Channel> {
        await this.checkUserAccessToChannel(channelId, userId)

        return this.channelModel.findByIdAndUpdate(channelId, {
            $push: {
                messages: {
                    user: userId,
                    text: message,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            },
        })
    }

    async addUser(channelId: ObjectId, userId: ObjectId): Promise<Channel> {
        const channel = await this.channelModel.findOne({
            _id: channelId,
            users: userId,
        })

        if (channel) {
            throw new UnauthorizedException({
                message: 'The user already has access to this channel',
            })
        }

        return this.channelModel.findByIdAndUpdate(channelId, {
            $push: {
                users: userId,
            },
        })
    }

    async checkUserAccessToChannel(channelId: ObjectId, userId: ObjectId) {
        const channel = await this.channelModel.findOne({
            _id: channelId,
            users: userId,
        })

        if (!channel) {
            throw new HttpException(
                {
                    message: 'You dont have permission for this action',
                },
                400,
            )
        }
    }

    async delete(channelId: ObjectId) {
        return this.channelModel.findByIdAndRemove(channelId)
    }
}
