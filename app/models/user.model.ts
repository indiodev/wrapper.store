import BaseSerialModel from '#models/base.model'
import ShopifyCredential from '#models/shopify.credential.model'
import StripeCredential from '#models/stripe.credential.model'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { column, hasOne } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'

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

  @hasOne(() => StripeCredential)
  declare stripe: HasOne<typeof StripeCredential>

  @hasOne(() => ShopifyCredential)
  declare shopify: HasOne<typeof ShopifyCredential>

  static tokens = DbAccessTokensProvider.forModel(User)
}
