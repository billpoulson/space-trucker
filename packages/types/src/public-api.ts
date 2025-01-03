/*
 * Public API Surface of types
 */

// // Exporting types
// export type OrganizationOwnedObject = {
//   organization: string
// }

// export type ImportFromMemoryRequest = {
//   filename: string
//   data: Buffer
//   contentType: string
// } & OrganizationOwnedObject

export type Dictionary<TVal> = { [k: string | number]: TVal }

export * from './lib/message-types/index'
export * from './lib/user-info-object'

