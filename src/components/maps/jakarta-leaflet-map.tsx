"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup, useMap } from 'react-leaflet';
import { GeoJsonObject, FeatureCollection } from 'geojson';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface RegionData {
  region: string;
  value: number;
}

interface JakartaLeafletMapProps {
  data: RegionData[];
}

// Fix default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Jakarta regions GeoJSON (simplified boundaries)
const jakartaGeoJSON: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "North Jakarta", id: "north" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [106.7400, -6.1000], [106.9600, -6.1000], [106.9600, -6.0800],
          [106.7400, -6.0800], [106.7400, -6.1000]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "West Jakarta", id: "west" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [106.6800, -6.1800], [106.7800, -6.1800], [106.7800, -6.1000],
          [106.6800, -6.1000], [106.6800, -6.1800]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Central Jakarta", id: "central" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [106.7800, -6.2000], [106.8600, -6.2000], [106.8600, -6.1500],
          [106.7800, -6.1500], [106.7800, -6.2000]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "East Jakarta", id: "east" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [106.8600, -6.2800], [107.0000, -6.2800], [107.0000, -6.1000],
          [106.8600, -6.1000], [106.8600, -6.2800]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "South Jakarta", id: "south" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [106.7400, -6.3600], [106.8800, -6.3600], [106.8800, -6.2000],
          [106.7400, -6.2000], [106.7400, -6.3600]
        ]]
      }
    }
  ]
};

const REGION_COLORS: Record<string, { base: string; hover: string }> = {
  north: { base: '#84cc16', hover: '#65a30d' },
  west: { base: '#f97316', hover: '#ea580c' },
  central: { base: '#a855f7', hover: '#9333ea' },
  east: { base: '#92400e', hover: '#78350f' },
  south: { base: '#0ea5e9', hover: '#0284c7' }
};

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export const JakartaLeafletMap: React.FC<JakartaLeafletMapProps> = ({ data }) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Center of Jakarta - memoized to prevent re-renders
  const center: [number, number] = useMemo(() => [-6.2088, 106.8456], []);
  const zoom = 11;

  const getRegionValue = (regionName: string): number => {
    const region = data.find(r => r.region === regionName);
    return region ? region.value : 0;
  };

  const getRegionColor = (regionId: string, value: number, isHovered: boolean): string => {
    const colors = REGION_COLORS[regionId] || REGION_COLORS.central;
    if (isHovered) return colors.hover;

    // Adjust opacity based on value
    const maxValue = Math.max(...data.map(d => d.value));
    const opacity = value > 0 ? 0.5 + (value / maxValue) * 0.5 : 0.3;
    return colors.base + Math.round(opacity * 255).toString(16).padStart(2, '0');
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    const regionName = feature.properties.name;
    const regionId = feature.properties.id;
    const value = getRegionValue(regionName);

    // Style the layer
    if (layer instanceof L.Path) {
      layer.setStyle({
        fillColor: getRegionColor(regionId, value, false),
        fillOpacity: 0.7,
        color: 'white',
        weight: 2
      });

      // Add interactivity
      layer.on({
        mouseover: (e) => {
          const target = e.target;
          target.setStyle({
            fillColor: getRegionColor(regionId, value, true),
            fillOpacity: 0.9,
            weight: 3
          });
          setHoveredRegion(regionName);
        },
        mouseout: (e) => {
          const target = e.target;
          target.setStyle({
            fillColor: getRegionColor(regionId, value, false),
            fillOpacity: 0.7,
            weight: 2
          });
          setHoveredRegion(null);
        }
      });

      // Bind popup
      layer.bindPopup(`
        <div class="p-2">
          <h3 class="font-bold text-lg mb-1">${regionName}</h3>
          <p class="text-sm text-gray-600">Urgent Issues: <strong>${value.toLocaleString()}</strong></p>
        </div>
      `);
    }
  };

  // Memoize style object to prevent re-creation
  const mapStyle = useMemo(() => ({
    height: '100%',
    width: '100%',
    borderRadius: '0.75rem'
  }), []);

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={center}
        zoom={zoom}
        style={mapStyle}
        zoomControl={true}
        scrollWheelZoom={true}
        placeholder={
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }
      >
        <MapController center={center} zoom={zoom} />

        {/* Base map tiles from OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Jakarta regions */}
        <GeoJSON
          data={jakartaGeoJSON as GeoJsonObject}
          onEachFeature={onEachFeature}
        />
      </MapContainer>

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

export default JakartaLeafletMap;
