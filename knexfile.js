export default {
    development: {
      client: 'sqlite3',
      connection: {
        filename: './books.db',
      },
      useNullAsDefault: true,
      migrations: {
        directory: './migrations',
      },
      pool: {
        afterCreate: (conn, cb) => {
          conn.run('PRAGMA foreign_keys = ON', cb); // Enable foreign keys
        },
      },
    },
  };
