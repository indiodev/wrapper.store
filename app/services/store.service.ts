import { CreateStoreDTO, QueryStoreDTO, UpdateStoreDTO } from '#dto/store.dto'
import ApplicationException from '#exceptions/application'
import StoreRepository from '#repositories/store.repository'
import { inject } from '@adonisjs/core'

@inject()
export class StoreService {
  constructor(private storeRepository: StoreRepository) {}

  async create(payload: CreateStoreDTO) {
    const store = await this.storeRepository.findBy({
      hostname: payload.hostname,
    })

    if (store)
      throw new ApplicationException('Loja já existe', {
        status: 400,
        code: 'STORE_ALREADY_EXISTS',
        cause: 'Store already exists',
      })
    const result = await this.storeRepository.create(payload)

    return result.toJSON()
  }

  async update(payload: UpdateStoreDTO) {
    const store = await this.storeRepository.findBy({
      id: payload.id,
      userId: payload.user_id,
      clause: 'AND',
    })

    if (!store)
      throw new ApplicationException('Loja não encontrado', {
        status: 404,
        code: 'STORE_NOT_FOUND',
        cause: 'Store not found',
      })

    const result = await this.storeRepository.update(payload)
    return result.toJSON()
  }

  async show(id: number) {
    const result = await this.storeRepository.findBy({ id })
    if (!result)
      throw new ApplicationException('store não encontrado', {
        cause: 'store not found',
        code: 'store_NOT_FOUND',
        status: 404,
      })
    return result.toJSON()
  }

  async paginate(payload: QueryStoreDTO) {
    const result = await this.storeRepository.paginate({ ...payload, userId: payload.user_id })
    return result
  }

  async list(payload: Partial<QueryStoreDTO>) {
    const result = await this.storeRepository.list({ ...payload, userId: payload.user_id })
    return result
  }
}
