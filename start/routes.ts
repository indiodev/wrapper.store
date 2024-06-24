/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

import '#routes/auth.route'
import '#routes/product.route'
import '#routes/user.route'
import '#routes/wrapper.route'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})
