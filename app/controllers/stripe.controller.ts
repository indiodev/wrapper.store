import ChargeStripeService from '#services/stripe/charge.service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class StripeController {
  constructor(private chargeStripeService: ChargeStripeService) {}

  async charges({ response, auth }: HttpContext) {
    const result = await this.chargeStripeService.list({ user_id: auth.user!.id })
    return response.ok(result)
  }
}
