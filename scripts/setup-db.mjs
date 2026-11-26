// Creates the tables and loads the sample meetings into the Neon database.
//
//   npm run db:setup          → schema + sample data (replaces existing rows)
//   npm run db:setup -- --schema-only
//
// Reads DATABASE_URL from .env.local (see the db:setup script in package.json).
import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Add it to .env.local first.');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const files = process.argv.includes('--schema-only')
  ? ['db/schema.sql']
  : ['db/schema.sql', 'db/seed.sql'];

// Neon's HTTP driver runs one statement per query, so split each file on the
// semicolons that end a line. (Our SQL files never put ';' at the end of a
// line inside a string.)
function statements(text) {
  return text
    .split('\n')
    .filter((line) => !line.trimStart().startsWith('--'))
    .join('\n')
    .split(/;\s*$/m)
    .map((s) => s.trim())
    .filter(Boolean);
}

for (const file of files) {
  const queries = statements(await readFile(file, 'utf8')).map((s) => sql.query(s));
  // One transaction per file, so a failed seed doesn't leave half the rows.
  await sql.transaction(queries);
  console.log(`✓ ${file} (${queries.length} statements)`);
}
