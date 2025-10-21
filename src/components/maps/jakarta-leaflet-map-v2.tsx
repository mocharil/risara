"use client";

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface RegionData {
  region: string;
  value: number;
}

interface JakartaLeafletMapProps {
  data: RegionData[];
}

const REGION_COLORS: Record<string, { base: string; hover: string }> = {
  north: { base: '#84cc16', hover: '#65a30d' },
  west: { base: '#f97316', hover: '#ea580c' },
  central: { base: '#a855f7', hover: '#9333ea' },
  east: { base: '#92400e', hover: '#78350f' },
  south: { base: '#0ea5e9', hover: '#0284c7' },
  'thousand-islands': { base: '#14b8a6', hover: '#0d9488' }
};

// Jakarta regions GeoJSON with more accurate boundaries
const jakartaGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Jakarta Utara", id: "north" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [106.7300, -6.1200], [106.7450, -6.1050], [106.7650, -6.0980],
          [106.7850, -6.0950], [106.8100, -6.0920], [106.8350, -6.0900],
          [106.8600, -6.0920], [106.8850, -6.0950], [106.9100, -6.0980],
          [106.9350, -6.1020], [106.9500, -6.1080], [106.9600, -6.1150],
          [106.9550, -6.1250], [106.9450, -6.1350], [106.9300, -6.1450],
          [106.9100, -6.1500], [106.8850, -6.1550], [106.8600, -6.1580],
          [106.8350, -6.1600], [106.8100, -6.1580], [106.7850, -6.1550],
          [106.7600, -6.1500], [106.7400, -6.1400], [106.7300, -6.1200]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Jakarta Barat", id: "west" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [106.6800, -6.1200], [106.7300, -6.1200], [106.7400, -6.1400],
          [106.7600, -6.1500], [106.7850, -6.1550], [106.8100, -6.1580],
          [106.8200, -6.1650], [106.8250, -6.1750], [106.8300, -6.1850],
          [106.8250, -6.1950], [106.8150, -6.2050], [106.8000, -6.2120],
          [106.7800, -6.2180], [106.7600, -6.2200], [106.7350, -6.2180],
          [106.7100, -6.2120], [106.6900, -6.2050], [106.6750, -6.1950],
          [106.6700, -6.1850], [106.6750, -6.1750], [106.6750, -6.1650],
          [106.6750, -6.1550], [106.6700, -6.1450], [106.6750, -6.1350],
          [106.6800, -6.1200]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Jakarta Pusat", id: "central" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [106.7850, -6.1550], [106.8100, -6.1580], [106.8350, -6.1600],
          [106.8600, -6.1580], [106.8850, -6.1550], [106.9000, -6.1650],
          [106.9100, -6.1750], [106.9150, -6.1850], [106.9150, -6.1950],
          [106.9100, -6.2050], [106.9000, -6.2120], [106.8800, -6.2180],
          [106.8600, -6.2200], [106.8350, -6.2180], [106.8100, -6.2120],
          [106.7900, -6.2050], [106.7800, -6.1950], [106.7750, -6.1850],
          [106.7700, -6.1750], [106.7750, -6.1650], [106.7850, -6.1550]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Jakarta Timur", id: "east" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [106.8600, -6.1580], [106.8850, -6.1550], [106.9100, -6.1500],
          [106.9300, -6.1450], [106.9450, -6.1350], [106.9550, -6.1250],
          [106.9700, -6.1300], [106.9850, -6.1400], [107.0000, -6.1500],
          [107.0100, -6.1650], [107.0150, -6.1800], [107.0150, -6.1950],
          [107.0100, -6.2100], [107.0000, -6.2250], [106.9850, -6.2400],
          [106.9700, -6.2550], [106.9550, -6.2650], [106.9350, -6.2700],
          [106.9150, -6.2650], [106.9100, -6.2550], [106.9050, -6.2450],
          [106.9050, -6.2350], [106.9100, -6.2250], [106.9100, -6.2120],
          [106.9100, -6.2050], [106.9150, -6.1950], [106.9150, -6.1850],
          [106.9100, -6.1750], [106.9000, -6.1650], [106.8850, -6.1550],
          [106.8600, -6.1580]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Jakarta Selatan", id: "south" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [106.7350, -6.2180], [106.7600, -6.2200], [106.7800, -6.2180],
          [106.8000, -6.2120], [106.8150, -6.2050], [106.8250, -6.1950],
          [106.8300, -6.1850], [106.8400, -6.1900], [106.8550, -6.2000],
          [106.8700, -6.2100], [106.8850, -6.2200], [106.8950, -6.2300],
          [106.9000, -6.2450], [106.9000, -6.2600], [106.8950, -6.2750],
          [106.8850, -6.2900], [106.8700, -6.3050], [106.8550, -6.3150],
          [106.8350, -6.3250], [106.8150, -6.3350], [106.7950, -6.3400],
          [106.7750, -6.3450], [106.7550, -6.3450], [106.7350, -6.3400],
          [106.7150, -6.3300], [106.7000, -6.3150], [106.6900, -6.3000],
          [106.6850, -6.2850], [106.6850, -6.2700], [106.6900, -6.2550],
          [106.7000, -6.2400], [106.7100, -6.2300], [106.7200, -6.2240],
          [106.7350, -6.2180]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Kepulauan Seribu", id: "thousand-islands" },
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          // Pulau Pramuka cluster
          [[[106.6100, -5.7450], [106.6150, -5.7450], [106.6150, -5.7400], [106.6100, -5.7400], [106.6100, -5.7450]]],
          // Pulau Tidung cluster
          [[[106.5050, -5.7950], [106.5120, -5.7950], [106.5120, -5.7880], [106.5050, -5.7880], [106.5050, -5.7950]]],
          // Pulau Harapan cluster
          [[[106.6400, -5.6500], [106.6480, -5.6500], [106.6480, -5.6420], [106.6400, -5.6420], [106.6400, -5.6500]]],
          // Pulau Kelapa cluster
          [[[106.5500, -5.6200], [106.5580, -5.6200], [106.5580, -5.6120], [106.5500, -5.6120], [106.5500, -5.6200]]]
        ]
      }
    }
  ]
};

export const JakartaLeafletMapV2: React.FC<JakartaLeafletMapProps> = ({ data }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const getRegionValue = (regionName: string): number => {
    const region = data.find(r => r.region === regionName);
    return region ? region.value : 0;
  };

  const getRegionColor = (regionId: string, value: number): string => {
    const colors = REGION_COLORS[regionId] || REGION_COLORS.central;
    const maxValue = Math.max(...data.map(d => d.value));
    const opacity = value > 0 ? 0.5 + (value / maxValue) * 0.5 : 0.3;
    return colors.base;
  };

  useEffect(() => {
    // Only initialize if map doesn't exist and container is available
    if (!mapRef.current && mapContainerRef.current) {
      // Initialize map
      const map = L.map(mapContainerRef.current, {
        center: [-6.2088, 106.8456],
        zoom: 11,
        minZoom: 10,
        maxZoom: 15,
        zoomControl: true,
        scrollWheelZoom: true
      });

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      // Add GeoJSON layer
      L.geoJSON(jakartaGeoJSON as any, {
        style: (feature) => {
          const regionId = feature?.properties?.id || 'central';
          const regionName = feature?.properties?.name || '';
          const value = getRegionValue(regionName);
          return {
            fillColor: getRegionColor(regionId, value),
            fillOpacity: 0.7,
            color: 'white',
            weight: 2
          };
        },
        onEachFeature: (feature, layer) => {
          const regionName = feature.properties?.name || '';
          const regionId = feature.properties?.id || '';
          const value = getRegionValue(regionName);

          // Bind popup
          layer.bindPopup(`
            <div style="padding: 8px;">
              <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 4px;">${regionName}</h3>
              <p style="font-size: 14px; color: #666;">Urgent Issues: <strong>${value.toLocaleString()}</strong></p>
            </div>
          `);

          // Add hover effects
          layer.on({
            mouseover: (e) => {
              const target = e.target;
              target.setStyle({
                fillColor: REGION_COLORS[regionId]?.hover || REGION_COLORS.central.hover,
                fillOpacity: 0.9,
                weight: 3
              });
              setHoveredRegion(regionName);
            },
            mouseout: (e) => {
              const target = e.target;
              target.setStyle({
                fillColor: getRegionColor(regionId, value),
                fillOpacity: 0.7,
                weight: 2
              });
              setHoveredRegion(null);
            }
          });
        }
      }).addTo(map);

      mapRef.current = map;
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Empty dependency array - only run once

  return (
    <div className="w-full h-full relative">
      <div
        ref={mapContainerRef}
        style={{
          height: '100%',
          width: '100%',
          borderRadius: '0.75rem',
          position: 'relative',
          zIndex: 0
        }}
      />

      {/* Statistics overlay */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200 max-w-[240px] z-[1000]">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900">Statistics</h4>
          <span className="text-sm text-gray-500">
            {data.reduce((sum, item) => sum + item.value, 0).toLocaleString()} total
          </span>
        </div>
        <div className="space-y-2">
          {data.map((item, index) => {
            const regionId = Object.keys(REGION_COLORS).find(
              key => jakartaGeoJSON.features.find(
                f => f.properties?.name === item.region && f.properties?.id === key
              )
            );
            const isHovered = hoveredRegion === item.region;

            return (
              <div
                key={index}
                className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                  isHovered ? 'bg-gray-100' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: regionId ? REGION_COLORS[regionId].base : '#CBD5E1'
                    }}
                  />
                  <span className="text-sm text-gray-700">{item.region}</span>
                </div>
                <span className="font-medium text-gray-900">{item.value.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JakartaLeafletMapV2;
