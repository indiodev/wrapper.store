import { CreateStripePaymentLinkDTO } from '#dto/stripe.dto'
import PriceRepository from '#repositories/price.repository'
import UserRepository from '#repositories/user.repository'
import BaseStripeService from '#services/stripe/base.service'
import { inject } from '@adonisjs/core'
import Stripe from 'stripe'

@inject()
export default class PaymentLinkStripeService extends BaseStripeService {
  constructor(
    protected userRepository: UserRepository,
    private priceRepository: PriceRepository
  ) {
    super(userRepository)
  }

  async create({ user_id, prices }: { user_id?: number; prices: CreateStripePaymentLinkDTO[] }) {
    const client = await this.init(user_id!)
    const links: Stripe.Response<Stripe.PaymentLink & { price_id: number }>[] = []

    for (const price of prices) {
      const result = await client.paymentLinks.create({
        line_items: [{ price: price.stripe_price_id, quantity: 1 }],
        currency: price.currency,
      })
      links.push({ ...result, price_id: price.id })
    }

    return await this.priceRepository.updateMany(
      links.map((link) => ({
        id: link.price_id,
        stripe_payment_link: link.url,
      }))
    )
  }
}
