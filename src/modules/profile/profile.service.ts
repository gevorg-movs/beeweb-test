import { ObjectId } from 'mongoose'
import { HttpException, Injectable } from '@nestjs/common'
import { WorkspacesService } from '../workspaces/workspaces.service'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class ProfileService {
    constructor(
        private readonly workspacesService: WorkspacesService,
        private jwtService: JwtService,
    ) {}

    async getWorkspaces(userId: ObjectId) {
        return await this.workspacesService.findByUserId(userId)
    }

    async acceptInvitation(payload: string) {
        const data: any = this.jwtService.decode(payload)

        if (!data.workspaceId || !data.userId) {
            throw new HttpException(
                {
                    message: 'Invalid payload',
                },
                400,
            )
        }

        const hasUserAccessToWorkspace =
            await this.workspacesService.hasUserAccessToWorkspace(
                data.workspaceId,
                data.userId,
            )

        if (hasUserAccessToWorkspace) {
            throw new HttpException(
                {
                    message: 'The user already has access to this workspace',
                },
                400,
            )
        }

        await this.workspacesService.addUserToWorkspace(
            data.workspaceId,
            data.userId,
        )
    }
}
