import { ProductService } from '#services/product.service'
import {
  CreateProductValidator,
  QueryProductValidator,
  UpdateProductValidator,
} from '#validators/product.validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ProductController {
  constructor(private productService: ProductService) {}

  async shopify(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(CreateProductValidator)
    const result = await this.productService.shopify({
      ...payload,
      user_id: ctx.auth.user?.id,
    })
    return ctx.response.ok(result)
  }

  async show({ request, response }: HttpContext) {
    const { id } = await UpdateProductValidator.validate(request.params())
    const result = await this.productService.show(id!)
    return response.ok(result)
  }

  async paginate({ request, response }: HttpContext) {
    const payload = await QueryProductValidator.validate(request.qs())
    const result = await this.productService.paginate(payload)
    return response.ok(result)
  }
}
