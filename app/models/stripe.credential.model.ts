import BaseSerialModel from '#models/base.model'
import User from '#models/user.model'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class StripeCredential extends BaseSerialModel {
  static table = 'stripe_credential'

  @column({
    columnName: 'secret_key',
    serializeAs: 'secret_key',
  })
  declare secret_key: string

  @column({
    columnName: 'publishable_key',
    serializeAs: 'publishable_key',
  })
  declare publishable_key: string

  @column({
    columnName: 'user_id',
    serializeAs: 'user_id',
  })
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
