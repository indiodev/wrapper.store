import vine from '@vinejs/vine'

export const UpdateUserSchema = vine.object({
  id: vine.number().positive().optional(),
  name: vine.string().trim().optional(),
  email: vine.string().email().trim().optional(),
  password: vine.string().trim().optional(),
  stripe_secret_key: vine.string().trim().optional(),
  stripe_public_key: vine.string().trim().optional(),
})

export const UpdateUserValidator = vine.compile(UpdateUserSchema)
