// src/components/unified-monitoring/regional-map.tsx
'use client';

import { Card } from "@/components/ui/card";
import dynamic from 'next/dynamic';
import { Building2 } from "lucide-react";

// Dynamically import Leaflet map to avoid SSR issues
const JakartaLeafletMap = dynamic(
  () => import('@/components/maps/jakarta-leaflet-map-v2'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Loading map...</p>
        </div>
      </div>
    )
  }
);

interface RegionalMapProps {
  data: Array<{
    region: string;
    count: number;
  }>;
  isLoading?: boolean;
}

export function RegionalMap({ data, isLoading }: RegionalMapProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-[450px]">
          <div className="animate-pulse text-gray-500">Loading map...</div>
        </div>
      </Card>
    );
  }

  // Transform data to match JakartaMap interface
  const mapData = data.map(item => ({
    region: item.region,
    value: item.count
  }));

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-white">
      <div className="mb-3 flex items-center gap-2">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Building2 className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Regional Distribution Map</h3>
          <p className="text-sm text-gray-500">Interactive map showing urgent issues by region</p>
        </div>
      </div>
      <div className="h-[450px] relative bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
        <JakartaLeafletMap data={mapData} />
      </div>
    </Card>
  );
}
