const ProductController = () => import('#controllers/product.controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export const ProductRoute = router
  .group(function () {
    router.post('/shopify', [ProductController, 'shopify'])
    router.post('/stripe', [ProductController, 'stripe'])
    router.get('/paginate', [ProductController, 'paginate'])
    router.get('/:id', [ProductController, 'show'])
  })
  .prefix('product')
  .middleware(middleware.auth())
