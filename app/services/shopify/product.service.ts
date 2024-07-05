import { UpdateProductDTO } from '#dto/product.dto'
import ApplicationException from '#exceptions/application'
import ProductRepository from '#repositories/product.repository'
import WrapperRepository from '#repositories/wrapper.repository'
import BaseShopifyService from '#services/shopify/base.service'
import { inject } from '@adonisjs/core'
import { Session } from '@shopify/shopify-api'

@inject()
export default class ProductShopifyService extends BaseShopifyService {
  constructor(
    protected wrapperRepository: WrapperRepository,
    private productRepository: ProductRepository
  ) {
    super(wrapperRepository)
  }

  async create({
    user_id,
    photo,
    currencies,
    wrapper_id,
    ...payload
  }: Partial<Omit<UpdateProductDTO, 'photo'>> & { wrapper_id: number; photo: string }) {
    const wrapper = await this.wrapperRepository.findBy({ id: wrapper_id })

    if (!wrapper) {
      throw new ApplicationException('Wrapper não encontrado', {
        cause: 'Wrapper not found',
        code: 'WRAPPER_NOT_FOUND',
        status: 404,
      })
    }
    const { shopify } = await this.initialize(wrapper_id)

    const session = new Session({
      id: wrapper.session.id,
      accessToken: wrapper.session.access_token,
      shop: wrapper.session.shop,
      state: wrapper.session.state,
      isOnline: wrapper.session.is_online,
      scope: wrapper.session.scope,
      expires: new Date(wrapper.session.expires!),
    })

    const product = new shopify.rest.Product({ session: session })

    product.title = payload.name!
    product.body_html = payload.description!
    product.vendor = 'wrapper.store'
    product.images = [
      {
        src: photo,
      },
    ]

    product.variants = [
      {
        price: payload.amount!,
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
