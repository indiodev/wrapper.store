const DashboardController = () => import('#controllers/dashboard.controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export const DashboardRoute = router
  .group(function () {
    router.get('/', [DashboardController, 'index'])
  })
  .prefix('dashboard')
  .middleware(middleware.auth())
