import { KnexMysql2Adapter } from '@kottster/server';
import knex from 'knex';

/**
 * Learn more at https://knexjs.org/guide/#configuration-options
 */
const client = knex({
  client: "mysql2",
  connection: process.env.DATABASE_CONNECTION,
});

export default new KnexMysql2Adapter(client);