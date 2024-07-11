import { Create } from '#dto/type.dto'
import ProductModel from '#models/product.model'
import {
  StripeCreateCredentialSchema,
  StripeQueryCheckoutSchema,
} from '#validators/stripe.validator'
import { Infer } from '@vinejs/vine/types'

export type CreateStripeProductDTO = Pick<
  Create<typeof ProductModel>,
  'name' | 'description' | 'photo'
> & {
  user_id?: number
  secret_key?: string
  id: number
}
export type CreateStripePriceDTO = {
  id: number
  price: number
  currencies: string[]
  stripe_product_id: string
  user_id?: number
  secret_key?: string
}
export type CreateStripePaymentLinkDTO = {
  id: number
  currency: string
  stripe_price_id: string
  secret_key?: string
}

export type StripeCreateCredentialDTO = Infer<typeof StripeCreateCredentialSchema>
export type StripeQueryCheckoutDTO = Infer<typeof StripeQueryCheckoutSchema>
