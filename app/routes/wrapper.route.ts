const WrapperController = () => import('#controllers/wrapper.controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export const WrapperRoute = router
  .group(function () {
    router.post('/shopify', [WrapperController, 'shopify'])
    router.patch('/:id', [WrapperController, 'update'])
    router.get('/paginate', [WrapperController, 'paginate'])
    router.get('/:id', [WrapperController, 'show'])
  })
  .prefix('wrapper')
  .middleware(middleware.auth())
