import { Provider } from '#util/enum'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'
  private provider: string[] = Object.keys(Provider)

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.text('description').notNullable()
      table.float('amount').notNullable()
      table.integer('quantity').notNullable()
      table.string('photo').notNullable()
      table.enum('provider', this.provider).notNullable()

      table.string('stripe_product_id').nullable()
      table.string('shopify_product_id').nullable()

      table
        .integer('user_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table
        .integer('wrapper_id')
        .nullable()
        .unsigned()
        .references('id')
        .inTable('wrappers')
        .onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
