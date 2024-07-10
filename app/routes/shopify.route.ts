const ShopifyController = () => import('#controllers/shopify.controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export const ShopifyRoute = router
  .group(function () {
    router
      .group(function () {
        router.post('/', [ShopifyController, 'credential'])
        router.get('/', [ShopifyController, 'showCredential'])
      })
      .prefix('credential')
  })
  .prefix('shopify')
  .middleware(middleware.auth())
