import { CreateStripeProductDTO } from '#dto/stripe.dto'
import ProductRepository from '#repositories/product.repository'
import UserRepository from '#repositories/user.repository'
import BaseStripeService from '#services/stripe/base.service'
import { inject } from '@adonisjs/core'

@inject()
export default class ProductStripeService extends BaseStripeService {
  constructor(
    protected userRepository: UserRepository,
    private productRepository: ProductRepository
  ) {
    super(userRepository)
  }

  async create(payload: CreateStripeProductDTO) {
    const client = await this.init(payload.user_id!)
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
}
