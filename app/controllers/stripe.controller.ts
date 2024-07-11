import { ProductService } from '#services/product.service'
import StripeService from '#services/stripe.service'
import { CreateProductValidator } from '#validators/product.validator'
import {
  StripeCreateCredentialValidator,
  StripeQueryCheckoutValidator,
} from '#validators/stripe.validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class StripeController {
  constructor(
    private stripeService: StripeService,
    private productService: ProductService
  ) {}

  async charges({ response, auth }: HttpContext) {
    const result = await this.stripeService.charges({ user_id: auth.user!.id })
    return response.ok(result)
  }

  async credential({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(StripeCreateCredentialValidator)
    const result = await this.stripeService.credential({
      ...payload,
      user_id: auth.user!.id,
    })
    return response.ok(result)
  }

  async showCredential({ response, auth }: HttpContext) {
    const result = await this.stripeService.showCredential(auth.user!.id)
    return response.ok(result)
  }

  async createProduct({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(CreateProductValidator)
    const result = await this.productService.stripe({
      ...payload,
      user_id: auth.user?.id,
    })
    return response.ok(result)
  }

  async checkout({ request, response }: HttpContext) {
    const payload = await StripeQueryCheckoutValidator.validate(request.qs())
    const { url } = await this.stripeService.checkoutProduct(payload)
    return response.redirect(url!)
  }
}
