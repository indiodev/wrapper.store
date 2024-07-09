import { CreateStripePriceDTO } from '#dto/stripe.dto'
import PriceRepository from '#repositories/price.repository'
import UserRepository from '#repositories/user.repository'
import BaseStripeService from '#services/stripe/base.service'
import { inject } from '@adonisjs/core'
import Stripe from 'stripe'

@inject()
export default class PriceStripeService extends BaseStripeService {
  constructor(
    protected userRepository: UserRepository,
    private priceRepository: PriceRepository
  ) {
    super(userRepository)
  }

  async create(payload: CreateStripePriceDTO) {
    const client = await this.init(payload.user_id!)
    const prices: Stripe.Response<Stripe.Price>[] = []

    for (const currency of payload.currencies) {
      const price = await client.prices.create({
        currency,
        product: payload.stripe_product_id!,
        unit_amount: payload.price * 100,
      })

      prices.push(price)
    }

    return await this.priceRepository.createMany(
      prices.map((price) => ({
        stripe_price_id: price.id,
        currency: price.currency,
        productId: payload.id!,
      }))
    )
  }
}
