import { Model, ObjectId } from 'mongoose'
import { HttpException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Workspace, WorkspaceDocument } from './workspaces.schema'
import { CreateWorkspaceDto } from './dto/create-workspace.dto'
import { UpdateWorkspaceDto } from './dto/update-workspace.dto'
import { JwtService } from '@nestjs/jwt'
import { Channel, ChannelDocument } from '../channels/channels.schema'

@Injectable()
export class WorkspacesService {
    constructor(
        @InjectModel(Workspace.name)
        private workspaceModel: Model<WorkspaceDocument>,
        @InjectModel(Channel.name)
        private channelModel: Model<ChannelDocument>,
        private jwtService: JwtService,
    ) {}

    async findBySlug(slug: string): Promise<Workspace> {
        return this.workspaceModel.findOne({ slug })
    }

    async findById(id: ObjectId): Promise<Workspace> {
        return this.workspaceModel.findById(id)
    }

    async findByUserId(userId: ObjectId): Promise<Workspace[]> {
        return this.workspaceModel.find({
            users: userId,
        })
    }

    async create(
        userId: ObjectId,
        createWorkspaceDto: CreateWorkspaceDto,
    ): Promise<Workspace> {
        return this.workspaceModel.create({
            users: [userId],
            ...createWorkspaceDto,
        })
    }

    async update(
        workspaceId: ObjectId,
        updateWorkspaceDto: UpdateWorkspaceDto,
    ): Promise<Workspace> {
        const workspaceWithSlug = await this.workspaceModel.findOne({
            _id: { $ne: workspaceId },
            slug: updateWorkspaceDto.slug,
        })

        if (workspaceWithSlug) {
            throw new HttpException(
                {
                    message: 'The slug already in use',
                },
                400,
            )
        }

        return this.workspaceModel.findByIdAndUpdate(
            workspaceId,
            updateWorkspaceDto,
        )
    }

    async inviteUser(workspaceId: ObjectId, userId: ObjectId) {
        const hasUserAccessToWorkspace = await this.hasUserAccessToWorkspace(
            workspaceId,
            userId,
        )

        if (hasUserAccessToWorkspace) {
            throw new HttpException(
                {
                    message: 'The user already has access to this workspace',
                },
                400,
            )
        }

        return this.jwtService.sign({
            workspaceId,
            userId,
        })
    }

    async hasUserAccessToWorkspace(workspaceId: ObjectId, userId: ObjectId) {
        return this.workspaceModel.findOne({
            _id: workspaceId,
            users: userId,
        })
    }

    async addUserToWorkspace(workspaceId: ObjectId, userId: ObjectId) {
        await this.workspaceModel.findByIdAndUpdate(workspaceId, {
            $push: {
                users: userId,
            },
        })
    }

    async delete(workspaceId: ObjectId) {
        const workspace = await this.workspaceModel.findById(workspaceId)

        await Promise.all(
            workspace.channels.map(channel =>
                this.channelModel.remove(channel),
            ),
        )

        await workspace.remove()
    }
}
