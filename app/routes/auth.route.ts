const AuthController = () => import('#controllers/auth.controller')
import router from '@adonisjs/core/services/router'

export const AuthRoute = router
  .group(function () {
    router.post('/sign-up', [AuthController, 'signUp'])
    router.post('/sign-in', [AuthController, 'signIn'])

    router
      .group(function () {
        router.get('/', [AuthController, 'shopifyInstall'])
        router.get('/callback', [AuthController, 'shopifyCallback'])
      })
      .prefix('/shopify')
  })
  .prefix('auth')
