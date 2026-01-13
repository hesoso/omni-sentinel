import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

/**
 * TCP 数据库连接（用于私有化部署）
 * 
 * 此模块使用标准 PostgreSQL TCP 驱动，适用于：
 * - Docker 容器内连接本地/远程 PostgreSQL
 * - 非 Serverless 环境的传统部署
 * 
 * 注意：不兼容 Next.js Edge Runtime
 */

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('[DB-TCP] DATABASE_URL is required for TCP connection');
}

const pool = new Pool({
  connectionString: databaseUrl,
  max: 10,
  idleTimeoutMillis: 30000,
});

export const db = drizzle(pool, { schema });
