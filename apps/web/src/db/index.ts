import { neon } from '@neondatabase/serverless';
import { drizzle as drizzleHttp } from 'drizzle-orm/neon-http';
import * as schema from './schema';

/**
 * 数据库连接实例
 * 
 * 注意：此模块专为 Next.js 环境优化
 * - Edge Runtime：使用 Neon HTTP 驱动（无 Node.js 依赖）
 * - Node.js Runtime：同样使用 HTTP 驱动以保持一致性
 * 
 * 如需 TCP 连接（私有化部署），请使用 db-tcp.ts
 */

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn('[DB] DATABASE_URL is not set. Database-dependent features will fail.');
}

// 使用符合 neon() 校验规则的占位符格式防止初始化崩溃
// 只有在实际发起请求时，无效的逻辑才会触发连接错误
const sql = neon(databaseUrl || 'postgresql://placeholder:placeholder@localhost:5432/placeholder');

export const db = drizzleHttp(sql, { schema });
