import BaseSerialModel from '#models/base.model'
import ShopifySession from '#models/shopify.session.model'
import User from '#models/user.model'
import { belongsTo, column, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'

export default class Store extends BaseSerialModel {
  static table = 'stores'

  @column()
  declare name: string

  @column()
  declare hostname: string

  @column({
    columnName: 'user_id',
    serializeAs: 'user_id',
  })
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasOne(() => ShopifySession)
  declare session: HasOne<typeof ShopifySession>
}
