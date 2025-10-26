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

// Map region names from data API to GeoJSON property names
const REGION_NAME_MAPPING: Record<string, string> = {
  'Jakarta Selatan': 'south',
  'Jakarta Barat': 'west',
  'Jakarta Utara': 'north',
  'Jakarta Timur': 'east',
  'Jakarta Pusat': 'central',
  'Kepulauan Seribu': 'thousand-islands',
  'Kota Jakarta Selatan': 'south',
  'Kota Jakarta Barat': 'west',
  'Kota Jakarta Utara': 'north',
  'Kota Jakarta Timur': 'east',
  'Kota Jakarta Pusat': 'central',
};

const REGION_COLORS: Record<string, { base: string; hover: string }> = {
  north: { base: '#84cc16', hover: '#65a30d' },
  west: { base: '#f97316', hover: '#ea580c' },
  central: { base: '#a855f7', hover: '#9333ea' },
  east: { base: '#92400e', hover: '#78350f' },
  south: { base: '#0ea5e9', hover: '#0284c7' },
  'thousand-islands': { base: '#14b8a6', hover: '#0d9488' }
};

// GeoJSON will be loaded dynamically from /jakarta.geojson
// This contains accurate administrative boundaries from https://github.com/thetrisatria/geojson-indonesia

export const JakartaLeafletMapV2: React.FC<JakartaLeafletMapProps> = ({ data }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [geoJSON, setGeoJSON] = useState<GeoJSON.FeatureCollection | null>(null);

  // Fetch actual Jakarta GeoJSON data
  useEffect(() => {
    fetch('/jakarta.geojson')
      .then(res => res.json())
      .then(data => setGeoJSON(data))
      .catch(err => console.error('Failed to load Jakarta GeoJSON:', err));
  }, []);

  const getRegionValue = (regionName: string): number => {
    // Try direct match first
    let region = data.find(r => r.region === regionName);
    if (region) return region.value;

    // Try mapping match (e.g., "Kota Jakarta Selatan" -> "Jakarta Selatan")
    for (const [key, value] of Object.entries(REGION_NAME_MAPPING)) {
      if (regionName.includes(key) || key.includes(regionName)) {
        region = data.find(r => REGION_NAME_MAPPING[r.region] === value || r.region === key);
        if (region) return region.value;
      }
    }

    return 0;
  };

  const getRegionColor = (regionId: string, value: number): string => {
    // Use heat map colors based on data intensity
    const maxValue = Math.max(...data.map(d => d.value), 1);
    const minValue = Math.min(...data.map(d => d.value));
    const normalizedValue = maxValue > minValue ? (value - minValue) / (maxValue - minValue) : 0.5;

    // Color scale from light to dark based on data density
    // Low: light yellow/green, Medium: orange, High: red/dark red
    if (normalizedValue < 0.25) {
      return '#fef3c7'; // Very light yellow
    } else if (normalizedValue < 0.5) {
      return '#fcd34d'; // Yellow
    } else if (normalizedValue < 0.75) {
      return '#fb923c'; // Orange
    } else {
      return '#dc2626'; // Red (highest density)
    }
  };

  useEffect(() => {
    // Only initialize if map doesn't exist, container is available, and geoJSON is loaded
    if (!mapRef.current && mapContainerRef.current && geoJSON) {
      // Initialize map centered on Jakarta with better view
      const map = L.map(mapContainerRef.current, {
        center: [-6.2088, 106.8456], // Jakarta center
        zoom: 11,
        minZoom: 10,
        maxZoom: 16,
        zoomControl: true,
        scrollWheelZoom: true,
        preferCanvas: false
      });

      // Add CartoDB Positron tile layer for cleaner, more modern look
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      // Add GeoJSON layer with fetched data
      L.geoJSON(geoJSON as any, {
        style: (feature) => {
          const regionName = feature?.properties?.name || '';
          // Find region ID from GeoJSON properties or name mapping
          const regionId = feature?.properties?.id ||
            REGION_NAME_MAPPING[regionName] ||
            'central';
          const value = getRegionValue(regionName);
          return {
            fillColor: getRegionColor(regionId, value),
            fillOpacity: 0.75,
            color: '#ffffff',
            weight: 2,
            opacity: 1,
            dashArray: '0'
          };
        },
        onEachFeature: (feature, layer) => {
          const regionName = feature.properties?.name || '';
          const regionId = feature.properties?.id || '';
          const value = getRegionValue(regionName);
          const totalValue = data.reduce((sum, item) => sum + item.value, 0);
          const percentage = totalValue > 0 ? ((value / totalValue) * 100).toFixed(1) : '0';

          // Bind enhanced popup with more information
          layer.bindPopup(`
            <div style="padding: 12px; min-width: 200px;">
              <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 8px; color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 4px;">
                ${regionName}
              </h3>
              <div style="margin-bottom: 6px;">
                <p style="font-size: 13px; color: #6b7280; margin-bottom: 4px;">Urgent Issues</p>
                <p style="font-size: 20px; font-weight: bold; color: #dc2626;">${value.toLocaleString()}</p>
              </div>
              <div style="background: #f9fafb; padding: 8px; border-radius: 6px; margin-top: 8px;">
                <p style="font-size: 12px; color: #6b7280; margin: 0;">
                  <strong>${percentage}%</strong> of total issues
                </p>
              </div>
              <p style="font-size: 11px; color: #9ca3af; margin-top: 8px; font-style: italic;">
                Click region to zoom
              </p>
            </div>
          `);

          // Add hover effects with darker shade
          layer.on({
            mouseover: (e) => {
              const target = e.target;
              const baseColor = getRegionColor(regionId, value);
              target.setStyle({
                fillColor: baseColor,
                fillOpacity: 0.95,
                weight: 4,
                color: '#1f2937', // Darker border on hover
                dashArray: ''
              });
              target.bringToFront();
              setHoveredRegion(regionName);
            },
            mouseout: (e) => {
              const target = e.target;
              target.setStyle({
                fillColor: getRegionColor(regionId, value),
                fillOpacity: 0.75,
                weight: 2,
                color: '#ffffff'
              });
              setHoveredRegion(null);
            },
            click: (e) => {
              map.fitBounds(e.target.getBounds(), { padding: [50, 50] });
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
  }, [geoJSON, data]); // Re-render when geoJSON or data changes

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

      {/* Statistics overlay with heat map legend */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200 max-w-[260px] z-[1000]">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900">Statistics</h4>
          <span className="text-sm text-gray-500">
            {data.reduce((sum, item) => sum + item.value, 0).toLocaleString()} total
          </span>
        </div>

        {/* Heat map color scale legend */}
        <div className="mb-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
          <p className="text-xs font-semibold text-gray-700 mb-2">Data Intensity</p>
          <div className="flex items-center gap-1 mb-1">
            <div className="w-full h-4 rounded-sm" style={{
              background: 'linear-gradient(to right, #fef3c7, #fcd34d, #fb923c, #dc2626)'
            }}></div>
          </div>
          <div className="flex justify-between text-[10px] text-gray-600">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        {/* Regional statistics */}
        <div className="space-y-2">
          {data
            .sort((a, b) => b.value - a.value) // Sort by value descending
            .map((item, index) => {
              // Find region ID from mapping
              const regionId = REGION_NAME_MAPPING[item.region] ||
                Object.keys(REGION_COLORS).find(
                  key => geoJSON?.features.find(
                    f => f.properties?.name === item.region && f.properties?.id === key
                  )
                ) || 'central';

              const isHovered = hoveredRegion === item.region;
              const maxValue = Math.max(...data.map(d => d.value));
              const minValue = Math.min(...data.map(d => d.value));
              const normalizedValue = maxValue > minValue ? (item.value - minValue) / (maxValue - minValue) : 0.5;

              // Get heat map color for this region
              let heatColor = '#fef3c7';
              if (normalizedValue >= 0.75) heatColor = '#dc2626';
              else if (normalizedValue >= 0.5) heatColor = '#fb923c';
              else if (normalizedValue >= 0.25) heatColor = '#fcd34d';

              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${
                    isHovered ? 'bg-gray-100 shadow-sm' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full border border-white shadow-sm"
                      style={{
                        backgroundColor: heatColor
                      }}
                    />
                    <span className={`text-sm ${isHovered ? 'font-semibold' : ''} text-gray-700`}>
                      {item.region}
                    </span>
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
