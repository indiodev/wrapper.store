import { UpdateProductDTO } from '#dto/product.dto'
import ApplicationException from '#exceptions/application'
import ProductRepository from '#repositories/product.repository'
import ShopifyCredentialRepository from '#repositories/shopify.credential.repository'
import StoreRepository from '#repositories/store.repository'
import BaseShopifyService from '#services/shopify/base.service'
import { inject } from '@adonisjs/core'
import { Session } from '@shopify/shopify-api'

@inject()
export default class ProductShopifyService extends BaseShopifyService {
  constructor(
    protected storeRepository: StoreRepository,
    private productRepository: ProductRepository,
    protected shopifyCredentialRepository: ShopifyCredentialRepository
  ) {
    super(storeRepository, shopifyCredentialRepository)
  }

  async create({
    user_id,
    photo,
    currencies,
    store_id,
    ...payload
  }: Partial<Omit<UpdateProductDTO, 'photo'>> & { store_id: number; photo: string }) {
    const store = await this.storeRepository.findBy({ id: store_id })

    if (!store) {
      throw new ApplicationException('store não encontrado', {
        cause: 'store not found',
        code: 'store_NOT_FOUND',
        status: 404,
      })
    }
    const { shopify } = await this.initialize(store_id)

    const session = new Session({
      id: store.session.id,
      accessToken: store.session.access_token,
      shop: store.session.shop,
      state: store.session.state,
      isOnline: store.session.is_online,
      scope: store.session.scope,
      expires: new Date(store.session.expires!),
    })

    const product = new shopify.rest.Product({ session: session })

    product.title = payload.name!
    product.body_html = payload.description!
    product.vendor = 'store.store'
    product.images = [
      {
        src: photo,
      },
    ]

    product.variants = [
      {
        price: payload.price!,
        inventory_quantity: payload.quantity,
      },
    ]

    await product.save({
      update: true,
    })

    return await this.productRepository.update({
      id: payload.id!,
      shopify_product_id: String(product.id),
    })
  }
}
