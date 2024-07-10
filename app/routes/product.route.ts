const ProductController = () => import('#controllers/product.controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export const ProductRoute = router
  .group(function () {
    router
      .group(function () {
        router.post('/shopify', [ProductController, 'shopify'])
        router.get('/paginate', [ProductController, 'paginate'])
      })
      .middleware(middleware.auth())

    router
      .group(function () {
        router.get('/checkout', [ProductController, 'checkout'])
        router.get('/', [ProductController, 'show'])
      })
      .prefix('/:id')
  })
  .prefix('product')
