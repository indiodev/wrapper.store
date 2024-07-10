const StripeController = () => import('#controllers/stripe.controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export const StripeRoute = router
  .group(function () {
    router.get('charges', [StripeController, 'charges'])
    router.post('credential', [StripeController, 'credential'])
    router.post('/create-product', [StripeController, 'createProduct'])
  })
  .prefix('stripe')
  .middleware(middleware.auth())
