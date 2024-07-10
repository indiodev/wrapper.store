import { ShopifyCreateCredentialDTO } from '#dto/shopify.dto'
import ApplicationException from '#exceptions/application'
import ShopifyCredentialRepository from '#repositories/shopify.credential.repository'
import UserRepository from '#repositories/user.repository'
import { inject } from '@adonisjs/core'

@inject()
export default class ShopifyService {
  constructor(
    protected userRepository: UserRepository,
    private shopifyCredentialRepository: ShopifyCredentialRepository
  ) {}

  async credential(payload: ShopifyCreateCredentialDTO) {
    const user = await this.userRepository.findBy({ id: payload.user_id })

    if (!user)
      throw new ApplicationException('Usuário não encontrado', {
        cause: 'User not found',
        code: 'USER_NOT_FOUND',
        status: 404,
      })

    if (
      user?.shopify?.secret_key === payload.secret_key &&
      user?.shopify?.client_id === payload.client_id
    )
      throw new ApplicationException('Chave publica e privada já existem', {
        status: 404,
        cause: 'Public key and secret key already exist',
        code: 'PUBLIC_KEY_AND_SECRET_KEY_ALREADY_EXIST',
      })

    return await this.shopifyCredentialRepository.create(payload)
  }

  async showCredential(user_id: number) {
    const user = await this.userRepository.findBy({ id: user_id })
    if (!user)
      throw new ApplicationException('Usário não encontrado', {
        cause: 'User not found',
        code: 'USER_NOT_FOUND',
        status: 404,
      })

    return await this.shopifyCredentialRepository.findBy({ userId: user.id })
  }
}
