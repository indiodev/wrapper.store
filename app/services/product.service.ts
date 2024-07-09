import { CreateProductDTO, QueryProductDTO } from '#dto/product.dto'
import ApplicationException from '#exceptions/application'
import ProductRepository from '#repositories/product.repository'
import UserRepository from '#repositories/user.repository'
import ProductShopifyService from '#services/shopify/product.service'
import { StoreService } from '#services/store.service'
import PaymentLinkStripeService from '#services/stripe/payment.link.service'
import PriceStripeService from '#services/stripe/price.service'
import ProductStripeService from '#services/stripe/product.service'
import { Provider } from '#util/enum'
import { inject } from '@adonisjs/core'

@inject()
export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private userRepository: UserRepository,
    private storeService: StoreService,
    private stripeProductService: ProductStripeService,
    private stripePriceService: PriceStripeService,
    private stripePaymentLinkService: PaymentLinkStripeService,
    private shopifyProductService: ProductShopifyService
  ) {}

  async stripe({ currencies, photo, wrapper_id, user_id, ...payload }: CreateProductDTO) {
    const user = await this.userRepository.findBy({ id: user_id })

    if (!user) {
      throw new ApplicationException('Usário não encontrado', {
        cause: 'User not found',
        code: 'USER_NOT_FOUND',
        status: 404,
      })
    }
    const [store] = await this.storeService.upload(
      [{ file: photo, identifier: 'photo' }],
      'products'
    )

    const created = await this.productRepository.create({
      ...payload,
      photo: store.url,
      provider: Provider.STRIPE,
      userId: user_id,
    })

    await created.related('user').associate(user)

    const stripe = await this.stripeProductService.create({
      name: created.name,
      description: created.description,
      photo: created.photo,
      user_id,
      id: created.id,
    })

    const prices = await this.stripePriceService.create({
      currencies,
      price: created.price,
      id: stripe.id,
      user_id,
      stripe_product_id: stripe.stripe_product_id!,
    })

    await this.stripePaymentLinkService.create({
      user_id,
      prices: prices.map((price) => ({
        id: price.id,
        currency: price.currency,
        stripe_price_id: price.stripe_price_id!,
      })),
    })

    return created.toJSON()
  }

  async shopify({ currencies, photo, wrapper_id, user_id, ...payload }: CreateProductDTO) {
    const user = await this.userRepository.findBy({ id: user_id })

    if (!user) {
      throw new ApplicationException('Usário não encontrado', {
        cause: 'User not found',
        code: 'USER_NOT_FOUND',
        status: 404,
      })
    }
    const [store] = await this.storeService.upload(
      [{ file: photo, identifier: 'photo' }],
      'products'
    )

    const created = await this.productRepository.create({
      ...payload,
      photo: store.url,
      provider: Provider.SHOPIFY,
      userId: user_id,
    })

    await created.related('user').associate(user)

    const shopify = await this.shopifyProductService.create({
      ...payload,
      wrapper_id: wrapper_id!,
      id: created.id,
      photo: store.url,
    })

    await shopify.related('prices').createMany(
      currencies.map((currency) => ({
        currency,
      }))
    )

    return created.toJSON()
  }

  async show(id: number) {
    const product = await this.productRepository.findBy({ id })
    if (!product) {
      throw new ApplicationException('Produto não encontrado', {
        cause: 'Product not found',
        code: 'PRODUCT_NOT_FOUND',
        status: 404,
      })
    }
    return product.toJSON()
  }

  async paginate(payload: QueryProductDTO) {
    const result = await this.productRepository.paginate(payload)
    return result
  }
}
