import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'wrappers'
  // private provider = Object.values(Provider)

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('secret_key').notNullable().unique()
      table.string('public_key').notNullable().unique()
      table.string('hostname').nullable().unique()
      // table.enum('provider', this.provider).notNullable()

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
