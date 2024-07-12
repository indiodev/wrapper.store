import { CreateProductDTO, QueryProductDTO } from '#dto/product.dto'
import ApplicationException from '#exceptions/application'
import ProductRepository from '#repositories/product.repository'
import UserRepository from '#repositories/user.repository'
import ProductShopifyService from '#services/shopify/product.service'

import StripeService from '#services/stripe.service'
import { Provider } from '#util/enum'
import { inject } from '@adonisjs/core'
import { StoreUploadService } from './store.upload.service.js'

@inject()
export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private userRepository: UserRepository,
    private storeUploadService: StoreUploadService,
    private stripeService: StripeService,
    private shopifyProductService: ProductShopifyService
  ) {}

  async stripe({ currencies, photo, store_id, user_id, ...payload }: CreateProductDTO) {
    const user = await this.userRepository.findBy({ id: user_id })

    if (!user) {
      throw new ApplicationException('Usário não encontrado', {
        cause: 'User not found',
        code: 'USER_NOT_FOUND',
        status: 404,
      })
    }

    if (user?.stripe?.secret_key === null || user?.stripe?.publishable_key === null) {
      throw new ApplicationException('Chave publica e privada não encontrada', {
        cause: 'Public key or secret key not found',
        code: 'PUBLIC_KEY_OR_SECRET_KEY_NOT_FOUND',
        status: 404,
      })
    }

    const [store] = await this.storeUploadService.upload(
      [{ file: photo!, identifier: 'photo' }],
      'products'
    )

    const created = await this.productRepository.create({
      ...payload,
      photo: store.url,
      provider: Provider.STRIPE,
      userId: user_id,
    })

    await created.related('user').associate(user)

    const product = await this.stripeService.createProduct({
      name: created.name,
      description: created.description,
      photo: created.photo,
      user_id,
      id: created.id,
      secret_key: user?.stripe?.secret_key,
    })

    await this.stripeService.createPrice({
      currencies,
      price: created.price,
      id: product.id,
      user_id,
      stripe_product_id: product.stripe_product_id!,
      secret_key: user?.stripe?.secret_key,
    })

    await created.load('prices')

    return created.toJSON()
  }

  async shopify({ currencies, photo, store_id, user_id, ...payload }: CreateProductDTO) {
    const user = await this.userRepository.findBy({ id: user_id })

    if (!user) {
      throw new ApplicationException('Usário não encontrado', {
        cause: 'User not found',
        code: 'USER_NOT_FOUND',
        status: 404,
      })
    }
    const [store] = await this.storeUploadService.upload(
      [{ file: photo!, identifier: 'photo' }],
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
      store_id: store_id!,
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
    const result = await this.productRepository.paginate({ ...payload, userId: payload.user_id })
    return result
  }
}
