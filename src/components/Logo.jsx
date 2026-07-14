function Logo() {
  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Animated SVG Icon */}
      <div className="relative w-9 h-9 shrink-0">
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Glow filter */}
          <defs>
            <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>

          {/* Background rounded square */}
          <rect width="36" height="36" rx="10" fill="url(#grad1)" />

          {/* Animated orbit ring */}
          <circle
            cx="18"
            cy="18"
            r="12"
            stroke="url(#grad2)"
            strokeWidth="1"
            strokeDasharray="4 3"
            fill="none"
            opacity="0.5"
            style={{
              transformOrigin: "18px 18px",
              animation: "spin 8s linear infinite",
            }}
          />

          {/* Pen / quill icon */}
          <g filter="url(#glow)">
            {/* Main diagonal stroke */}
            <line
              x1="11"
              y1="25"
              x2="23"
              y2="11"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Nib triangle */}
            <path
              d="M11 25 L14 22 L16 26 Z"
              fill="white"
              opacity="0.9"
            />
            {/* Sparkle dot top-right */}
            <circle cx="24" cy="10" r="1.5" fill="#c4b5fd">
              <animate
                attributeName="opacity"
                values="1;0.3;1"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="r"
                values="1.5;2.2;1.5"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </g>

          {/* Animated underline bar */}
          <rect x="10" y="27" width="0" height="2" rx="1" fill="white" opacity="0.6">
            <animate
              attributeName="width"
              from="0"
              to="16"
              dur="1s"
              fill="freeze"
              begin="0.3s"
            />
          </rect>
        </svg>

        {/* Spin keyframe via style tag */}
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
        `}</style>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span className="text-lg font-extrabold tracking-tight bg-clip-text text-transparent"
          style={{
            backgroundImage: "linear-gradient(135deg, #a78bfa 0%, #818cf8 100%)",
          }}
        >
          Mega
        </span>
        <span className="text-xs font-semibold text-slate-400 tracking-widest uppercase -mt-0.5">
          Blog
        </span>
      </div>
    </div>
  );
}

export default Logo;
