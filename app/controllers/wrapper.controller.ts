import { WrapperService } from '#services/wrapper.service'
import {
  CreateWrapperValidator,
  QueryWrapperValidator,
  UpdateWrapperValidator,
} from '#validators/wrapper.validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class WrapperController {
  constructor(private wrapperService: WrapperService) {}

  // async stripe() {
  //   const { provider = Provider.STRIPE, ...payload } =
  //     await this.context.request.validateUsing(WrapperCreateValidator)
  //   return await this.wrapperService.create({
  //     ...payload,
  //     provider,
  //     userId: this.context.auth.user?.id,
  //   })
  // }

  async shopify({ request, auth }: HttpContext) {
    const {
      // provider = Provider.SHOPIFY,
      ...payload
    } = await request.validateUsing(CreateWrapperValidator)
    return await this.wrapperService.create({
      ...payload,
      // provider,
      user_id: auth.user?.id,
    })
  }

  async update({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(UpdateWrapperValidator)
    const { id } = await UpdateWrapperValidator.validate(request.params())
    const result = await this.wrapperService.update({
      ...payload,
      user_id: auth.user!.id,
      id,
    })
    return response.ok(result)
  }

  async show({ request, response }: HttpContext) {
    const { id } = await UpdateWrapperValidator.validate(request.params())
    const result = await this.wrapperService.show(id!)
    return response.ok(result)
  }

  async paginate({ request, response }: HttpContext) {
    const payload = await QueryWrapperValidator.validate(request.qs())
    const result = await this.wrapperService.paginate(payload)
    return response.ok(result)
  }
}
