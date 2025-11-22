import React from "react";

interface LoadingWheelProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
}

const LoadingWheel: React.FC<LoadingWheelProps> = ({
  size = 60,
  className,
  style,
  "aria-label": ariaLabel = "Loading",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 50 50"
    aria-label={ariaLabel}
    className={className}
    style={style}
    role="status"
  >
    <defs>
      <linearGradient id="spinner-gradient" x1="0" y1="0" x2="50" y2="50" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1df121" />
        <stop offset="100%" stopColor="#60a5fa" />
      </linearGradient>
      <filter id="spinner-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#1df121" floodOpacity="0.7" />
      </filter>
    </defs>
    <circle
      cx="25"
      cy="25"
      r="20"
      fill="none"
      stroke="#222"
      strokeWidth="7"
    />
    <circle
      cx="25"
      cy="25"
      r="20"
      fill="none"
      stroke="url(#spinner-gradient)"
      strokeWidth="7"
      strokeLinecap="round"
      filter="url(#spinner-shadow)"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 25 25"
        to="360 25 25"
        dur="0.6s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);

export default LoadingWheel;
