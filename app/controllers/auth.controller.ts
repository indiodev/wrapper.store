import { AuthService } from '#services/auth.service'
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
}
