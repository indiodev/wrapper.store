import { ShopifyCallbackDTO, ShopifyInstallDTO } from '#dto/shopify.dto'
import ApplicationException from '#exceptions/application'
import WrapperRepository from '#repositories/wrapper.repository'
import BaseShopifyService from '#services/shopify/base.service'
import { inject } from '@adonisjs/core'
import axios from 'axios'
import { randomBytes } from 'node:crypto'

const forwardingAddress = 'https://9f2c-2803-9810-6317-8510-9c4c-cf65-e8dc-ae06.ngrok-free.app' // our ngrok url

@inject()
export default class AuthShopifyService extends BaseShopifyService {
  constructor(protected wrapperRepository: WrapperRepository) {
    super(wrapperRepository)
  }

  async install(payload: ShopifyInstallDTO) {
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

      const STATE = randomBytes(16).toString('hex')

      const REDIRECT_URI = forwardingAddress + '/auth/shopify/callback'

      const INSTALL_URL = `https://${payload.shop}/admin/oauth/authorize?client_id=${shopify.config.apiKey}&scope=${shopify.config.scopes?.toString()}&state=${STATE}&redirect_uri=${REDIRECT_URI}`
      return { url: INSTALL_URL, state: STATE }
    } catch (error) {
      console.error(error)

      throw error
    }
  }

  async callback(payload: ShopifyCallbackDTO) {
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

      const accessTokenRequestUrl = `https://${payload.shop}/admin/oauth/access_token`
      const accessTokenPayload = {
        client_id: shopify.config.apiKey,
        client_secret: shopify.config.apiSecretKey,
        code: payload.code,
      }

      const {
        data: { access_token },
      } = await axios.post<{ access_token: string; scope: string }>(
        accessTokenRequestUrl,
        accessTokenPayload
      )

      const response = await axios.get(`https://${payload.shop}/admin/shop.json`, {
        headers: {
          'X-Shopify-Access-Token': access_token,
        },
      })

      return response.data
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
