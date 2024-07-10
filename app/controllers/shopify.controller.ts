import ShopifyService from '#services/shopify.service'
import { ShopifyCreateCredentialValidator } from '#validators/shopify.validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ShopifyController {
  constructor(private shopifyService: ShopifyService) {}

  async credential({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(ShopifyCreateCredentialValidator)
    const result = await this.shopifyService.credential({
      ...payload,
      user_id: auth.user!.id,
    })
    return response.ok(result)
  }

  async showCredential({ response, auth }: HttpContext) {
    const result = await this.shopifyService.showCredential(auth.user!.id)
    return response.ok(result)
  }
}
