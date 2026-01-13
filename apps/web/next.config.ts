import type { NextConfig } from "next";

// 构建目标检测：desktop 模式使用静态导出
const isDesktopBuild = process.env.BUILD_TARGET === 'desktop';

const nextConfig: NextConfig = {
  // 双模式构建：
  // - standalone: Docker 容器化部署
  // - export: Tauri 桌面端静态资源
  output: isDesktopBuild ? "export" : "standalone",
  
  // SSG 模式禁用图片优化（静态导出限制）
  images: isDesktopBuild ? {
    unoptimized: true,
  } : undefined,
  
  experimental: {
    // 优化服务端打包
    serverMinification: true,
  },
};

export default nextConfig;
