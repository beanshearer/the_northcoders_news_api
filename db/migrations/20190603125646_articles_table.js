
exports.up = function(knex, Promise) {
    ('creating articles table...');
    return knex.schema.createTable('articles', (articlesTable) => {
      articlesTable.increments('article_id').primary();
      articlesTable.string('title').notNullable();
      articlesTable.integer('votes').defaultTo(0);
      articlesTable.string('topic').references('topics.slug').notNullable();
      articlesTable.string('author').references('users.username').notNullable();
      articlesTable.timestamp('created_at').defaultTo(knex.fn.now());
      articlesTable.text('body').notNullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('articles');
};