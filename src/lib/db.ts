import { Client } from 'pg';

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '7977267852632',
  database: 'dosqfm',
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch((err) => console.error('Database connection error', err.stack));

export default client;
