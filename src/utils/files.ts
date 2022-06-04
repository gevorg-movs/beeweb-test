import { extname } from 'path'
import { Request } from 'express'

export const generateFileRandomName = (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void,
) => {
    const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('')
    return callback(null, `${randomName}${extname(file.originalname)}`)
}
