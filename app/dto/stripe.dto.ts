import { Create } from '#dto/type.dto'
import ProductModel from '#models/product.model'

export type CreateStripeProductDTO = Pick<
  Create<typeof ProductModel>,
  'name' | 'description' | 'photo'
> & {
  user_id?: number
  id: number
}
export type CreateStripePriceDTO = {
  id: number
  price: number
  currencies: string[]
  stripe_product_id: string
  user_id?: number
}
export type CreateStripePaymentLinkDTO = {
  id: number
  currency: string
  // stripe_product_id?: string
  stripe_price_id: string
  // product_id: number
}
