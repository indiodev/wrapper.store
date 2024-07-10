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
import '#routes/dashboard.route'
import '#routes/product.route'
import '#routes/shopify.route'
import '#routes/store.route'
import '#routes/stripe.route'
import '#routes/user.route'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})
