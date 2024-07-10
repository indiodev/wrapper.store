import BaseSerialModel from '#models/base.model'
import User from '#models/user.model'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class ShopifyCredential extends BaseSerialModel {
  static table = 'shopify_credential'

  @column({
    columnName: 'secret_key',
    serializeAs: 'secret_key',
  })
  declare secret_key: string

  @column({
    columnName: 'client_id',
    serializeAs: 'client_id',
  })
  declare client_id: string

  @column({
    columnName: 'user_id',
    serializeAs: 'user_id',
  })
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
