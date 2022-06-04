import { registerDecorator, ValidationOptions } from 'class-validator'

export const IsValidObjectId = (
    property?: string,
    validationOptions?: ValidationOptions,
) => {
    return (object?: Object, propertyName?: string) => {
        registerDecorator({
            name: 'isValidObjectId',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any) {
                    return value && value.match(/^[0-9a-fA-F]{24}$/)
                },
                defaultMessage(validationArguments): string {
                    return `${validationArguments.property} must be a valid ObjectId`
                },
            },
        })
    }
}
