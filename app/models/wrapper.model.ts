import BaseSerialModel from '#models/base.model'
import User from '#models/user.model'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Wrapper extends BaseSerialModel {
  static table = 'wrappers'

  @column({ columnName: 'secret_key', serializeAs: 'secret_key' })
  declare secret_key: string

  @column({ columnName: 'public_key', serializeAs: 'public_key' })
  declare public_key: string

  @column()
  declare hostname: string | null

  // @column()
  // declare provider: Provider

  @column({
    columnName: 'user_id',
    serializeAs: 'user_id',
  })
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
