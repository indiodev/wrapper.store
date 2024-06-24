import ApplicationException from '#exceptions/application'
import UserRepository from '#repositories/user.repository'
import Stripe from 'stripe'

export default class BaseStripeService {
  // protected stripe: Stripe | null = null
  constructor(protected userRepository: UserRepository) {}

  async init(id: number) {
    const user = await this.userRepository.findBy({ id })

    if (!user)
      throw new ApplicationException('Usuário não encontrado', {
        cause: 'User not found',
        code: 'USER_NOT_FOUND',
        status: 404,
      })

    if (!user.stripe_public_key || !user.stripe_secret_key)
      throw new ApplicationException('Chave publica ou privada não encontrada', {
        cause: 'Public key or secret key not found',
        code: 'PUBLIC_KEY_OR_SECRET_KEY_NOT_FOUND',
        status: 404,
      })

    return new Stripe(user.stripe_secret_key)
  }
}
