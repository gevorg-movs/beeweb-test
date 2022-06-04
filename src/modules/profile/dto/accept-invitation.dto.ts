import { IsString } from 'class-validator'

export class AcceptInvitationParams {
    @IsString()
    payload: string
}
