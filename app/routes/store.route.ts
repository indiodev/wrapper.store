const StoreController = () => import('#controllers/store.controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export const StoreRoute = router
  .group(function () {
    router.post('/shopify', [StoreController, 'shopify'])
    router.patch('/:id', [StoreController, 'update'])
    router.get('/paginate', [StoreController, 'paginate'])
    router.get('/:id', [StoreController, 'show'])
  })
  .prefix('store')
  .middleware(middleware.auth())
