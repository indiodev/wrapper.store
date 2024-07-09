import BaseSerialModel from '#models/base.model'
import User from '#models/user.model'
import Wrapper from '#models/wrapper.model'
import { Provider } from '#util/enum'
import { belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import PriceModel from './price.model.js'

export default class Product extends BaseSerialModel {
  static table = 'products'

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare price: number

  @column()
  declare quantity: number

  @column()
  declare photo: string

  @column({ columnName: 'stripe_product_id', serializeAs: 'stripe_product_id' })
  declare stripe_product_id: string | null

  @column({ columnName: 'shopify_product_id', serializeAs: 'shopify_product_id' })
  declare shopify_product_id: string | null

  @column()
  declare provider: Provider

  @column({ columnName: 'user_id', serializeAs: 'user_id' })
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column({ columnName: 'wrapper_id', serializeAs: 'wrapper_id' })
  declare wrapperId: number | null

  @belongsTo(() => Wrapper)
  declare wrapper: BelongsTo<typeof Wrapper>

  @hasMany(() => PriceModel)
  declare prices: HasMany<typeof PriceModel>
}
