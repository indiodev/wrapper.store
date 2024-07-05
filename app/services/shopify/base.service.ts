import ApplicationException from '#exceptions/application'
import WrapperRepository from '#repositories/wrapper.repository'
import { LATEST_API_VERSION, shopifyApi } from '@shopify/shopify-api'
import { restResources } from '@shopify/shopify-api/rest/admin/2024-07'

export default class BaseShopifyService {
  constructor(protected wrapperRepository: WrapperRepository) {}

  async initialize(wrapper_id: number) {
    const wrapper = await this.wrapperRepository.findBy({ id: wrapper_id })

    if (!wrapper) throw new ApplicationException('Wrapper não encontrado', { status: 404 })

    const shop = shopifyApi({
      apiSecretKey: wrapper.secret_key,
      apiKey: wrapper.public_key,
      scopes: ['write_products', 'read_products'],
      hostName: '24fe-138-84-43-235.ngrok-free.app',
      apiVersion: LATEST_API_VERSION,
      isEmbeddedApp: false,
      restResources,
    })

    return {
      shopify: shop,
      data: {
        hostname: wrapper.hostname,
      },
    }
  }
}
