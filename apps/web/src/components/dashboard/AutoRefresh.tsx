"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AutoRefresh({ interval = 10000 }: { interval?: number }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      // router.refresh() 仅请求服务器重新呈现服务器组件，
      // 而不刷新页面，从而保留滚动位置等客户端状态。
      router.refresh();
    }, interval);

    return () => clearInterval(timer);
  }, [router, interval]);

  return null; // 隐形组件
}
