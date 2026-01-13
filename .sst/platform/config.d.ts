// SST v3 类型定义（占位）
// 运行 `npx sst dev` 或 `npx sst deploy` 后会自动生成完整类型

declare global {
  function $config(config: {
    app: (input?: { stage?: string }) => {
      name: string;
      removal?: "remove" | "retain";
      home: "aws" | "cloudflare" | "local";
      providers?: Record<string, any>;
    };
    run: () => Promise<void>;
  }): any;

  namespace sst {
    class Secret {
      constructor(name: string);
      value: string;
    }
    namespace aws {
      class Nextjs {
        constructor(name: string, props: {
          path: string;
          link?: any[];
          environment?: Record<string, string>;
        });
      }
    }
  }
}

export {};
