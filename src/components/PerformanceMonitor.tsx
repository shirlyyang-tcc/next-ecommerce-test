'use client';

import { useEffect } from 'react';

const PerformanceMonitor: React.FC = () => {
  useEffect(() => {
    // 监控页面加载性能
    if (typeof window !== 'undefined' && 'performance' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            
            // 记录关键性能指标
            const metrics = {
              // DNS 查询时间
              dnsTime: navEntry.domainLookupEnd - navEntry.domainLookupStart,
              // TCP 连接时间
              tcpTime: navEntry.connectEnd - navEntry.connectStart,
              // 首字节时间
              ttfb: navEntry.responseStart - navEntry.requestStart,
              // DOM 内容加载时间
              domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.fetchStart,
              // 页面完全加载时间
              loadTime: navEntry.loadEventEnd - navEntry.fetchStart,
              // 首次内容绘制
              fcp: 0, // 需要 PerformanceObserver 监听 'paint' 事件
              // 最大内容绘制
              lcp: 0, // 需要 PerformanceObserver 监听 'largest-contentful-paint' 事件
            };

            // 在开发环境中输出性能指标
            if (process.env.NODE_ENV === 'development') {
              console.log('Performance Metrics:', metrics);
            }

            // 可以在这里发送性能数据到分析服务
            // sendToAnalytics(metrics);
          }
        }
      });

      // 监听导航事件
      observer.observe({ entryTypes: ['navigation'] });

      // 监听绘制事件（FCP）
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            if (process.env.NODE_ENV === 'development') {
              console.log('FCP:', entry.startTime);
            }
          }
        }
      });

      paintObserver.observe({ entryTypes: ['paint'] });

      // 监听最大内容绘制（LCP）
      const lcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (process.env.NODE_ENV === 'development') {
            console.log('LCP:', entry.startTime);
          }
        }
      });

      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      return () => {
        observer.disconnect();
        paintObserver.disconnect();
        lcpObserver.disconnect();
      };
    }
  }, []);

  return null; // 这个组件不渲染任何内容
};

export default PerformanceMonitor; 