"use client";

import { useEffect, useState } from 'react';

interface PerformanceMonitorProps {
  pageName: string;
  enabled?: boolean;
}

export default function PerformanceMonitor({ pageName, enabled = false }: PerformanceMonitorProps) {
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const startTime = performance.now();
    
    const handleLoad = () => {
      const endTime = performance.now();
      const loadTimeMs = endTime - startTime;
      setLoadTime(loadTimeMs);
      
      // Log performance data
      console.log(`🚀 ${pageName} loaded in ${loadTimeMs.toFixed(2)}ms`);
      
      // Show performance indicator for 3 seconds
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 3000);
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(handleLoad);

    return () => {
      // Cleanup if component unmounts before load completes
    };
  }, [pageName, enabled]);

  if (!enabled || !isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-green-600 text-white px-3 py-2 rounded-lg shadow-lg z-50 text-sm">
      <div className="flex items-center space-x-2">
        <span>⚡</span>
        <span>{pageName}: {loadTime?.toFixed(0)}ms</span>
      </div>
    </div>
  );
}
