import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { db } from '@/db';
import { logs } from '@/db/schema';

// 启用 Edge Runtime 以实现超低延迟
export const runtime = 'edge';

/**
 * CORS 响应头配置
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
};

/**
 * Ingestion Payload Schema
 */
const IngestionSchema = z.object({
  project_id: z.string().min(1, "project_id is required"),
  message: z.string(),
  stack_trace: z.string().optional(),
  level: z.enum(['debug', 'info', 'warning', 'error', 'fatal']).default('error'),
  metadata: z.record(z.string(), z.any()).optional(),
  timestamp: z.string().datetime().optional(),
});

/**
 * 计算错误指纹 (SHA-256)
 */
async function generateFingerprint(message: string, stackTrace?: string): Promise<string> {
  const data = `${message}|${stackTrace ?? ''}`;
  const msgUint8 = new TextEncoder().encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * 处理 OPTIONS 预检请求
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(req: NextRequest) {
  try {
    // 1. 安全校验: API Key Check
    const apiKey = req.headers.get('x-api-key');
    if (apiKey !== process.env.INGESTION_API_KEY) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: corsHeaders }
      );
    }

    const body = await req.json();
    
    // 2. 数据合规性校验
    const validation = IngestionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Bad Request", details: validation.error.format() }, 
        { status: 400, headers: corsHeaders }
      );
    }

    const rawData = validation.data;

    // 3. 异步流程: 指纹计算 -> 数据库插入
    // 注意: 在 Edge Runtime 中直执行 async IIFE
    (async () => {
      try {
        const fingerprint = await generateFingerprint(rawData.message, rawData.stack_trace);
        
        await db.insert(logs).values({
          projectId: rawData.project_id,
          message: rawData.message,
          stackTrace: rawData.stack_trace,
          level: rawData.level,
          fingerprint: fingerprint,
          metadata: rawData.metadata,
          createdAt: rawData.timestamp ? new Date(rawData.timestamp) : new Date(),
        });
        
        console.log(`[Ingestion] Event stored. Fingerprint: ${fingerprint.substring(0, 8)}`);
        
        // 触发看板数据重验证
        // @ts-ignore - Next.js revalidateTag type mismatch in some environments
        revalidateTag('logs');
      } catch (err) {
        console.error('[Ingestion] Background processing error:', err);
      }
    })();

    // 4. 202 Strategy: 接收即响应
    return new NextResponse(null, {
      status: 202,
      statusText: 'Accepted',
      headers: corsHeaders,
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500, headers: corsHeaders }
    );
  }
}
