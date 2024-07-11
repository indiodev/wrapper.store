import {
  CreateStripePriceDTO,
  CreateStripeProductDTO,
  StripeCreateCredentialDTO,
  StripeQueryCheckoutDTO,
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

    const charges = await client.charges.list({
      limit: 100,
    })

    const result = await Promise.all(
      charges.data.map(async (charge) => {
        const product = await this.productRepository.findBy({
          stripe_product_id: charge.metadata.product_id,
        })

        return {
          id: charge.id,
          amount: charge.amount,
          currency: charge.currency,
          status: charge.status,
          billing_email: charge.billing_details.email,
          billing_name: charge.billing_details.name,
          product_name: product?.name ?? null,
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

  async checkoutProduct(payload: StripeQueryCheckoutDTO) {
    const price = await this.priceRepository.findBy({ stripe_price_id: payload.price_id })

    if (!price)
      throw new ApplicationException('Preço não encontrado', {
        cause: 'Price not found',
        code: 'Price_NOT_FOUND',
        status: 404,
      })

    await price.load('product', (p) =>
      p.preload('user', (u) =>
        u
          .select(['id'])
          .preload('stripe', (s) => s.select(['secret_key', 'id', 'publishable_key', 'user_id']))
      )
    )

    if (!price?.product?.user?.stripe?.secret_key || !price?.product?.user?.stripe?.publishable_key)
      throw new ApplicationException('Chave publica e privada não existem', {
        status: 404,
        cause: 'Public key and secret key not found',
        code: 'PUBLIC_KEY_AND_SECRET_KEY_NOT_FOUND',
      })

    const client = new Stripe(price?.product?.user?.stripe?.secret_key)

    const { url } = await client.checkout.sessions.create({
      metadata: {
        product_id: price?.product?.stripe_product_id,
      },
      mode: 'payment',
      success_url: 'http://localhost:3000/products',
      line_items: [
        {
          price: payload.price_id,
          quantity: 1,
        },
      ],
    })

    return { url }
  }

  async getTotalProduct(payload: { secret_key: string }) {
    const client = new Stripe(payload.secret_key!)

    const prices = await client.products.list({
      limit: 100,
    })

    return { total: prices.data.length }
  }

  async getTotalSales(payload: { secret_key: string }) {
    const client = new Stripe(payload.secret_key!)

    const balance = await client.paymentIntents.list({
      limit: 100,
    })

    const total = balance.data.reduce((a, b) => {
      return b.status === 'succeeded' ? a + b.amount : 0
    }, 0)

    return {
      total,
    }
  }

  async getBalance(payload: { secret_key: string }) {
    const client = new Stripe(payload.secret_key!)

    const { available, pending } = await client.balance.retrieve()

    const totalAvailable = available.map((item) => item.amount).reduce((a, b) => a - b, 0)

    const totalPending = pending.map((item) => item.amount).reduce((a, b) => a + b, 0)

    return { total: totalPending - totalAvailable }
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

  async showCredential(user_id: number) {
    const user = await this.userRepository.findBy({ id: user_id })
    if (!user)
      throw new ApplicationException('Usário não encontrado', {
        cause: 'User not found',
        code: 'USER_NOT_FOUND',
        status: 404,
      })

    return await this.stripeCredentialRepository.findBy({ userId: user.id })
  }
}
