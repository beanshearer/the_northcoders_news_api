
exports.up = function(knex, Promise) {
    console.log('creating users table...');
    return knex.schema.createTable('users', (userTable) => {
      userTable.string('username').primary().unique();
      userTable.string('avatar_url').notNullable();
      userTable.string('name').notNullable();
    });
};

exports.down = function(knex, Promise) {
    console.log('removing users tables...');
    return knex.schema.dropTable('users');
};
