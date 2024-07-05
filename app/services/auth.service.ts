import { ShopifyCallbackDTO, ShopifyInstallDTO } from '#dto/shopify.dto'
import ApplicationException from '#exceptions/application'
import AuthRepository from '#repositories/auth.repository'
import UserRepository from '#repositories/user.repository'
import AuthShopifyService from '#services/shopify/auth.service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private authRepository: AuthRepository,
    private shopifyAuthService: AuthShopifyService
  ) {}

  async signUp(payload: { email: string; password: string; name: string }) {
    const user = await this.userRepository.findBy({ email: payload.email })

    if (user)
      throw new ApplicationException('E-mail já está em uso', {
        cause: 'E-mail already in use',
        code: 'EMAIL_ALREADY_IN_USE',
        status: 400,
      })

    return await this.userRepository.create(payload)
  }

  async signIn(payload: { email: string; password: string }) {
    const user = await this.userRepository.findBy({ email: payload.email })

    if (!user)
      throw new ApplicationException('Usuário não encontrado', {
        cause: 'User not found',
        code: 'USER_NOT_FOUND',
        status: 404,
      })

    const credential = await this.authRepository.verify({ user, password: payload.password })

    if (!credential)
      throw new ApplicationException('Credencial inválida', {
        cause: 'Invalid credential',
        code: 'INVALID_CREDENTIAL',
        status: 400,
      })
    return await this.authRepository.create(user)
  }

  async shopifyInstall(ctx: HttpContext, payload: ShopifyInstallDTO) {
    return await this.shopifyAuthService.install(ctx, payload)
  }

  async shopifyCallback(ctx: HttpContext, payload: ShopifyCallbackDTO) {
    const result = await this.shopifyAuthService.callback(ctx, payload)
    return result
  }
}
