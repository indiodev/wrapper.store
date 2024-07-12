import { StoreService } from '#services/store.service'
import {
  CreateStoreValidator,
  QueryStoreValidator,
  UpdateStoreValidator,
} from '#validators/store.validator'

import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class StoreController {
  constructor(private storeService: StoreService) {}

  async shopify({ request, auth }: HttpContext) {
    const { ...payload } = await request.validateUsing(CreateStoreValidator)
    return await this.storeService.create({
      ...payload,
      user_id: auth.user?.id,
    })
  }

  async update({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(UpdateStoreValidator)
    const { id } = await UpdateStoreValidator.validate(request.params())
    const result = await this.storeService.update({
      ...payload,
      user_id: auth.user!.id,
      id,
    })
    return response.ok(result)
  }

  async show({ request, response }: HttpContext) {
    const { id } = await UpdateStoreValidator.validate(request.params())
    const result = await this.storeService.show(id!)
    return response.ok(result)
  }

  async paginate({ request, response, auth }: HttpContext) {
    const payload = await QueryStoreValidator.validate(request.qs())
    const result = await this.storeService.paginate({ ...payload, user_id: auth.user!.id })
    return response.ok(result)
  }

  async list({ response, auth }: HttpContext) {
    const result = await this.storeService.list({ user_id: auth.user!.id })
    return response.ok(result)
  }
}
