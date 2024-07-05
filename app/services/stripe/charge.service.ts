import UserRepository from '#repositories/user.repository'
import BaseStripeService from '#services/stripe/base.service'
import { inject } from '@adonisjs/core'

@inject()
export default class ChargeStripeService extends BaseStripeService {
  constructor(protected userRepository: UserRepository) {
    super(userRepository)
  }

  async list(payload: { user_id: number }) {
    const client = await this.init(payload.user_id!)

    const charges = await client.charges.list({})

    const result = await Promise.all(
      charges.data.map(async (charge) => {
        const invoices = await client.invoices.retrieve(charge.invoice as string)
        const [price] = invoices.lines.data.map((line) => line.price)
        const product = await client.products.retrieve(price?.product as string)
        return {
          id: charge.id,
          amount: charge.amount,
          currency: charge.currency,
          status: charge.status,
          billing_email: charge.billing_details.email,
          billing_name: charge.billing_details.name,
          product_name: product.name,
          created_at: new Date(charge.created * 1000),
        }
      })
    )

    return { result }
  }
}
