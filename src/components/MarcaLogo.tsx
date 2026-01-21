import React from 'react';

interface MarcaLogoProps {
  marca: string;
  className?: string;
}

export default function MarcaLogo({ marca, className = 'w-12 h-12' }: MarcaLogoProps) {
  const logos: Record<string, React.ReactNode> = {
    bmw: (
      <svg viewBox="0 0 48 48" className={className}>
        <circle cx="24" cy="24" r="23" fill="#0066B1" stroke="#fff" strokeWidth="2"/>
        <path d="M24 1C11.3 1 1 11.3 1 24s10.3 23 23 23 23-10.3 23-23S36.7 1 24 1zm0 3c11 0 20 9 20 20s-9 20-20 20S4 35 4 24 13 4 24 4z" fill="#fff"/>
        <path d="M24 4v20h20c0-11-9-20-20-20z" fill="#fff"/>
        <path d="M24 24v20c11 0 20-9 20-20H24z" fill="#0066B1"/>
        <path d="M4 24h20V4C13 4 4 13 4 24z" fill="#0066B1"/>
        <path d="M4 24c0 11 9 20 20 20V24H4z" fill="#fff"/>
      </svg>
    ),
    'mercedes-benz': (
      <svg viewBox="0 0 48 48" className={className}>
        <circle cx="24" cy="24" r="22" fill="none" stroke="#9CA3AF" strokeWidth="3"/>
        <circle cx="24" cy="24" r="18" fill="none" stroke="#9CA3AF" strokeWidth="1.5"/>
        <path d="M24 6v18l-15.6 9M24 24l15.6 9M24 24V6" stroke="#9CA3AF" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      </svg>
    ),
    audi: (
      <svg viewBox="0 0 80 24" className={className}>
        <g fill="none" stroke="#9CA3AF" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="28" cy="12" r="10"/>
          <circle cx="44" cy="12" r="10"/>
          <circle cx="60" cy="12" r="10"/>
        </g>
      </svg>
    ),
    'land-rover': (
      <svg viewBox="0 0 48 48" className={className}>
        <ellipse cx="24" cy="24" rx="22" ry="14" fill="none" stroke="#005A2B" strokeWidth="2.5"/>
        <text x="24" y="28" textAnchor="middle" fill="#005A2B" fontSize="8" fontWeight="bold" fontFamily="Arial">LAND ROVER</text>
      </svg>
    ),
    volvo: (
      <svg viewBox="0 0 48 48" className={className}>
        <circle cx="24" cy="24" r="21" fill="none" stroke="#003057" strokeWidth="2.5"/>
        <path d="M3 24h10M35 24h10" stroke="#003057" strokeWidth="2.5"/>
        <path d="M24 3l8 14H16l8-14z" fill="none" stroke="#003057" strokeWidth="2"/>
      </svg>
    ),
    jaguar: (
      <svg viewBox="0 0 48 48" className={className}>
        <circle cx="24" cy="24" r="21" fill="none" stroke="#9CA3AF" strokeWidth="2"/>
        <path d="M12 28c4-8 12-12 20-8M14 20c2-2 6-4 10-4s8 2 10 4" stroke="#9CA3AF" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <circle cx="18" cy="22" r="2" fill="#9CA3AF"/>
        <circle cx="30" cy="22" r="2" fill="#9CA3AF"/>
      </svg>
    ),
    porsche: (
      <svg viewBox="0 0 48 48" className={className}>
        <rect x="4" y="8" width="40" height="32" rx="4" fill="none" stroke="#9CA3AF" strokeWidth="2"/>
        <text x="24" y="28" textAnchor="middle" fill="#9CA3AF" fontSize="10" fontWeight="bold" fontFamily="Arial">P</text>
      </svg>
    ),
    lexus: (
      <svg viewBox="0 0 48 48" className={className}>
        <ellipse cx="24" cy="24" rx="20" ry="16" fill="none" stroke="#9CA3AF" strokeWidth="2"/>
        <text x="24" y="28" textAnchor="middle" fill="#9CA3AF" fontSize="14" fontWeight="bold" fontFamily="Arial">L</text>
      </svg>
    ),
  };

  return logos[marca] || (
    <div className={`${className} bg-slate-700 rounded-full flex items-center justify-center`}>
      <span className="text-xl">🚗</span>
    </div>
  );
}
