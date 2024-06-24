import { CreateWrapperDTO, QueryWrapperDTO, UpdateWrapperDTO } from '#dto/wrapper.dto'
import ApplicationException from '#exceptions/application'
import WrapperRepository from '#repositories/wrapper.repository'
import { inject } from '@adonisjs/core'

@inject()
export class WrapperService {
  constructor(private wrapperRepository: WrapperRepository) {}

  async create(payload: CreateWrapperDTO) {
    const wrapper = await this.wrapperRepository.findBy({
      public_key: payload.public_key,
      secret_key: payload.secret_key,
      clause: 'OR',
    })

    if (wrapper)
      throw new ApplicationException('Wrapper já existe', {
        status: 400,
        code: 'WRAPPER_ALREADY_EXISTS',
        cause: 'Wrapper already exists',
      })
    const result = await this.wrapperRepository.create(payload)

    return result.toJSON()
  }

  async update(payload: UpdateWrapperDTO) {
    const wrapper = await this.wrapperRepository.findBy({
      id: payload.id,
      userId: payload.user_id,
      clause: 'AND',
    })

    if (!wrapper)
      throw new ApplicationException('Wrapper não encontrado', {
        status: 404,
        code: 'WRAPPER_NOT_FOUND',
        cause: 'Wrapper not found',
      })

    if (payload.public_key === wrapper.public_key || payload.secret_key === wrapper.secret_key)
      throw new ApplicationException(
        'Public key ou Secret key não podem ser iguais aos anteriores',
        {
          cause: 'Public key or secret key cannot be the same as the previous ones',
          code: 'PUBLIC_KEY_OR_SECRET_KEY_CANNOT_BE_THE_SAME_AS_THE_PREVIOUS_ONES',
          status: 400,
        }
      )

    const result = await this.wrapperRepository.update(payload)
    return result.toJSON()
  }

  async show(id: number) {
    const result = await this.wrapperRepository.findBy({ id })
    if (!result)
      throw new ApplicationException('Wrapper não encontrado', {
        cause: 'Wrapper not found',
        code: 'WRAPPER_NOT_FOUND',
        status: 404,
      })
    return result.toJSON()
  }

  async paginate(payload: QueryWrapperDTO) {
    const result = await this.wrapperRepository.paginate(payload)
    return result
  }
}
