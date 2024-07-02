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

export const ShopifyInstallValidator = vine.compile(ShopifyInstallSchema)
export const ShopifyCallbackValidator = vine.compile(ShopifyCallbackSchema)
