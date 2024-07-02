import { ShopifyCallbackSchema, ShopifyInstallSchema } from '#validators/shopify.validator'
import { Infer } from '@vinejs/vine/types'

export type ShopifyInstallDTO = Infer<typeof ShopifyInstallSchema>
export type ShopifyCallbackDTO = Infer<typeof ShopifyCallbackSchema>
