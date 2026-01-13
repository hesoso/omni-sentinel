"use client";

import { useState, useEffect } from "react";
import { AIAssistant } from "./AIAssistant";

interface AIAssistantWrapperProps {
  selectedLog?: any;
}

export function AIAssistantWrapper({ selectedLog }: AIAssistantWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);

  // 当有新日志选中时自动展开
  useEffect(() => {
    if (selectedLog) {
      setIsOpen(true);
    }
  }, [selectedLog?.id]);

  return (
    <AIAssistant 
      selectedLog={selectedLog} 
      isOpen={isOpen} 
      onToggle={() => setIsOpen(!isOpen)} 
    />
  );
}
