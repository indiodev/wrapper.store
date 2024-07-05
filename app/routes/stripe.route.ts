const StripeController = () => import('#controllers/stripe.controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export const StripeRoute = router
  .group(function () {
    router.get('/charges', [StripeController, 'charges']).middleware(middleware.auth())
  })
  .prefix('stripe')
