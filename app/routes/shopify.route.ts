const ShopifyController = () => import('#controllers/shopify.controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export const ShopifyRoute = router
  .group(function () {
    router.post('credential', [ShopifyController, 'credential']).middleware(middleware.auth())
  })
  .prefix('shopify')
