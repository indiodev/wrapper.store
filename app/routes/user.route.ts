const UserController = () => import('#controllers/user.controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export const UserRoute = router
  .group(function () {
    router.get('/', [UserController, 'profile'])
    router.patch('/', [UserController, 'update'])
  })
  .prefix('user')
  .middleware(middleware.auth())
