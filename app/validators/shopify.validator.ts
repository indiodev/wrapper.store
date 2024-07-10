import vine from '@vinejs/vine'

export const ShopifyInstallSchema = vine.object({
  shop: vine.string().trim(),
})

export const ShopifyCallbackSchema = vine.object({
  code: vine.string().trim(),
  hmac: vine.string().trim(),
  host: vine.string().trim(),
  shop: vine.string().trim(),
  state: vine.string().trim(),
  timestamp: vine.string().trim(),
})

export const ShopifyCreateCredentialSchema = vine.object({
  secret_key: vine.string().trim(),
  client_id: vine.string().trim(),
  user_id: vine.number().positive().optional(),
})

export const ShopifyInstallValidator = vine.compile(ShopifyInstallSchema)
export const ShopifyCallbackValidator = vine.compile(ShopifyCallbackSchema)
export const ShopifyCreateCredentialValidator = vine.compile(ShopifyCreateCredentialSchema)
