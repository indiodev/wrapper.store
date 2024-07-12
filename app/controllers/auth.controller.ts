import { AuthService } from '#services/auth.service'
import env from '#start/env'
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

  async shopifyInstall(ctx: HttpContext) {
    const payload = await ShopifyInstallValidator.validate(ctx.request.qs())
    await this.authService.shopifyInstall(ctx, payload)
  }

  async shopifyCallback(ctx: HttpContext) {
    const payload = await ShopifyCallbackValidator.validate(ctx.request.qs())
    await this.authService.shopifyCallback(ctx, payload)
    return ctx.response.redirect(`https://${env.get('DASHBOARD_APP_HOST')}/shopify-store`)
  }
}
