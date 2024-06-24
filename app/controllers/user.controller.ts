import UserService from '#services/user.service'
import { UpdateUserValidator } from '#validators/user.validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class UserController {
  constructor(private userService: UserService) {}

  async profile({ response, auth }: HttpContext) {
    const result = await this.userService.show(auth.user!.id)
    return response.ok(result)
  }

  async update({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(UpdateUserValidator)
    const result = await this.userService.update({
      ...payload,
      id: auth.user!.id,
    })
    return response.ok(result)
  }
}
