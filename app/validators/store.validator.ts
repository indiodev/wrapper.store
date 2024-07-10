import { QueryBaseSchema } from '#validators/query.validator'
import vine from '@vinejs/vine'

export const CreateStoreSchema = vine.object({
  hostname: vine.string().trim(),
  name: vine.string().trim(),
  user_id: vine.number().positive().optional(),
})

export const UpdateStoreSchema = vine.object({
  id: vine.number().positive().optional(),
  hostname: vine.string().trim(),
  name: vine.string().trim(),
  user_id: vine.number().positive().optional(),
})

export const CreateStoreValidator = vine.compile(CreateStoreSchema)
export const UpdateStoreValidator = vine.compile(UpdateStoreSchema)
export const QueryStoreValidator = vine.compile(QueryBaseSchema)
