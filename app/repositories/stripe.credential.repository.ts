import { Create, Find, Update, Where } from '#dto/type.dto'
import ApplicationException from '#exceptions/application'
import Model from '#models/stripe.credential.model'

import stringHelpers from '@adonisjs/core/helpers/string'
import database from '@adonisjs/lucid/services/db'

export default class StripeCredentialRepository {
  constructor() {}

  async create(payload: Create<typeof Model>) {
    return await database.transaction(async function (client) {
      return await Model.create(payload, { client })
    })
  }

  async update(payload: Update<typeof Model>) {
    return await database.transaction(async function (client) {
      const user = await Model.query({ client }).where('id', payload?.id!).firstOrFail()
      user?.merge(payload)
      return await user?.save()
    })
  }

  async delete(payload: Pick<Where<typeof Model>, 'id'>) {
    return await database.transaction(async function (client) {
      const user = await Model.query({ client }).where('id', payload?.id!).firstOrFail()
      return await user?.delete()
    })
  }

  async findBy({ clause, ...payload }: Find<typeof Model>) {
    return await database.transaction(async function (client) {
      const keys = Object.keys(payload)

      if (keys.length === 0) return null

      if (keys.length === 1) {
        const [value] = Object.values(payload).map((item) => item !== null && item)
        const [key] = Object.keys(payload).map((k) => stringHelpers.snakeCase(k))
        const user = await Model?.query({ client }).where(key, value).first()
        if (!user) return null
        return user
      }

      if (keys.length > 1 && !clause)
        throw new ApplicationException('Clause query is required', {
          cause: 'Clause query is required',
          code: 'CLAUSE_QUERY_REQUIRED',
          status: 400,
        })

      const values = Object.values(payload).map((item) => item !== null && item)
      const raw = keys
        .flatMap((key) => ` "stripe_credential"."${stringHelpers.snakeCase(key)}" = ? `)
        .join(` ${clause} `)
      const user = await Model?.query({ client }).whereRaw(raw, values).first()
      if (!user) return null
      return user
    })
  }
}
