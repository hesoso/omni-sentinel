import { db } from "../db";
import { logs } from "../db/schema";
import crypto from "node:crypto";

/**
 * 生成简单的 SHA-256 指纹
 */
async function generateFingerprint(message: string, stackTrace: string): Promise<string> {
  const data = `${message}:${stackTrace}`;
  const hash = crypto.createHash('sha256').update(data).digest('hex');
  return hash;
}

const PROJECTS = ["web-app-v3", "ios-mobile-client", "api-gateway-prod", "auth-service"];
const LEVELS = ["info", "warning", "error"] as const;

const ERROR_SAMPLES = [
  {
    message: "TimeoutError: Request to /api/users exceeded 5000ms",
    stackTrace: "Error: TimeoutError\n    at fetchData (api.js:12:4)\n    at Object.onLoad (main.js:45:10)"
  },
  {
    message: "DatabaseConnectionError: Failed to connect to Neon Postgres",
    stackTrace: "NeonDbError: Connection timed out\n    at Pool.connect (client.js:89:12)\n    at async initializeDb (db.js:5:1)"
  },
  {
    message: "AuthFailed: Invalid JWT token signature",
    stackTrace: "JsonWebTokenError: invalid signature\n    at verify (jwt.js:15:3)\n    at authMiddleware (auth.ts:22:9)"
  },
  {
    message: "AI_HALLUCINATION: Safety filters triggered for generated response",
    stackTrace: "SafetyError: block_reason_safety\n    at AIService.generate (ai.ts:45:2)\n    at async handleRequest (route.ts:12:1)"
  },
  {
    message: "EDGE_LATENCY_SPIKE: High cold start time detected in Tokyo region",
    stackTrace: "PerformanceWarning: cold_start_delay > 2000ms\n    at measure (edge-runtime.js:1:1)"
  }
];

async function seed() {
  console.log("🌱 Starting log seeding...");

  if (!process.env.DATABASE_URL) {
    console.warn("⚠️  DATABASE_URL is not set. Real persistence is disabled.");
    console.log("\n💡 DASHBOARD PREVIEW TIP:");
    console.log("------------------------------------------------------------------");
    console.log("I've enabled 'Demo Mode' in the Dashboard. You don't need a real");
    console.log("database to see the UI. Just refresh http://localhost:3000/dashboard");
    console.log("------------------------------------------------------------------\n");
    console.info("If you want to use this seeder, please add DATABASE_URL to your .env");
    process.exit(0); // 正常退出，不再抛错
  }

  const entriesToInsert = [];

  for (let i = 0; i < 20; i++) {
    const sample = ERROR_SAMPLES[Math.floor(Math.random() * ERROR_SAMPLES.length)];
    const projectId = PROJECTS[Math.floor(Math.random() * PROJECTS.length)];
    const level = LEVELS[Math.floor(Math.random() * LEVELS.length)];
    
    // 生成一些微小的差异，模拟不同的发生次数
    const messageSuffix = Math.random() > 0.7 ? ` [Retry-${Math.floor(Math.random() * 5)}]` : "";
    const finalMessage = sample.message + messageSuffix;
    
    const fingerprint = await generateFingerprint(sample.message, sample.stackTrace);

    entriesToInsert.push({
      projectId,
      message: finalMessage,
      stackTrace: sample.stackTrace,
      level,
      fingerprint,
      metadata: {
        browser: "Chrome 120",
        os: "macOS Sonoma",
        region: "us-east-1"
      }
    });
  }

  try {
    console.log(`🚀 Inserting ${entriesToInsert.length} log entries into the database...`);
    await db.insert(logs).values(entriesToInsert);
    console.log("✅ Seeding completed successfully!");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    process.exit(0);
  }
}

seed();
