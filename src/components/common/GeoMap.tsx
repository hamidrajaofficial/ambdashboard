import React, { useState } from 'react';
import { GeoLocationLead } from '../../types/marketing.ts';
import { MapPin, Users, Target, Activity } from 'lucide-react';

interface GeoMapProps {
  usData: GeoLocationLead[];
  onSelectState?: (stateCode: string) => void;
  selectedState?: string | null;
}

export const GeoMap: React.FC<GeoMapProps> = ({
  usData,
  onSelectState,
  selectedState,
}) => {
  const [hoveredState, setHoveredState] = useState<GeoLocationLead | null>(null);

  // SVG coordinates map for major US state nodes in an aesthetic cartographic projection layout
  const stateCoordinates: Record<string, { x: number; y: number; r: number; abbr: string }> = {
    WA: { x: 95, y: 55, r: 24, abbr: 'WA' },
    OR: { x: 80, y: 110, r: 20, abbr: 'OR' },
    CA: { x: 70, y: 220, r: 38, abbr: 'CA' },
    NV: { x: 125, y: 190, r: 18, abbr: 'NV' },
    AZ: { x: 175, y: 285, r: 24, abbr: 'AZ' },
    CO: { x: 260, y: 220, r: 22, abbr: 'CO' },
    NM: { x: 250, y: 295, r: 18, abbr: 'NM' },
    TX: { x: 330, y: 345, r: 42, abbr: 'TX' },
    OK: { x: 335, y: 270, r: 18, abbr: 'OK' },
    MN: { x: 345, y: 90, r: 20, abbr: 'MN' },
    MO: { x: 375, y: 215, r: 20, abbr: 'MO' },
    IL: { x: 410, y: 175, r: 26, abbr: 'IL' },
    TN: { x: 460, y: 250, r: 22, abbr: 'TN' },
    GA: { x: 495, y: 310, r: 26, abbr: 'GA' },
    FL: { x: 535, y: 385, r: 34, abbr: 'FL' },
    NC: { x: 520, y: 245, r: 24, abbr: 'NC' },
    VA: { x: 525, y: 205, r: 20, abbr: 'VA' },
    PA: { x: 515, y: 155, r: 24, abbr: 'PA' },
    NY: { x: 550, y: 115, r: 32, abbr: 'NY' },
    MA: { x: 590, y: 105, r: 18, abbr: 'MA' },
    OH: { x: 465, y: 175, r: 20, abbr: 'OH' },
  };

  const maxLeads = Math.max(...usData.map((d) => d.leads), 1200);

  const getStateColor = (leads: number) => {
    const ratio = leads / maxLeads;
    if (ratio > 0.8) return '#193d85'; // AMIT Royal Navy
    if (ratio > 0.5) return '#2654a8';
    if (ratio > 0.3) return '#3b6fcc';
    if (ratio > 0.15) return '#5e8de3';
    return '#8db0f0';
  };

  return (
    <div className="relative w-full">
      {/* SVG Container */}
      <div className="relative w-full h-80 bg-slate-900 rounded-xl overflow-hidden p-3 flex items-center justify-center border border-slate-800">
        <svg
          viewBox="0 0 650 440"
          className="w-full h-full max-h-76 select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Subtle grid lines */}
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" strokeWidth="0.8" />
            </pattern>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <rect width="650" height="440" fill="url(#grid)" />

          {/* Cartographic Network connection lines */}
          <g stroke="#334155" strokeWidth="1" strokeDasharray="3 3" opacity="0.4">
            <line x1="70" y1="220" x2="330" y2="345" />
            <line x1="330" y1="345" x2="535" y2="385" />
            <line x1="330" y1="345" x2="410" y2="175" />
            <line x1="410" y1="175" x2="550" y2="115" />
            <line x1="95" y1="55" x2="260" y2="220" />
            <line x1="260" y1="220" x2="330" y2="345" />
            <line x1="495" y1="310" x2="535" y2="385" />
            <line x1="520" y1="245" x2="550" y2="115" />
          </g>

          {/* State Heatmap Nodes */}
          {Object.entries(stateCoordinates).map(([code, pos]) => {
            const dataItem = usData.find((d) => d.stateCode === code);
            const leads = dataItem ? dataItem.leads : 85;
            const isSelected = selectedState === code;
            const isHovered = hoveredState?.stateCode === code;
            const circleColor = dataItem ? getStateColor(leads) : '#334155';

            return (
              <g
                key={code}
                className="cursor-pointer transition-transform duration-200"
                onClick={() => onSelectState && onSelectState(code)}
                onMouseEnter={() =>
                  setHoveredState(
                    dataItem || {
                      stateCode: code,
                      stateName: code,
                      country: 'United States',
                      leads,
                      visitors: leads * 42,
                      convRate: 2.3,
                      topCity: 'Metro Region',
                      topSpecialty: 'General Practice',
                      leadSharePercent: 2.1,
                      coordinates: [pos.x, pos.y],
                    }
                  )
                }
                onMouseLeave={() => setHoveredState(null)}
              >
                {/* Outer ripple halo if high lead count */}
                {leads > 800 && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={pos.r + 7}
                    fill={circleColor}
                    opacity={isSelected ? 0.35 : 0.15}
                    className="animate-pulse"
                  />
                )}

                {/* Main bubble */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? pos.r + 3 : pos.r}
                  fill={circleColor}
                  stroke={isSelected ? '#ffffff' : '#0f172a'}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  opacity={isHovered ? 1 : 0.9}
                  filter={isSelected ? 'url(#glow)' : undefined}
                />

                {/* State Code Label */}
                <text
                  x={pos.x}
                  y={pos.y - 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="700"
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                >
                  {pos.abbr}
                </text>

                {/* Lead count under state code */}
                <text
                  x={pos.x}
                  y={pos.y + 11}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#cbd5e1"
                  fontSize="8.5"
                  fontWeight="600"
                  className="font-mono tabular-nums"
                >
                  {leads.toLocaleString()}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredState && (
          <div className="absolute top-3 right-3 bg-slate-950/95 border border-slate-700/80 rounded-lg p-3 text-white text-xs shadow-xl backdrop-blur-md z-20 pointer-events-none min-w-56 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 mb-2">
              <span className="font-semibold text-slate-100 text-sm">
                {hoveredState.stateName} ({hoveredState.stateCode})
              </span>
              <span className="text-emerald-400 font-mono text-[11px] font-semibold">
                {hoveredState.convRate}% Conv.
              </span>
            </div>
            <div className="space-y-1 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Leads:</span>
                <span className="font-semibold text-white font-mono tabular-nums">
                  {hoveredState.leads.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Visitor Reach:</span>
                <span className="font-mono tabular-nums">{hoveredState.visitors.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Top Metro Hub:</span>
                <span className="text-sky-300 font-medium">{hoveredState.topCity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Dominant Specialty:</span>
                <span className="text-amber-300 font-medium">{hoveredState.topSpecialty}</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Legend */}
        <div className="absolute bottom-2 left-3 flex items-center gap-3 bg-slate-950/80 px-2.5 py-1 rounded text-[11px] text-slate-300 border border-slate-800">
          <span className="text-slate-400">Lead Density:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8db0f0] inline-block"></span>
            <span className="text-[10px]">Low</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#3b6fcc] inline-block"></span>
            <span className="text-[10px]">Med</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#193d85] inline-block"></span>
            <span className="text-[10px] font-semibold text-white">Top Density</span>
          </div>
        </div>
      </div>
    </div>
  );
};
