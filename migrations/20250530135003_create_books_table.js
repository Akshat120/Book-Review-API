/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable('books', (table) => {
        table.increments('id').primary();
        table.string('title', 255).notNullable();
        table.string('author', 255).notNullable();
        table.string('genre', 100);
        table.string('created_by').notNullable().references('id').inTable('users'); // Foreign key to users.id
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists('books'); // Drop table on rollback
}
