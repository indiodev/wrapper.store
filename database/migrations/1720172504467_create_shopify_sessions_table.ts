import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'shopify_sessions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').notNullable()
      table.string('shop').notNullable()
      table.string('state').notNullable()
      table.string('scope').notNullable()
      table.string('access_token').notNullable()
      table.boolean('is_online').defaultTo(false)
      table.string('expires').nullable()

      table
        .integer('store_id')
        .unsigned()
        .references('id')
        .inTable('stores')
        .onDelete('CASCADE')
        .notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
