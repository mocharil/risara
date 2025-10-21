// src/app/(dashboard)/network-analysis/page.tsx
'use client';

import dynamic from 'next/dynamic';
import { Share2 } from 'lucide-react';

// Dynamically import NetworkAnalysis to avoid SSR issues
const NetworkAnalysis = dynamic(
  () => import('@/components/analytics/network-analysis').then(mod => ({ default: mod.NetworkAnalysis })),
  { ssr: false }
);

export default function NetworkAnalysisPage() {
  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Share2 className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Network Analysis</h1>
          <p className="text-sm text-gray-600">Social network relationships and influencer mapping</p>
        </div>
      </div>

      {/* Network Analysis Component */}
      <NetworkAnalysis data={null} />
    </div>
  );
}
