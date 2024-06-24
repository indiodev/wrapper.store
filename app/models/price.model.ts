import BaseSerialModel from '#models/base.model'
import Product from '#models/product.model'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Price extends BaseSerialModel {
  static table = 'prices'

  @column()
  declare currency: string

  @column({ columnName: 'stripe_price_id', serializeAs: 'stripe_price_id' })
  declare stripe_price_id: string | null

  @column({ columnName: 'stripe_payment_link', serializeAs: 'stripe_payment_link' })
  declare stripe_payment_link: string | null

  // @column({ columnName: 'shopify_price_id', serializeAs: 'shopify_price_id' })
  // declare shopify_price_id: string | null

  @column({ columnName: 'product_id', serializeAs: 'product_id' })
  declare productId: number

  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>
}
