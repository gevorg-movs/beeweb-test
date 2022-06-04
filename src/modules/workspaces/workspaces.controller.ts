import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Req,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common'
import { WorkspacesService } from './workspaces.service'
import { CreateWorkspaceDto } from './dto/create-workspace.dto'
import {
    UpdateWorkspaceDto,
    UpdateWorkspaceParams,
} from './dto/update-workspace.dto'
import { JwtAuthGuard } from '../auth/auth.jwt-auth.guard'
import { InviteUserParams } from './dto/invite-user.dto'
import { DeleteWorkspaceParams } from './dto/delete-workspace.dto'

@Controller('workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspacesController {
    constructor(private readonly workspacesService: WorkspacesService) {}

    @Get()
    async findAll(@Req() { user }) {
        return await this.workspacesService.findByUserId(user._id)
    }

    @Get(':slug')
    async findBySlug(@Param('slug') slug: string) {
        return await this.workspacesService.findBySlug(slug)
    }

    @Post()
    async createWorkspace(
        @Req() { user },
        @Body() createWorkspaceDto: CreateWorkspaceDto,
    ) {
        const workspace = await this.workspacesService.create(
            user._id,
            createWorkspaceDto,
        )

        return {
            message: 'The workspace has been updated created',
            workspace,
        }
    }

    @Put(':workspaceId')
    async updateWorkspace(
        @Param() { workspaceId }: UpdateWorkspaceParams,
        @Body() updateWorkspaceDto: UpdateWorkspaceDto,
    ) {
        await this.workspacesService.update(workspaceId, updateWorkspaceDto)
        const workspace = await this.workspacesService.findById(workspaceId)

        return {
            message: 'The workspace has been updated successfully',
            workspace,
        }
    }

    @Post(':workspaceId/invite-user/:userId')
    async inviteUserToWorkspace(
        @Param() { workspaceId, userId }: InviteUserParams,
        @Req() { user },
    ) {
        const hasCurrentUserAccessToWorkspace =
            await this.workspacesService.hasUserAccessToWorkspace(
                workspaceId,
                user._id,
            )

        if (!hasCurrentUserAccessToWorkspace) {
            throw new UnauthorizedException({
                message: 'You dont have permission for this action',
            })
        }

        const payload = await this.workspacesService.inviteUser(
            workspaceId,
            userId,
        )

        return {
            link: `/profile/accept-invitation/${payload}`,
            message: 'The user has been invited successfully',
        }
    }

    @Delete(':workspaceId')
    async delete(
        @Param() { workspaceId }: DeleteWorkspaceParams,
        @Req() { user },
    ) {
        const hasCurrentUserAccessToWorkspace =
            await this.workspacesService.hasUserAccessToWorkspace(
                workspaceId,
                user._id,
            )

        if (!hasCurrentUserAccessToWorkspace) {
            throw new UnauthorizedException({
                message: 'You dont have permission for this action',
            })
        }

        await this.workspacesService.delete(workspaceId)


        return {
            message: 'Workspace has been deleted successfully',
        }
    }
}
