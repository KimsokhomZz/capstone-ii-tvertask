import { KnexMysql2Adapter } from '@kottster/server';
import knex from 'knex';

/**
 * Learn more at https://knexjs.org/guide/#configuration-options
 */
const client = knex({
  client: 'mysql2',
  connection: {
    host: 'localhost',
    port: 3306,
    user: 'username',
    password: 'password',
    database: 'tvertask_db',
  },
});

export default new KnexMysql2Adapter(client);