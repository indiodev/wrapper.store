import { Create, Find, Update, Where } from '#dto/type.dto'
import ApplicationException from '#exceptions/application'
import Model from '#models/wrapper.model'
import stringHelpers from '@adonisjs/core/helpers/string'
import database from '@adonisjs/lucid/services/db'

export default class WrapperRepository {
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
    const keys = Object.keys(payload)

    if (keys.length === 0) return null

    if (keys.length === 1) {
      const [value] = Object.values(payload).map((item) => item !== null && item)
      const [key] = Object.keys(payload).map((k) => stringHelpers.snakeCase(k))
      const wrapper = await Model?.query().where(key, value).preload('session').first()
      if (!wrapper) return null
      return wrapper
    }

    if (keys.length > 1 && !clause)
      throw new ApplicationException('Clause query is required', {
        cause: 'Clause query is required',
        code: 'CLAUSE_QUERY_REQUIRED',
        status: 400,
      })

    const values = Object.values(payload).map((item) => item !== null && item)

    const raw = keys
      .flatMap((key) => ` "wrappers"."${stringHelpers.snakeCase(key)}" = ? `)
      .join(` ${clause} `)

    const user = await Model?.query().whereRaw(raw, values).preload('session').first()
    if (!user) return null
    return user
  }

  async paginate({ page = 1, per_page = 15, ...payload }: Where<typeof Model>) {
    return await database.transaction(async function (client) {
      return await Model.query({ client })
        .if(payload.search, (query) => query.whereILike('hostname', `%${payload.search}%`))
        .paginate(page, per_page)
    })
  }
}
