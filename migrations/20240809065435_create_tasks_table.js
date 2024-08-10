
exports.up = function(knex) {
    return knex.schema.createTable('tasks', function(table) {
      table.increments('id');
      table.string('title').notNullable();
      table.text('description');
      table.timestamp('deleted_at').nullable();
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('tasks');
  };
  