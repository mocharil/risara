// src/app/(dashboard)/analytics/page.tsx
'use client';

import dynamic from 'next/dynamic';

const TikTokAnalytics = dynamic(
  () => import('@/components/analytics/tiktok-analytics').then(mod => mod.TikTokAnalytics),
  { ssr: false }
);

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Government Social Media Analytics</h1>
      </div>
      <TikTokAnalytics />
    </div>
  );
}