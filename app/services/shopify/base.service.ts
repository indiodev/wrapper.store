import ApplicationException from '#exceptions/application'
import WrapperRepository from '#repositories/wrapper.repository'
import { LATEST_API_VERSION, Session, shopifyApi } from '@shopify/shopify-api'

export default class BaseShopifyService {
  constructor(protected wrapperRepository: WrapperRepository) {}

  private async configure(wrapper_id: number) {
    const wrapper = await this.wrapperRepository.findBy({ id: wrapper_id })

    if (!wrapper) throw new ApplicationException('Wrapper não encontrado', { status: 404 })

    const shop = shopifyApi({
      apiSecretKey: wrapper.secret_key,
      apiKey: wrapper.public_key,
      scopes: ['write_products', 'read_products'],
      hostName: wrapper.hostname!,
      apiVersion: LATEST_API_VERSION,
      isEmbeddedApp: false,
    })

    return {
      shopify: shop,
      data: {
        hostname: wrapper.hostname,
        access_token: wrapper.access_token,
      },
    }
  }

  async init(wrapper_id: number) {
    const { shopify, data } = await this.configure(wrapper_id)

    return new shopify.clients.Rest({
      session: {
        shop: data.hostname!,
        accessToken: data.access_token!,
      } as Session,
    })
  }
}
