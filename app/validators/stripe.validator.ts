import vine from '@vinejs/vine'

export const StripeCreateCredentialSchema = vine.object({
  publishable_key: vine.string().trim(),
  secret_key: vine.string().trim(),
  user_id: vine.number().positive().optional(),
})

export const StripeCreateCredentialValidator = vine.compile(StripeCreateCredentialSchema)
