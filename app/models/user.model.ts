import BaseSerialModel from '#models/base.model'
import Wrapper from '#models/wrapper.model'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseSerialModel, AuthFinder) {
  static table = 'users'

  @column()
  declare name: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column({
    columnName: 'stripe_secret_key',
    serializeAs: 'stripe_secret_key',
  })
  declare stripe_secret_key: string | null

  @column({
    columnName: 'stripe_public_key',
    serializeAs: 'stripe_public_key',
  })
  declare stripe_public_key: string | null

  @hasMany(() => Wrapper)
  declare wrappers: HasMany<typeof Wrapper>

  static tokens = DbAccessTokensProvider.forModel(User)
}
