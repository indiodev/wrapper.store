import { QueryUserDTO, UpdateUserDTO } from '#dto/user.dto'
import ApplicationException from '#exceptions/application'
import UserRepository from '#repositories/user.repository'
import { inject } from '@adonisjs/core'

@inject()
export default class UserService {
  constructor(private userRepository: UserRepository) {}
  async show(id: number) {
    const user = await this.userRepository.findBy({ id })

    if (!user)
      throw new ApplicationException('Usário não encontrado', {
        cause: 'User not found',
        code: 'USER_NOT_FOUND',
        status: 404,
      })

    return user.toJSON()
  }

  async update(payload: UpdateUserDTO) {
    const user = await this.userRepository.findBy({ id: payload.id })
    if (!user)
      throw new ApplicationException('Usário não encontrado', {
        cause: 'User not found',
        code: 'USER_NOT_FOUND',
        status: 404,
      })

    if (
      payload.stripe_public_key === user.stripe_public_key ||
      payload.stripe_secret_key === user.stripe_secret_key
    )
      throw new ApplicationException(
        'Public key ou Secret key não podem ser iguais aos anteriores',
        {
          cause: 'Public key or secret key cannot be the same as the previous ones',
          code: 'PUBLIC_KEY_OR_SECRET_KEY_CANNOT_BE_THE_SAME_AS_THE_PREVIOUS_ONES',
          status: 400,
        }
      )

    return await this.userRepository.update(payload)
  }

  async paginate(payload: QueryUserDTO) {
    const result = await this.userRepository.paginate(payload)
    return result
  }
}
