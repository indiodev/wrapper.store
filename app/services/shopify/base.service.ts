import ApplicationException from '#exceptions/application'
import ShopifyCredentialRepository from '#repositories/shopify.credential.repository'
import StoreRepository from '#repositories/store.repository'
import { LATEST_API_VERSION, shopifyApi } from '@shopify/shopify-api'
import { restResources } from '@shopify/shopify-api/rest/admin/2024-07'

export default class BaseShopifyService {
  constructor(
    protected storeRepository: StoreRepository,
    protected shopifyCredentialRepository: ShopifyCredentialRepository
  ) {}

  async initialize(store_id: number) {
    const store = await this.storeRepository.findBy({ id: store_id })

    if (!store) throw new ApplicationException('Loja não encontrada', { status: 404 })

    const credential = await this.shopifyCredentialRepository.findBy({ userId: store.userId })

    if (!credential) throw new ApplicationException('Credencial não encontrada', { status: 404 })

    const shop = shopifyApi({
      apiSecretKey: credential.secret_key,
      apiKey: credential.client_id,
      scopes: ['write_products', 'read_products'],
      hostName: 'indio-wrapper-api-0e2cd9be1343.herokuapp.com',
      apiVersion: LATEST_API_VERSION,
      isEmbeddedApp: false,
      restResources,
    })

    return {
      shopify: shop,
      data: {
        hostname: store.hostname,
      },
    }
  }
}
