import { IsString, Validate } from 'class-validator'
import { UniqueField } from '../validations/uniqueField.validation'

export class CreateWorkspaceDto {
    @IsString()
    name: string

    @IsString()
    @Validate(UniqueField, ['slug'])
    slug: string
}
