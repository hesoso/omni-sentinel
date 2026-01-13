import { db } from "@/db";
import { logs } from "@/db/schema";
import { desc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

const MOCK_LOGS = [
  {
    id: "mock-1",
    projectId: "web-app-v3",
    message: "TimeoutError: Request to /api/users exceeded 5000ms",
    level: "error",
    fingerprint: "e10adc39",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
  },
  {
    id: "mock-2",
    projectId: "api-gateway",
    message: "AuthFailed: Invalid JWT token signature detected",
    level: "error",
    fingerprint: "827ccb0e",
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(), // 12 mins ago
  },
  {
    id: "mock-3",
    projectId: "ios-client",
    message: "PerformanceWarning: EDGE_LATENCY_SPIKE in Tokyo (2400ms)",
    level: "warning",
    fingerprint: "05664432",
    createdAt: new Date(Date.now() - 1000 * 3600).toISOString(), // 1 hour ago
  },
  {
    id: "mock-4",
    projectId: "web-app-v3",
    message: "AI_HALLUCINATION: Safety filters triggered for prompt #412",
    level: "info",
    fingerprint: "fcea920f",
    createdAt: new Date(Date.now() - 1000 * 86400).toISOString(), // 1 day ago
  },
];

/**
 * 获取最近的错误日志
 * 该逻辑仅在服务端执行 (RSC)
 * 封装了 Next.js Cache 标签支持实时重验证
 */
export const getRecentLogs = unstable_cache(
  async (limit = 10) => {
    // 如果没有 DATABASE_URL，进入演示模式返回 MOCK 数据
    if (!process.env.DATABASE_URL) {
      console.warn("[Data] DATABASE_URL is missing. Entering DEMO MODE with mock data.");
      return MOCK_LOGS.slice(0, limit) as any[];
    }

    try {
      const result = await db.query.logs.findMany({
        orderBy: [desc(logs.createdAt)],
        limit: limit,
      });
      
      return result;
    } catch (error) {
      // 捕获 NeonDbError 或 fetch 错误
      console.error("[Data] Database query failed:", error instanceof Error ? error.message : error);
      return [];
    }
  },
  ["recent-logs"], // Key parts
  { tags: ["logs"] } // Cache tags for revalidation
);

/**
 * 根据 ID 获取单条日志
 */
export const getLogById = unstable_cache(
  async (id: string) => {
    if (!process.env.DATABASE_URL) {
      return MOCK_LOGS.find(l => l.id === id) as any;
    }

    try {
      const result = await db.query.logs.findFirst({
        where: (logs, { eq }) => eq(logs.id, id),
      });
      return result;
    } catch (error) {
      console.error("[Data] Fetch log by id failed:", error);
      return null;
    }
  },
  ["log-by-id"],
  { tags: ["logs"] }
);

/**
 * 获取监控统计简报
 */
export async function getDashboardStats() {
  try {
    // 此处后续可扩展为真实的聚合查询
    return {
      totalEvents: "1.2M",
      errorRate: "0.04%",
      activeProjects: 12,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    return null;
  }
}

/**
 * 分页查询日志
 * @param page - 页码（从 1 开始）
 * @param limit - 每页条数（默认 100）
 */
export const getLogsWithPagination = unstable_cache(
  async (page: number = 1, limit: number = 100) => {
    const offset = (page - 1) * limit;

    // Demo Mode
    if (!process.env.DATABASE_URL) {
      console.warn("[Data] DEMO MODE: Returning mock paginated data");
      return {
        logs: MOCK_LOGS.slice(offset, offset + limit),
        total: MOCK_LOGS.length,
        page,
        limit,
        totalPages: Math.ceil(MOCK_LOGS.length / limit),
      };
    }

    try {
      const result = await db.query.logs.findMany({
        orderBy: [desc(logs.createdAt)],
        limit: limit,
        offset: offset,
      });

      // 简化的总数估算（实际应使用 COUNT 查询）
      const total = result.length === limit ? limit * page + 1 : offset + result.length;

      return {
        logs: result,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error("[Data] Paginated query failed:", error);
      return { logs: [], total: 0, page, limit, totalPages: 0 };
    }
  },
  ["logs-paginated"],
  { tags: ["logs"] }
);

/**
 * 获取日志统计信息
 */
export async function getLogStats() {
  if (!process.env.DATABASE_URL) {
    return {
      totalLogs: MOCK_LOGS.length,
      errorCount: MOCK_LOGS.filter(l => l.level === "error").length,
      lastLogTime: MOCK_LOGS[0]?.createdAt || null,
    };
  }

  try {
    const allLogs = await db.query.logs.findMany({
      orderBy: [desc(logs.createdAt)],
      limit: 1000, // 采样统计
    });

    return {
      totalLogs: allLogs.length,
      errorCount: allLogs.filter(l => l.level === "error").length,
      lastLogTime: allLogs[0]?.createdAt || null,
    };
  } catch (error) {
    console.error("[Data] Stats query failed:", error);
    return { totalLogs: 0, errorCount: 0, lastLogTime: null };
  }
}

/**
 * 获取唯一的 Project ID 列表
 */
export async function getDistinctProjectIds(): Promise<string[]> {
  if (!process.env.DATABASE_URL) {
    return [...new Set(MOCK_LOGS.map(l => l.projectId))];
  }

  try {
    const allLogs = await db.query.logs.findMany({
      columns: { projectId: true },
    });
    return [...new Set(allLogs.map(l => l.projectId))];
  } catch (error) {
    console.error("[Data] Distinct project IDs query failed:", error);
    return [];
  }
}
