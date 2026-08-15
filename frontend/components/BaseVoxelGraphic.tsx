"use client";

import React from "react";

interface VoxelGraphicProps {
  variant?: "hero-left" | "hero-right" | "cta-left" | "cta-right" | "banner";
  className?: string;
}

export default function BaseVoxelGraphic({ variant = "hero-left", className = "" }: VoxelGraphicProps) {
  if (variant === "hero-left") {
    return (
      <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
        <svg width="260" height="340" viewBox="0 0 260 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto opacity-80 hover:opacity-100 transition-opacity">
          {/* Column 1 */}
          <rect x="10" y="160" width="8" height="12" rx="2" fill="#00D06C" fillOpacity="0.7" />
          <rect x="10" y="176" width="8" height="24" rx="2" fill="#059669" fillOpacity="0.8" />
          <rect x="10" y="204" width="8" height="14" rx="2" fill="#F59E0B" fillOpacity="0.85" />
          <rect x="10" y="222" width="8" height="10" rx="2" fill="#00D06C" fillOpacity="0.5" />

          {/* Column 2 */}
          <rect x="26" y="130" width="8" height="20" rx="2" fill="#34D399" fillOpacity="0.75" />
          <rect x="26" y="154" width="8" height="16" rx="2" fill="#10B981" fillOpacity="0.9" />
          <rect x="26" y="174" width="8" height="36" rx="2" fill="#059669" />
          <rect x="26" y="214" width="8" height="18" rx="2" fill="#FBBF24" fillOpacity="0.9" />
          <rect x="26" y="236" width="8" height="12" rx="2" fill="#00D06C" fillOpacity="0.4" />

          {/* Column 3 */}
          <rect x="42" y="90" width="8" height="14" rx="2" fill="#059669" fillOpacity="0.6" />
          <rect x="42" y="108" width="8" height="26" rx="2" fill="#00D06C" />
          <rect x="42" y="138" width="8" height="42" rx="2" fill="#10B981" />
          <rect x="42" y="184" width="8" height="20" rx="2" fill="#F59E0B" fillOpacity="0.9" />
          <rect x="42" y="208" width="8" height="14" rx="2" fill="#047857" fillOpacity="0.7" />

          {/* Column 4 */}
          <rect x="58" y="70" width="8" height="18" rx="2" fill="#34D399" fillOpacity="0.8" />
          <rect x="58" y="92" width="8" height="30" rx="2" fill="#00D06C" />
          <rect x="58" y="126" width="8" height="20" rx="2" fill="#059669" />
          <rect x="58" y="150" width="8" height="40" rx="2" fill="#10B981" />
          <rect x="58" y="194" width="8" height="16" rx="2" fill="#FBBF24" fillOpacity="0.8" />

          {/* Column 5 */}
          <rect x="74" y="40" width="8" height="14" rx="2" fill="#00D06C" fillOpacity="0.5" />
          <rect x="74" y="58" width="8" height="24" rx="2" fill="#10B981" />
          <rect x="74" y="86" width="8" height="32" rx="2" fill="#059669" />
          <rect x="74" y="122" width="8" height="18" rx="2" fill="#F59E0B" fillOpacity="0.85" />
          <rect x="74" y="144" width="8" height="36" rx="2" fill="#00D06C" />

          {/* Column 6 */}
          <rect x="90" y="20" width="8" height="16" rx="2" fill="#10B981" fillOpacity="0.8" />
          <rect x="90" y="40" width="8" height="28" rx="2" fill="#00D06C" />
          <rect x="90" y="72" width="8" height="22" rx="2" fill="#059669" />
          <rect x="90" y="98" width="8" height="14" rx="2" fill="#FBBF24" fillOpacity="0.7" />

          {/* Column 7 */}
          <rect x="106" y="50" width="8" height="22" rx="2" fill="#34D399" fillOpacity="0.65" />
          <rect x="106" y="76" width="8" height="18" rx="2" fill="#00D06C" />
          <rect x="106" y="98" width="8" height="30" rx="2" fill="#059669" />

          {/* Column 8 */}
          <rect x="122" y="80" width="8" height="16" rx="2" fill="#00D06C" fillOpacity="0.7" />
          <rect x="122" y="100" width="8" height="20" rx="2" fill="#10B981" />

          {/* Column 9 */}
          <rect x="138" y="110" width="8" height="14" rx="2" fill="#F59E0B" fillOpacity="0.75" />
          <rect x="138" y="128" width="8" height="18" rx="2" fill="#059669" fillOpacity="0.6" />
        </svg>
      </div>
    );
  }

  if (variant === "hero-right") {
    return (
      <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
        <svg width="280" height="360" viewBox="0 0 280 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto opacity-80 hover:opacity-100 transition-opacity">
          {/* Column 1 */}
          <rect x="20" y="90" width="8" height="16" rx="2" fill="#00D06C" fillOpacity="0.5" />
          <rect x="20" y="110" width="8" height="22" rx="2" fill="#F59E0B" fillOpacity="0.8" />
          <rect x="20" y="136" width="8" height="14" rx="2" fill="#059669" fillOpacity="0.6" />

          {/* Column 2 */}
          <rect x="36" y="60" width="8" height="18" rx="2" fill="#10B981" fillOpacity="0.7" />
          <rect x="36" y="82" width="8" height="26" rx="2" fill="#00D06C" />
          <rect x="36" y="112" width="8" height="34" rx="2" fill="#059669" />
          <rect x="36" y="150" width="8" height="16" rx="2" fill="#FBBF24" fillOpacity="0.85" />

          {/* Column 3 */}
          <rect x="52" y="30" width="8" height="20" rx="2" fill="#059669" fillOpacity="0.6" />
          <rect x="52" y="54" width="8" height="32" rx="2" fill="#00D06C" />
          <rect x="52" y="90" width="8" height="40" rx="2" fill="#10B981" />
          <rect x="52" y="134" width="8" height="24" rx="2" fill="#047857" />

          {/* Column 4 */}
          <rect x="68" y="10" width="8" height="24" rx="2" fill="#34D399" fillOpacity="0.9" />
          <rect x="68" y="38" width="8" height="36" rx="2" fill="#00D06C" />
          <rect x="68" y="78" width="8" height="28" rx="2" fill="#F59E0B" fillOpacity="0.9" />
          <rect x="68" y="110" width="8" height="42" rx="2" fill="#059669" />
          <rect x="68" y="156" width="8" height="20" rx="2" fill="#00D06C" fillOpacity="0.6" />

          {/* Column 5 */}
          <rect x="84" y="24" width="8" height="18" rx="2" fill="#10B981" />
          <rect x="84" y="46" width="8" height="38" rx="2" fill="#059669" />
          <rect x="84" y="88" width="8" height="30" rx="2" fill="#00D06C" />
          <rect x="84" y="122" width="8" height="18" rx="2" fill="#FBBF24" fillOpacity="0.8" />

          {/* Column 6 */}
          <rect x="100" y="50" width="8" height="24" rx="2" fill="#00D06C" />
          <rect x="100" y="78" width="8" height="32" rx="2" fill="#10B981" />
          <rect x="100" y="114" width="8" height="20" rx="2" fill="#059669" />

          {/* Column 7 */}
          <rect x="116" y="80" width="8" height="16" rx="2" fill="#34D399" fillOpacity="0.7" />
          <rect x="116" y="100" width="8" height="28" rx="2" fill="#00D06C" />
          <rect x="116" y="132" width="8" height="18" rx="2" fill="#F59E0B" fillOpacity="0.8" />

          {/* Column 8 */}
          <rect x="132" y="120" width="8" height="22" rx="2" fill="#059669" fillOpacity="0.6" />
          <rect x="132" y="146" width="8" height="18" rx="2" fill="#00D06C" fillOpacity="0.5" />
        </svg>
      </div>
    );
  }

  // CTA Banner Voxel Variant (bright contrast on green background)
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg width="320" height="200" viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto opacity-90">
        <rect x="10" y="80" width="6" height="20" rx="1.5" fill="#FFFFFF" fillOpacity="0.4" />
        <rect x="10" y="104" width="6" height="30" rx="1.5" fill="#FEF08A" fillOpacity="0.85" />
        <rect x="10" y="138" width="6" height="18" rx="1.5" fill="#A7F3D0" fillOpacity="0.6" />

        <rect x="22" y="60" width="6" height="28" rx="1.5" fill="#FFFFFF" fillOpacity="0.6" />
        <rect x="22" y="92" width="6" height="42" rx="1.5" fill="#FEF08A" />
        <rect x="22" y="138" width="6" height="24" rx="1.5" fill="#FFFFFF" fillOpacity="0.5" />

        <rect x="34" y="30" width="6" height="36" rx="1.5" fill="#A7F3D0" fillOpacity="0.9" />
        <rect x="34" y="70" width="6" height="50" rx="1.5" fill="#FFFFFF" />
        <rect x="34" y="124" width="6" height="32" rx="1.5" fill="#FEF08A" fillOpacity="0.9" />

        <rect x="46" y="15" width="6" height="30" rx="1.5" fill="#FEF08A" fillOpacity="0.8" />
        <rect x="46" y="49" width="6" height="46" rx="1.5" fill="#FFFFFF" />
        <rect x="46" y="99" width="6" height="38" rx="1.5" fill="#A7F3D0" />
        <rect x="46" y="141" width="6" height="22" rx="1.5" fill="#FFFFFF" fillOpacity="0.4" />

        <rect x="58" y="40" width="6" height="32" rx="1.5" fill="#FFFFFF" fillOpacity="0.75" />
        <rect x="58" y="76" width="6" height="40" rx="1.5" fill="#FEF08A" />
        <rect x="58" y="120" width="6" height="28" rx="1.5" fill="#A7F3D0" fillOpacity="0.7" />

        <rect x="70" y="70" width="6" height="24" rx="1.5" fill="#FFFFFF" fillOpacity="0.6" />
        <rect x="70" y="98" width="6" height="34" rx="1.5" fill="#FEF08A" fillOpacity="0.8" />

        <rect x="82" y="100" width="6" height="20" rx="1.5" fill="#A7F3D0" fillOpacity="0.5" />
        <rect x="82" y="124" width="6" height="28" rx="1.5" fill="#FFFFFF" fillOpacity="0.7" />
      </svg>
    </div>
  );
}
