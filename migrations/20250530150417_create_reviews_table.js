/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable('reviews', (table) => {
        table.increments('id').primary();
        table.string('book_id').notNullable();
        table.string('user_id').notNullable();
        table.integer('rating').notNullable();
        table.string('description');
        
        table.foreign('book_id').references('id').inTable('books');
        table.foreign('user_id').references('id').inTable('users');
    
        table.unique(['book_id', 'user_id']);
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    return knex.schema.dropTableIfExists('reviews');
}
