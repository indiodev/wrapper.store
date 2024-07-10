import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'shopify_credential'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('secret_key').nullable().unique()
      table.string('client_id').nullable().unique()

      table
        .integer('user_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
