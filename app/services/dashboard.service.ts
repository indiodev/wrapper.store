import ApplicationException from '#exceptions/application'
import UserRepository from '#repositories/user.repository'
import { inject } from '@adonisjs/core'
import StripeService from './stripe.service.js'

@inject()
export class DashboardService {
  constructor(
    private stripeService: StripeService,
    private userRepository: UserRepository
  ) {}

  async index(payload: { user_id: number }) {
    const user = await this.userRepository.findBy({ id: payload.user_id })

    if (!user)
      throw new ApplicationException('Usário não encontrado', {
        cause: 'User not found',
        code: 'USER_NOT_FOUND',
        status: 404,
      })

    if (
      user?.stripe?.secret_key === null ||
      user?.stripe?.publishable_key === null ||
      !user?.stripe.publishable_key ||
      !user?.stripe.secret_key
    )
      throw new ApplicationException('Chave publica e privada não encontrada', {
        cause: 'Public key or secret key not found',
        code: 'PUBLIC_KEY_OR_SECRET_KEY_NOT_FOUND',
        status: 404,
      })

    const totalProduct = await this.stripeService.getTotalProduct({
      secret_key: user?.stripe?.secret_key,
    })

    const totalBalance = await this.stripeService.getBalance({
      secret_key: user?.stripe?.secret_key,
    })

    const totalSales = await this.stripeService.getTotalSales({
      secret_key: user?.stripe?.secret_key,
    })

    return {
      product: totalProduct,
      balance: totalBalance,
      sales: totalSales,
      user: {
        id: user.id,
        name: user.name,
      },
    }
  }
}
