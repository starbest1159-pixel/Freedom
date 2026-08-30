import React from 'react';

interface FreedomLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon-only' | 'compact';
  showAdminBadge?: boolean;
  className?: string;
}

export const FreedomLogo: React.FC<FreedomLogoProps> = ({
  size = 'md',
  variant = 'full',
  showAdminBadge = true,
  className = '',
}) => {
  // Dimensions based on size
  const iconDimensions = {
    xs: { width: 22, height: 22, radius: 'rounded-md', textSize: 'text-sm', badgeSize: 'text-[9px] px-1 py-0.5' },
    sm: { width: 28, height: 28, radius: 'rounded-lg', textSize: 'text-base', badgeSize: 'text-[10px] px-1.5 py-0.5' },
    md: { width: 36, height: 36, radius: 'rounded-xl', textSize: 'text-lg', badgeSize: 'text-[11px] px-2 py-0.5' },
    lg: { width: 48, height: 48, radius: 'rounded-xl', textSize: 'text-2xl', badgeSize: 'text-xs px-2.5 py-1' },
    xl: { width: 64, height: 64, radius: 'rounded-2xl', textSize: 'text-3xl', badgeSize: 'text-sm px-3 py-1' },
  }[size];

  const iconSize = iconDimensions.width;

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Eye-catching, focal-point iconic Freedom Emblem */}
      <div
        className={`relative shrink-0 flex items-center justify-center ${iconDimensions.radius} overflow-hidden shadow-lg shadow-[#E50914]/25 transition-transform duration-200 hover:scale-105`}
        style={{ width: iconSize, height: iconSize }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Rich Red Core Gradient */}
            <linearGradient id="freedom-red-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF2E3B" />
              <stop offset="45%" stopColor="#E50914" />
              <stop offset="100%" stopColor="#990000" />
            </linearGradient>

            {/* Wing Gradient */}
            <linearGradient id="freedom-wing-grad" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E0E0E0" />
            </linearGradient>

            {/* Accent Gold/Crimson Glow */}
            <linearGradient id="freedom-accent-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E50914" />
              <stop offset="100%" stopColor="#FF6B6B" />
            </linearGradient>

            {/* Drop Shadow for Prism Wings */}
            <filter id="freedom-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Background Badge with subtle border */}
          <rect width="100" height="100" rx="22" fill="#121212" />
          <rect
            width="98"
            height="98"
            x="1"
            y="1"
            rx="21"
            fill="url(#freedom-red-grad)"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1.5"
          />

          {/* Diagonal Speed / Freedom Accent Slash in background */}
          <path
            d="M-10 110 L110 -10 L125 -10 L5 110 Z"
            fill="white"
            fillOpacity="0.08"
          />

          {/* Striking Geometric "F" + Wings of Freedom */}
          <g filter="url(#freedom-glow)">
            {/* Vertical Spine of F (Strong, grounded pillar) */}
            <path
              d="M26 22 L40 22 L40 78 L26 78 Z"
              fill="url(#freedom-wing-grad)"
            />

            {/* Top Wing / Horizontal Forward Slash (Soaring freedom wing) */}
            <path
              d="M26 22 L78 22 L72 35 L40 35 L40 22 Z"
              fill="url(#freedom-wing-grad)"
            />
            {/* Top Wing Sharp Blade Tip (Arrow/Play forward motif) */}
            <path
              d="M78 22 L84 28 L72 35 Z"
              fill="#FFFFFF"
            />

            {/* Middle Wing (Dynamic Play triangle wing) */}
            <path
              d="M40 45 L68 45 L62 56 L40 56 Z"
              fill="url(#freedom-wing-grad)"
            />
            <path
              d="M68 45 L73 50.5 L62 56 Z"
              fill="#FFFFFF"
            />

            {/* Cinematic Forward Play Spark / Diamond Accent */}
            <polygon
              points="78,52 86,60 78,68 70,60"
              fill="#FFFFFF"
              className="animate-pulse"
            />
          </g>

          {/* Corner Light Glint */}
          <circle cx="28" cy="24" r="2.5" fill="#FFFFFF" opacity="0.9" />
        </svg>
      </div>

      {/* Typography Section */}
      {variant !== 'icon-only' && (
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span
                className={`font-black tracking-[0.15em] text-white leading-none ${iconDimensions.textSize}`}
                style={{ fontFamily: "'Noto Sans Thai', system-ui, sans-serif" }}
              >
                FREEDOM
              </span>
              {showAdminBadge && (
                <span
                  className={`bg-white/10 text-gray-300 font-mono font-semibold rounded uppercase tracking-wider border border-white/10 ${iconDimensions.badgeSize}`}
                >
                  ADMIN
                </span>
              )}
            </div>
            {variant === 'full' && size === 'xl' && (
              <span className="text-xs text-gray-400 font-normal tracking-wide mt-1">
                CINEMA & STREAMING MANAGEMENT
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
