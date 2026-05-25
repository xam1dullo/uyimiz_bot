import { sql } from 'drizzle-orm';
import postgres from 'postgres';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './schema/index';

export type DB = PostgresJsDatabase<typeof schema>;

let _client: postgres.Sql | undefined;
let _db: DB | undefined;

export function createClient(url?: string): DB {
  const connectionString = url ?? process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is required');
  }

  _client = postgres(connectionString, {
    max: 20,
    idle_timeout: 30,
    connect_timeout: 10,
  });

  _db = drizzle(_client, { schema });
  return _db;
}

export function getDb(): DB {
  if (!_db) {
    throw new Error('Database not initialized. Call createClient() first.');
  }
  return _db;
}

export async function closeClient(): Promise<void> {
  if (_client) {
    await _client.end();
    _client = undefined;
    _db = undefined;
  }
}

export async function withFamilyContext<T>(
  familyId: string,
  fn: (tx: DB) => Promise<T>,
  db?: DB,
): Promise<T> {
  const d = db ?? getDb();
  return d.transaction(async (tx) => {
    await tx.execute(
      sql`SELECT set_config('app.current_family_id', ${familyId}, true)`,
    );
    return fn(tx as unknown as DB);
  });
}
