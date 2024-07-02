import { AuthService } from '#services/auth.service'
import { ShopifyCallbackValidator, ShopifyInstallValidator } from '#validators/shopify.validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AuthController {
  constructor(private authService: AuthService) {}

  async signUp({ request, response }: HttpContext) {
    const payload = request.only(['email', 'password', 'name'])
    const result = await this.authService.signUp(payload)
    return response.ok(result)
  }

  async signIn({ request, response }: HttpContext) {
    const payload = request.only(['email', 'password'])
    const result = await this.authService.signIn(payload)
    return response.ok(result)
  }

  async shopifyInstall({ response, request }: HttpContext) {
    const payload = await ShopifyInstallValidator.validate(request.qs())
    const result = await this.authService.shopifyInstall(payload)
    return response.redirect(result.url)
  }

  async shopifyCallback({ response, request }: HttpContext) {
    const payload = await ShopifyCallbackValidator.validate(request.qs())
    const result = await this.authService.shopifyCallback(payload)
    // return response.ok(result)
    const url = `https://${result.shop.domain}/admin/apps/luca-11`
    console.log({ url })
    return response.redirect(url)
  }
}
