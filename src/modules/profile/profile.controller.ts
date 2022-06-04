import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { JwtAuthGuard } from '../auth/auth.jwt-auth.guard'
import { Workspace } from '../workspaces/workspaces.schema'
import { AcceptInvitationParams } from './dto/accept-invitation.dto'

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Get('workspaces')
    async getProfileWorkspaces(@Req() { user }): Promise<Workspace[]> {
        return await this.profileService.getWorkspaces(user._id)
    }

    @Get('accept-invitation/:payload')
    async acceptInvitation(@Param() { payload }: AcceptInvitationParams) {
        await this.profileService.acceptInvitation(payload)

        return {
            message: 'You have been granted access to the following workspace',
        }
    }
}
