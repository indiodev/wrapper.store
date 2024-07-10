import { DashboardService } from '#services/dashboard.service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  async index({ response, auth }: HttpContext) {
    const result = await this.dashboardService.index({ user_id: auth.user!.id })
    return response.ok(result)
  }
}
