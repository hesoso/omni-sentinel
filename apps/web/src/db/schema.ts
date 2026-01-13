import { pgTable, text, uuid, timestamp, jsonb, varchar, index } from 'drizzle-orm/pg-core';

export const logs = pgTable('logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: varchar('project_id', { length: 128 }).notNull(),
  message: text('message').notNull(),
  stackTrace: text('stack_trace'),
  level: varchar('level', { length: 16 }).default('error').notNull(),
  fingerprint: varchar('fingerprint', { length: 64 }), // 用于聚合相似错误
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return [
    index('project_id_idx').on(table.projectId),
    index('fingerprint_idx').on(table.fingerprint),
  ];
});

export type Log = typeof logs.$inferSelect;
export type NewLog = typeof logs.$inferInsert;
