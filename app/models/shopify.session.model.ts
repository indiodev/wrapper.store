import Store from '#models/store.model'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class ShopifySession extends BaseModel {
  static table = 'shopify_sessions'

  @column()
  declare id: string

  @column()
  declare shop: string

  @column()
  declare state: string

  @column()
  declare scope: string

  @column()
  declare access_token: string

  @column()
  declare is_online: boolean

  @column()
  declare expires: Date | null

  @column({
    serializeAs: 'store_id',
    columnName: 'store_id',
  })
  declare storeId: number

  @belongsTo(() => Store)
  declare store: BelongsTo<typeof Store>
}
