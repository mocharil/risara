"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { scaleLinear } from 'd3-scale';
import { AlertCircle, Info } from 'lucide-react';

interface RegionData {
  region: string;
  value: number;
}

interface JakartaMapProps {
  data: RegionData[];
}

interface Region {
  path: string;
  name: string;
  baseColor: string;
  center: { x: number; y: number };
}

type RegionKey = 'north' | 'west' | 'central' | 'east' | 'south';

interface Regions {
  north: Region;
  west: Region;
  central: Region;
  east: Region;
  south: Region;
}

// More realistic Jakarta map based on actual geographical boundaries
const regions: Regions = {
  north: {
    // North Jakarta (Kepulauan Seribu area - coastal/northern part)
    path: "M150,30 L180,25 L220,20 L260,22 L300,25 L340,28 L380,32 L410,40 L430,55 L445,75 L450,95 L445,115 L430,130 L410,140 L380,145 L340,148 L300,150 L260,148 L220,145 L180,140 L150,130 L130,115 L120,95 L115,75 L120,55 L130,40 Z",
    name: "North Jakarta",
    baseColor: '#60A5FA',
    center: { x: 282, y: 90 }
  },
  west: {
    // West Jakarta (western part - includes Cengkareng, Tambora area)
    path: "M50,150 L80,140 L115,135 L150,130 L180,140 L220,145 L240,165 L245,190 L240,220 L230,250 L215,280 L195,310 L170,335 L145,350 L120,355 L95,350 L70,335 L50,310 L35,280 L30,250 L35,220 L40,190 L45,165 Z",
    name: "West Jakarta",
    baseColor: '#34D399',
    center: { x: 140, y: 245 }
  },
  central: {
    // Central Jakarta (heart of Jakarta - Monas area)
    path: "M220,145 L260,148 L300,150 L340,148 L380,145 L395,165 L400,190 L395,220 L385,250 L365,270 L340,280 L300,285 L260,283 L220,278 L195,270 L185,250 L180,220 L185,190 L195,165 Z",
    name: "Central Jakarta",
    baseColor: '#A78BFA',
    center: { x: 290, y: 215 }
  },
  east: {
    // East Jakarta (eastern part - includes Cakung, Kramat Jati area)
    path: "M380,145 L410,140 L430,130 L455,135 L480,145 L500,165 L515,190 L520,220 L515,250 L500,280 L480,305 L455,325 L430,338 L405,345 L380,348 L365,335 L350,310 L345,280 L350,250 L360,220 L370,190 L380,165 Z",
    name: "East Jakarta",
    baseColor: '#F472B6',
    center: { x: 435, y: 245 }
  },
  south: {
    // South Jakarta (southern part - includes Kebayoran, Jagakarsa area)
    path: "M170,335 L195,310 L215,280 L230,250 L240,220 L245,190 L260,283 L300,285 L340,280 L345,280 L350,310 L365,335 L380,348 L370,375 L350,400 L325,425 L300,445 L275,460 L250,465 L225,460 L200,445 L175,425 L155,400 L145,375 Z",
    name: "South Jakarta",
    baseColor: '#FBBF24',
    center: { x: 265, y: 375 }
  }
};

const REGION_COLORS = {
  north: {
    base: '#84cc16', // Light green
    hover: '#65a30d',
    light: '#ecfccb'
  },
  west: {
    base: '#f97316', // Orange
    hover: '#ea580c',
    light: '#ffedd5'
  },
  central: {
    base: '#a855f7', // Purple
    hover: '#9333ea',
    light: '#f3e8ff'
  },
  east: {
    base: '#92400e', // Brown
    hover: '#78350f',
    light: '#fef3c7'
  },
  south: {
    base: '#0ea5e9', // Blue
    hover: '#0284c7',
    light: '#e0f2fe'
  }
};

export const JakartaMap: React.FC<JakartaMapProps> = ({ data }) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Enhanced memoized calculations
  const { maxValue, colorScale, totalIssues, urgencyLevel } = useMemo(() => {
    const max = Math.max(...data.map(item => item.value));
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    const scale = scaleLinear<string>()
      .domain([0, max])
      .range(['#f0fdfa', '#0d9488']); // Lighter teal to darker teal

    // Calculate urgency level based on total issues
    const urgency = total > 1000 ? 'high' : total > 500 ? 'medium' : 'low';

    return { maxValue: max, colorScale: scale, totalIssues: total, urgencyLevel: urgency };
  }, [data]);

  const getRegionValue = (regionName: string): number => {
    const region = data.find(r => r.region.includes(regionName));
    return region ? region.value : 0;
  };
  const getRegionKey = (regionName: string): keyof typeof REGION_COLORS | undefined => {
    const key = Object.keys(regions).find(
      key => regions[key as keyof typeof regions].name === regionName
    );
    return key as keyof typeof REGION_COLORS | undefined;
  };
  
  // Then update anywhere you're using region colors:
  const getRegionColor = (value: number, baseColor: string, isHovered: boolean) => {
    const intensity = value / maxValue; // Calculate intensity based on value
    
    if (isHovered) {
      return REGION_COLORS[baseColor as keyof typeof REGION_COLORS]?.hover || baseColor;
    }
  
    // Convert hex to RGB for better color manipulation
    const hex = REGION_COLORS[baseColor as keyof typeof REGION_COLORS]?.base || baseColor;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
  
    // Darken the color based on intensity
    const darkenFactor = 0.5 + (intensity * 0.5); // 50% to 100% of original color
    const newR = Math.round(r * darkenFactor);
    const newG = Math.round(g * darkenFactor);
    const newB = Math.round(b * darkenFactor);
  
    return `rgb(${newR}, ${newG}, ${newB})`;
  };
  

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const regionKeys = Object.keys(regions) as RegionKey[];

  const legendSteps = 5;
  const legendValues = Array.from({ length: legendSteps }, (_, i) => 
    Math.round((maxValue / (legendSteps - 1)) * i)
  );




  return (
    <div className="relative w-full h-full bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">Jakarta Regional Map</h3>
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
            urgencyLevel === 'high' ? 'bg-red-100 text-red-700' :
            urgencyLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-green-100 text-green-700'
          }`}>
            {urgencyLevel === 'high' ? 'High Activity' :
             urgencyLevel === 'medium' ? 'Moderate Activity' :
             'Low Activity'}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Distribution of reported issues across Jakarta
        </p>
      </div>

      {/* Main Map */}
      <svg viewBox="0 0 550 500" className="w-full h-full">
        {/* Background gradient for water/ocean effect */}
        <defs>
          <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#dbeafe" stopOpacity="0.5" />
          </linearGradient>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>
          </pattern>
        </defs>

        {/* Water/Ocean background */}
        <rect width="550" height="500" fill="url(#waterGradient)" />
        <rect width="550" height="500" fill="url(#grid)" opacity="0.3" />

        {/* Ocean waves decoration */}
        <path d="M0,15 Q25,10 50,15 T100,15 T150,15 T200,15 T250,15 T300,15 T350,15 T400,15 T450,15 T500,15 T550,15"
              fill="none" stroke="#93c5fd" strokeWidth="1" opacity="0.4"/>
        <path d="M0,35 Q25,30 50,35 T100,35 T150,35 T200,35 T250,35 T300,35 T350,35 T400,35 T450,35 T500,35 T550,35"
              fill="none" stroke="#93c5fd" strokeWidth="1" opacity="0.3"/>

        {/* Compass Rose */}
        <g transform="translate(490, 460)" opacity="0.6">
          <circle cx="0" cy="0" r="25" fill="white" stroke="#334155" strokeWidth="1.5"/>
          {/* North arrow */}
          <path d="M0,-20 L-4,-8 L0,-10 L4,-8 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="0.5"/>
          <text x="0" y="-24" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#334155">N</text>
          {/* South */}
          <path d="M0,20 L-4,8 L0,10 L4,8 Z" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5"/>
          {/* East */}
          <path d="M20,0 L8,-4 L10,0 L8,4 Z" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5"/>
          <text x="24" y="4" textAnchor="middle" fontSize="8" fill="#64748b">E</text>
          {/* West */}
          <path d="M-20,0 L-8,-4 L-10,0 L-8,4 Z" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5"/>
          <text x="-24" y="4" textAnchor="middle" fontSize="8" fill="#64748b">W</text>
        </g>

        {/* Scale bar */}
        <g transform="translate(30, 460)">
          <rect x="0" y="0" width="80" height="20" fill="white" stroke="#334155" strokeWidth="1" opacity="0.9" rx="3"/>
          <line x1="10" y1="10" x2="70" y2="10" stroke="#334155" strokeWidth="2"/>
          <line x1="10" y1="7" x2="10" y2="13" stroke="#334155" strokeWidth="2"/>
          <line x1="40" y1="7" x2="40" y2="13" stroke="#334155" strokeWidth="1.5"/>
          <line x1="70" y1="7" x2="70" y2="13" stroke="#334155" strokeWidth="2"/>
          <text x="40" y="18" textAnchor="middle" fontSize="8" fill="#334155" fontWeight="600">10 km</text>
        </g>

        {/* Regions with enhanced styling */}
        {regionKeys.map((key) => {
          const region = regions[key];
          const value = getRegionValue(region.name);
          const isHovered = hoveredRegion === region.name;
          const isSelected = selectedRegion === region.name;
          
          return (
            <g key={key}>
              <motion.path
  d={region.path}
  fill={getRegionColor(value, key, isHovered)}
  stroke={isSelected ? REGION_COLORS[key].hover : "white"}
  strokeWidth={isSelected ? 3 : 1.5}
  initial={{ opacity: 0 }}
  animate={{ 
    opacity: 1,
    scale: isHovered ? 1.02 : 1,
    filter: `drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) brightness(${isHovered ? 1.1 : 1})`
  }}
  transition={{ 
    duration: 0.2,
    ease: "easeOut"
  }}
  onMouseEnter={() => setHoveredRegion(region.name)}
  onMouseLeave={() => setHoveredRegion(null)}
  onClick={() => setSelectedRegion(region.name)}
  className="transition-all duration-200 cursor-pointer"
/>

              {/* Enhanced Labels */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  scale: isHovered ? 1.1 : 1
                }}
                className="pointer-events-none"
              >
                {/* Region name with shadow for better readability */}
                <text
                  x={region.center.x}
                  y={region.center.y - 8}
                  textAnchor="middle"
                  className="font-bold"
                  fontSize="13"
                  fill="white"
                  stroke="rgba(0,0,0,0.3)"
                  strokeWidth="0.5"
                  filter="drop-shadow(0 1px 2px rgb(0 0 0 / 0.3))"
                >
                  {region.name.replace(' Jakarta', '')}
                </text>
                {/* Issue count below region name */}
                <text
                  x={region.center.x}
                  y={region.center.y + 10}
                  textAnchor="middle"
                  className="font-semibold"
                  fontSize="11"
                  fill="white"
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth="0.3"
                  opacity={isHovered ? 1 : 0.8}
                >
                  {formatNumber(value)} issues
                </text>
              </motion.g>
            </g>
          );
        })}

        
      </svg>

      {/* Enhanced Statistics Panel */}
<div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200 max-w-[240px]">
  <div className="flex items-center justify-between mb-3">
    <h4 className="font-semibold text-gray-900">Statistics</h4>
    <span className="text-sm text-gray-500">{formatNumber(totalIssues)} total</span>
  </div>
  <div className="space-y-2">
    {data.map((item, index) => {
      // Get the region key safely
      const regionKey = Object.keys(regions).find(
        key => regions[key as keyof typeof regions].name === item.region
      ) as keyof typeof REGION_COLORS | undefined;

      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
            hoveredRegion === item.region ? 'bg-gray-50' : ''
          }`}
          onMouseEnter={() => setHoveredRegion(item.region)}
          onMouseLeave={() => setHoveredRegion(null)}
        >
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ 
                backgroundColor: regionKey ? 
                  REGION_COLORS[regionKey].base : 
                  '#CBD5E1' // default color if region not found
              }} 
            />
            <span className="text-sm text-gray-700">{item.region}</span>
          </div>
          <span className="font-medium text-gray-900">{formatNumber(item.value)}</span>
        </motion.div>
      );
    })}
  </div>
</div>

      {/* Interactive Tooltip */}
      <AnimatePresence>
        {hoveredRegion && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bg-white/95 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg border border-gray-200"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <h4 className="font-semibold text-gray-900 mb-1">{hoveredRegion}</h4>
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 text-blue-500" />
              <span className="text-gray-600">
                {formatNumber(getRegionValue(hoveredRegion))} reported issues
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JakartaMap;