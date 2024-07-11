import vine from '@vinejs/vine'

export const StripeCreateCredentialSchema = vine.object({
  publishable_key: vine.string().trim(),
  secret_key: vine.string().trim(),
  user_id: vine.number().positive().optional(),
})

export const StripeCreateCredentialValidator = vine.compile(StripeCreateCredentialSchema)

export const StripeQueryCheckoutSchema = vine.object({
  price_id: vine.string().trim(),
})
export const StripeQueryCheckoutValidator = vine.compile(StripeQueryCheckoutSchema)
