
exports.up = function(knex, Promise) {
    console.log('creating comments table...');
    return knex.schema.createTable('comments', (articlesTable) => {
      articlesTable.increments('comment_id').primary();
      articlesTable.string('author').references('users.username');
      articlesTable.integer('article_id').references('articles.article_id');
      articlesTable.integer('votes').defaultTo(0);
      articlesTable.string('body').notNullable();
      articlesTable.date('created_at');
    });
};

exports.down = function(knex, Promise) {
    console.log('removing comments tables...');
    return knex.schema.dropTable('comments');
};