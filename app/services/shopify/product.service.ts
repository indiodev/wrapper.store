import { UpdateProductDTO } from '#dto/product.dto'
import ProductRepository from '#repositories/product.repository'
import WrapperRepository from '#repositories/wrapper.repository'
import BaseShopifyService from '#services/shopify/base.service'
import { inject } from '@adonisjs/core'

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
  }: Partial<UpdateProductDTO> & { wrapper_id: number }) {
    const {
      shopify: { rest },
    } = await this.initialize(wrapper_id)

    const { body } = await rest.post({
      path: 'products',
      data: {
        product: {
          title: payload.name,
          body_html: payload.description,
          vendor: 'novo',
        },
      },
    })

    return await this.productRepository.update({
      id: payload.id,
      shopify_product_id: body.product.id,
    })
  }
}
