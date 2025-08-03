import 'dotenv/config';

import { PrismaClient } from 'generated/prisma';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';

const prisma = new PrismaClient();

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }
  
  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set('schema', schemaId);
  
  return url.toString();
}

const schemaId = randomUUID();

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId);

  process.env.DATABASE_URL = databaseURL;

  // Use db push instead of migrations for e2e tests
  // This creates the schema and tables based on the current schema.prisma
  execSync('pnpm prisma db push', { stdio: "inherit" });
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});
