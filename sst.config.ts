/// <reference path="./.sst/platform/config.d.ts" />

/**
 * SST v3 配置文件
 * 定义 Omni-Sentinel 的云基础设施资源
 */
export default $config({
  app(input) {
    return {
      name: "omni-sentinel",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          region: "us-east-1",
        },
      },
    };
  },
  async run() {
    // 敏感配置通过 SST Secret 管理
    const DATABASE_URL = new sst.Secret("DatabaseUrl");
    const DEEPSEEK_API_KEY = new sst.Secret("DeepseekApiKey");

    // Next.js 站点部署
    new sst.aws.Nextjs("Web", {
      path: "apps/web",
      link: [DATABASE_URL, DEEPSEEK_API_KEY],
      environment: {
        DATABASE_URL: DATABASE_URL.value,
        DEEPSEEK_API_KEY: DEEPSEEK_API_KEY.value,
      },
    });
  },
});
