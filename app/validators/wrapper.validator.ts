import { QueryBaseSchema } from '#validators/query.validator'
import vine from '@vinejs/vine'

export const CreateWrapperSchema = vine.object({
  secret_key: vine.string().trim(),
  public_key: vine.string().trim(),
  hostname: vine.string().trim().optional(),
  // provider: vine.enum(Provider).optional(),
  user_id: vine.number().positive().optional(),
})

export const UpdateWrapperSchema = vine.object({
  id: vine.number().positive().optional(),
  secret_key: vine.string().trim().optional(),
  public_key: vine.string().trim().optional(),
  hostname: vine.string().trim().optional(),
  user_id: vine.number().positive().optional(),
})

export const CreateWrapperValidator = vine.compile(CreateWrapperSchema)
export const UpdateWrapperValidator = vine.compile(UpdateWrapperSchema)
export const QueryWrapperValidator = vine.compile(QueryBaseSchema)
