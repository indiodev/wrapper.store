import { ShopifyCallbackDTO, ShopifyInstallDTO } from '#dto/shopify.dto'
import ApplicationException from '#exceptions/application'
import WrapperRepository from '#repositories/wrapper.repository'
import BaseShopifyService from '#services/shopify/base.service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AuthShopifyService extends BaseShopifyService {
  constructor(protected wrapperRepository: WrapperRepository) {
    super(wrapperRepository)
  }

  async install(ctx: HttpContext, payload: ShopifyInstallDTO) {
    try {
      const wrapper = await this.wrapperRepository.findBy({
        hostname: payload.shop,
      })

      if (!wrapper)
        throw new ApplicationException('Wrapper não encontrado', {
          status: 404,
          cause: 'Wrapper not found',
          code: 'WRAPPER_NOT_FOUND',
        })

      const { shopify } = await this.initialize(wrapper?.id!)

      await shopify.auth.begin({
        shop: payload.shop,
        callbackPath: '/auth/shopify/callback',
        rawRequest: ctx.request.request,
        rawResponse: ctx.response.response,
        isOnline: false,
      })
      // const STATE = randomBytes(16).toString('hex')

      // const REDIRECT_URI = forwardingAddress + '/auth/shopify/callback'

      // const INSTALL_URL = `https://${payload.shop}/admin/oauth/authorize?client_id=${shopify.config.apiKey}&scope=${shopify.config.scopes?.toString()}&state=${STATE}&redirect_uri=${REDIRECT_URI}`
    } catch (error) {
      console.error(error)

      throw error
    }
  }

  async callback(ctx: HttpContext, payload: ShopifyCallbackDTO) {
    try {
      const wrapper = await this.wrapperRepository.findBy({
        hostname: payload.shop,
      })

      if (!wrapper) {
        throw new ApplicationException('Wrapper não encontrado', {
          status: 404,
          cause: 'Wrapper not found',
          code: 'WRAPPER_NOT_FOUND',
        })
      }

      const { shopify } = await this.initialize(wrapper.id)

      const isValidHmac = await shopify.utils.validateHmac(payload)

      if (!isValidHmac) {
        throw new ApplicationException('HMAC validation failed', {
          cause: 'HMAC validation failed',
          code: 'HMAC_VALIDATION_FAILED',
          status: 400,
        })
      }

      const callback = await shopify.auth.callback({
        rawRequest: ctx.request.request,
        rawResponse: ctx.response.response,
      })

      await wrapper.related('session').create({
        shop: callback.session.shop,
        state: callback.session.state,
        access_token: callback.session.accessToken,
        scope: callback.session.scope,
        is_online: callback.session.isOnline,
        expires: callback.session.expires,
        id: callback.session.id,
      })
    } catch (error) {
      console.error(error)
      throw new ApplicationException(error.message, {
        cause: error.cause,
        code: error.code,
        status: error.status,
      })
    }
  }
}
