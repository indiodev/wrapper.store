import {
  CreateStripePriceDTO,
  CreateStripeProductDTO,
  StripeCreateCredentialDTO,
} from '#dto/stripe.dto'
import ApplicationException from '#exceptions/application'
import PriceRepository from '#repositories/price.repository'
import ProductRepository from '#repositories/product.repository'
import StripeCredentialRepository from '#repositories/stripe.credential.repository'
import UserRepository from '#repositories/user.repository'
import { inject } from '@adonisjs/core'
import Stripe from 'stripe'

@inject()
export default class StripeService {
  constructor(
    protected userRepository: UserRepository,
    private productRepository: ProductRepository,
    private priceRepository: PriceRepository,
    private stripeCredentialRepository: StripeCredentialRepository
  ) {}

  async credential(payload: StripeCreateCredentialDTO) {
    const user = await this.userRepository.findBy({ id: payload.user_id })

    if (!user)
      throw new ApplicationException('Usuário não encontrado', {
        cause: 'User not found',
        code: 'USER_NOT_FOUND',
        status: 404,
      })

    if (
      user?.stripe?.secret_key === payload.secret_key &&
      user?.stripe?.publishable_key === payload.publishable_key
    )
      throw new ApplicationException('Chave publica e privada já existem', {
        status: 404,
        cause: 'Public key and secret key already exist',
        code: 'PUBLIC_KEY_AND_SECRET_KEY_ALREADY_EXIST',
      })

    return await this.stripeCredentialRepository.create(payload)
  }

  async charges(payload: { user_id: number }) {
    const user = await this.checkUserStripe({
      user_id: payload.user_id!,
    })

    const client = new Stripe(user.stripe.secret_key)

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

  async createProduct(payload: CreateStripeProductDTO) {
    const client = new Stripe(payload.secret_key!)

    const product = await client.products.create({
      name: payload.name!,
      description: payload.description,
      images: [payload.photo!],
    })

    return this.productRepository.update({
      id: payload.id!,
      stripe_product_id: product.id,
    })
  }

  async createPrice(payload: CreateStripePriceDTO) {
    const client = new Stripe(payload.secret_key!)

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

  private async checkUserStripe(payload: { user_id: number }) {
    const user = await this.userRepository.findBy({ id: payload.user_id })

    if (!user)
      throw new ApplicationException('Usuário não encontrado', {
        cause: 'User not found',
        code: 'USER_NOT_FOUND',
        status: 404,
      })

    const noExistingCredential =
      !user?.stripe?.secret_key ||
      !user?.stripe?.publishable_key ||
      user?.stripe?.secret_key === null ||
      user?.stripe?.publishable_key === null

    if (noExistingCredential)
      throw new ApplicationException('Chave publica ou privada não encontrada', {
        cause: 'Public key or secret key not found',
        code: 'PUBLIC_KEY_OR_SECRET_KEY_NOT_FOUND',
        status: 404,
      })

    return user
  }
}
