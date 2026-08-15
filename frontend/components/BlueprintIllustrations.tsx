"use client";

import React from "react";

export function GaugeBlueprint() {
  return (
    <div className="w-full h-48 sm:h-56 flex items-center justify-center p-4">
      <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[280px] h-auto">
        {/* Outer Frame */}
        <rect x="50" y="30" width="220" height="140" rx="12" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="3 3" />
        <rect x="65" y="45" width="190" height="110" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
        
        {/* Speedometer Gauge Arc */}
        <path d="M 100 130 A 60 60 0 0 1 220 130" stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round" />
        <path d="M 100 130 A 60 60 0 0 1 190 85" stroke="#00D06C" strokeWidth="6" strokeLinecap="round" />
        
        {/* Needle */}
        <line x1="160" y1="130" x2="185" y2="90" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="160" cy="130" r="6" fill="#059669" />
        <circle cx="160" cy="130" r="2.5" fill="#FFFFFF" />

        {/* Digital Matrix / Equalizer below */}
        <g opacity="0.85">
          <rect x="90" y="142" width="14" height="4" rx="1" fill="#00D06C" />
          <rect x="108" y="142" width="14" height="4" rx="1" fill="#00D06C" />
          <rect x="126" y="142" width="14" height="4" rx="1" fill="#00D06C" />
          <rect x="144" y="142" width="14" height="4" rx="1" fill="#00D06C" />
          <rect x="162" y="142" width="14" height="4" rx="1" fill="#10B981" />
          <rect x="180" y="142" width="14" height="4" rx="1" fill="#CBD5E1" />
          <rect x="198" y="142" width="14" height="4" rx="1" fill="#CBD5E1" />
          <rect x="216" y="142" width="14" height="4" rx="1" fill="#CBD5E1" />
        </g>

        {/* Side Blueprint Markers */}
        <circle cx="35" cy="100" r="14" stroke="#00D06C" strokeWidth="1.5" fill="#ECFDF5" />
        <path d="M 31 100 H 39 M 35 96 V 104" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="285" cy="100" r="14" stroke="#E2E8F0" strokeWidth="1.5" fill="#FFFFFF" />
        <circle cx="285" cy="100" r="4" fill="#F59E0B" />
      </svg>
    </div>
  );
}

export function NetworkNodesBlueprint() {
  return (
    <div className="w-full h-48 sm:h-56 flex items-center justify-center p-4">
      <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[280px] h-auto">
        {/* Grid lines */}
        <line x1="40" y1="100" x2="280" y2="100" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="160" y1="30" x2="160" y2="170" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />

        {/* Connecting Lines */}
        <path d="M 70 80 C 110 80 130 100 160 100 C 190 100 210 60 250 60" stroke="#CBD5E1" strokeWidth="1.5" />
        <path d="M 80 130 C 120 130 130 100 160 100 C 190 100 210 140 240 140" stroke="#00D06C" strokeWidth="1.5" strokeDasharray="4 2" />

        {/* Central Core Node (Green Square Box) */}
        <rect x="136" y="76" width="48" height="48" rx="8" fill="#ECFDF5" stroke="#00D06C" strokeWidth="2" />
        <circle cx="160" cy="100" r="14" fill="#00D06C" />
        <circle cx="160" cy="100" r="6" fill="#FFFFFF" />

        {/* Orbiting Satellite Nodes */}
        <circle cx="70" cy="80" r="8" fill="#FFFFFF" stroke="#059669" strokeWidth="2" />
        <circle cx="70" cy="80" r="3" fill="#059669" />
        
        <circle cx="250" cy="60" r="9" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2" />
        <circle cx="250" cy="60" r="4" fill="#F59E0B" />

        <circle cx="80" cy="130" r="7" fill="#FFFFFF" stroke="#64748B" strokeWidth="1.5" />
        <circle cx="240" cy="140" r="10" fill="#FFFFFF" stroke="#00D06C" strokeWidth="2" />
        <circle cx="240" cy="140" r="4" fill="#00D06C" />
      </svg>
    </div>
  );
}

export function SecurityChainBlueprint() {
  return (
    <div className="w-full h-48 sm:h-56 flex items-center justify-center p-4">
      <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[280px] h-auto">
        {/* Baseline Axis */}
        <line x1="30" y1="100" x2="290" y2="100" stroke="#E2E8F0" strokeWidth="1.5" />

        {/* Left Badge (Eth / Model Diamond) */}
        <g transform="translate(60, 75)">
          <rect x="0" y="0" width="50" height="50" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
          <path d="M 25 12 L 35 26 L 25 38 L 15 26 Z" fill="#00D06C" fillOpacity="0.8" />
          <path d="M 25 12 L 25 38 L 35 26 Z" fill="#059669" />
        </g>

        {/* Center Padlock / Auth Module */}
        <g transform="translate(135, 65)">
          <rect x="0" y="20" width="50" height="45" rx="8" fill="#059669" />
          <path d="M 12 20 V 12 A 13 13 0 0 1 38 12 V 20" stroke="#059669" strokeWidth="4" fill="none" />
          <circle cx="25" cy="40" r="4" fill="#FFFFFF" />
          <path d="M 25 44 V 50" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Right Badge (Token / Verified Shield) */}
        <g transform="translate(210, 75)">
          <rect x="0" y="0" width="50" height="50" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
          <circle cx="25" cy="25" r="14" fill="#ECFDF5" stroke="#00D06C" strokeWidth="1.5" />
          <path d="M 20 25 L 24 29 L 31 20" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Connection Pulse Dots */}
        <circle cx="122" cy="100" r="3" fill="#00D06C" />
        <circle cx="198" cy="100" r="3" fill="#00D06C" />
      </svg>
    </div>
  );
}

export function RadarBridgeBlueprint() {
  return (
    <div className="w-full h-48 sm:h-56 flex items-center justify-center p-4">
      <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[280px] h-auto">
        {/* Left Radar Rings */}
        <g transform="translate(85, 100)">
          <circle cx="0" cy="0" r="42" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="0" cy="0" r="28" stroke="#00D06C" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="14" fill="#ECFDF5" stroke="#059669" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="4" fill="#059669" />
        </g>

        {/* Center Inter-Op Bridge Mesh */}
        <g transform="translate(140, 70)">
          <rect x="0" y="0" width="40" height="60" rx="6" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
          <line x1="10" y1="15" x2="30" y2="15" stroke="#00D06C" strokeWidth="2" strokeLinecap="round" />
          <line x1="10" y1="30" x2="30" y2="30" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
          <line x1="10" y1="45" x2="30" y2="45" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Right Portal Rings */}
        <g transform="translate(235, 100)">
          <circle cx="0" cy="0" r="42" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="0" cy="0" r="28" stroke="#059669" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="14" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
          <polygon points="0,-7 6,5 -6,5" fill="#F59E0B" />
        </g>

        {/* Cross bridge dashed connector */}
        <line x1="85" y1="100" x2="235" y2="100" stroke="#00D06C" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
      </svg>
    </div>
  );
}
