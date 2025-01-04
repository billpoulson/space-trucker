import { v4 as uuidv4 } from 'uuid'

export const newUUID = (): string => (uuidv4() as string).replace('-', '')
export const newGUID = (): string => (uuidv4() as string)
