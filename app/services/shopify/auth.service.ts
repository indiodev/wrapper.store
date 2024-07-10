import { ShopifyCallbackDTO, ShopifyInstallDTO } from '#dto/shopify.dto'
import ApplicationException from '#exceptions/application'
import ShopifyCredentialRepository from '#repositories/shopify.credential.repository'
import StoreRepository from '#repositories/store.repository'
import BaseShopifyService from '#services/shopify/base.service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AuthShopifyService extends BaseShopifyService {
  constructor(
    protected storeRepository: StoreRepository,
    protected shopifyCredentialRepository: ShopifyCredentialRepository
  ) {
    super(storeRepository, shopifyCredentialRepository)
  }

  async install(ctx: HttpContext, payload: ShopifyInstallDTO) {
    try {
      const store = await this.storeRepository.findBy({
        hostname: payload.shop,
      })

      if (!store)
        throw new ApplicationException('store não encontrado', {
          status: 404,
          cause: 'store not found',
          code: 'store_NOT_FOUND',
        })

      const { shopify } = await this.initialize(store?.id!)

      await shopify.auth.begin({
        shop: payload.shop,
        callbackPath: '/auth/shopify/callback',
        rawRequest: ctx.request.request,
        rawResponse: ctx.response.response,
        isOnline: false,
      })
    } catch (error) {
      console.error(error)

      throw error
    }
  }

  async callback(ctx: HttpContext, payload: ShopifyCallbackDTO) {
    try {
      const store = await this.storeRepository.findBy({
        hostname: payload.shop,
      })

      if (!store) {
        throw new ApplicationException('store não encontrado', {
          status: 404,
          cause: 'store not found',
          code: 'store_NOT_FOUND',
        })
      }

      const { shopify } = await this.initialize(store.id)

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

      await store.related('session').create({
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
