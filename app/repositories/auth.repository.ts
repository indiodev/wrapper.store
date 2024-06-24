import Model from '#models/user.model'
import hash from '@adonisjs/core/services/hash'

export default class AuthRepository {
  constructor() {}

  async create(payload: Model) {
    const credential = await Model.tokens.create(payload)
    const { token, type } = credential?.toJSON()
    return { token, type }
  }

  async verify(payload: { user: Model; password: string }) {
    return hash.verify(payload.user.password, payload.password!)
  }
}
