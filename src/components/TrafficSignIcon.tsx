import type { SignGlyphId } from "../data/licenseData";

interface TrafficSignIconProps {
  glyph: SignGlyphId;
  className?: string;
}

export function TrafficSignIcon({ glyph, className = "w-16 h-16" }: TrafficSignIconProps) {
  switch (glyph) {
    case "stop":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
          <polygon
            points="30,6 70,6 94,30 94,70 70,94 30,94 6,70 6,30"
            fill="#DC2626"
            stroke="#FFFFFF"
            strokeWidth="4"
          />
          <polygon
            points="31,10 69,10 90,31 90,69 69,90 31,90 10,69 10,31"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.5"
          />
          <text
            x="50"
            y="59"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="24"
            fontWeight="700"
            fontFamily="sans-serif"
            letterSpacing="1"
          >
            STOP
          </text>
        </svg>
      );

    case "yield":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
          <polygon
            points="8,14 92,14 50,88"
            fill="#FFFFFF"
            stroke="#DC2626"
            strokeWidth="10"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "priority_road":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
          <rect
            x="20"
            y="20"
            width="60"
            height="60"
            rx="4"
            transform="rotate(45 50 50)"
            fill="#FFFFFF"
            stroke="#0F172A"
            strokeWidth="3"
          />
          <rect
            x="29"
            y="29"
            width="42"
            height="42"
            rx="2"
            transform="rotate(45 50 50)"
            fill="#FACC15"
            stroke="#0F172A"
            strokeWidth="2.5"
          />
        </svg>
      );

    case "roundabout":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
          <circle cx="50" cy="50" r="44" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="3" />
          <g fill="none" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round">
            <path d="M 35 28 A 24 24 0 0 1 68 32" />
            <path d="M 73 46 A 24 24 0 0 1 56 73" />
            <path d="M 41 72 A 24 24 0 0 1 27 44" />
          </g>
          <polygon points="30,33 34,20 43,29" fill="#FFFFFF" />
          <polygon points="73,41 80,53 67,50" fill="#FFFFFF" />
          <polygon points="46,75 34,76 41,65" fill="#FFFFFF" />
        </svg>
      );

    case "speed_50":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
          <circle cx="50" cy="50" r="42" fill="#FFFFFF" stroke="#DC2626" strokeWidth="10" />
          <text
            x="50"
            y="62"
            textAnchor="middle"
            fill="#0F172A"
            fontSize="36"
            fontWeight="700"
            fontFamily="IBM Plex Mono, monospace"
          >
            50
          </text>
        </svg>
      );

    case "no_entry":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
          <circle cx="50" cy="50" r="44" fill="#DC2626" />
          <rect x="18" y="42" width="64" height="16" rx="2" fill="#FFFFFF" />
        </svg>
      );

    case "no_overtaking":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
          <circle cx="50" cy="50" r="42" fill="#FFFFFF" stroke="#DC2626" strokeWidth="10" />
          {/* Left red car */}
          <rect x="23" y="46" width="22" height="14" rx="3" fill="#DC2626" />
          <rect x="26" y="39" width="16" height="9" rx="2" fill="#DC2626" />
          <rect x="25" y="60" width="5" height="5" rx="1" fill="#DC2626" />
          <rect x="38" y="60" width="5" height="5" rx="1" fill="#DC2626" />
          {/* Right dark car */}
          <rect x="55" y="46" width="22" height="14" rx="3" fill="#0F172A" />
          <rect x="58" y="39" width="16" height="9" rx="2" fill="#0F172A" />
          <rect x="57" y="60" width="5" height="5" rx="1" fill="#0F172A" />
          <rect x="70" y="60" width="5" height="5" rx="1" fill="#0F172A" />
        </svg>
      );

    case "no_parking":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
          <circle cx="50" cy="50" r="42" fill="#1D4ED8" stroke="#DC2626" strokeWidth="10" />
          <line x1="22" y1="22" x2="78" y2="78" stroke="#DC2626" strokeWidth="10" />
        </svg>
      );

    case "pedestrian_danger":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
          <polygon
            points="50,10 92,86 8,86"
            fill="#FFFFFF"
            stroke="#DC2626"
            strokeWidth="9"
            strokeLinejoin="round"
          />
          <circle cx="50" cy="40" r="5" fill="#0F172A" />
          <path
            d="M50 46 L50 61 M50 50 L40 58 M50 50 L60 57 M50 61 L42 74 M50 61 L58 74"
            stroke="#0F172A"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <line x1="28" y1="79" x2="36" y2="79" stroke="#0F172A" strokeWidth="3.5" />
          <line x1="46" y1="79" x2="54" y2="79" stroke="#0F172A" strokeWidth="3.5" />
          <line x1="64" y1="79" x2="72" y2="79" stroke="#0F172A" strokeWidth="3.5" />
        </svg>
      );

    case "slippery_road":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
          <polygon
            points="50,10 92,86 8,86"
            fill="#FFFFFF"
            stroke="#DC2626"
            strokeWidth="9"
            strokeLinejoin="round"
          />
          <rect x="38" y="42" width="24" height="12" rx="3" fill="#0F172A" />
          <rect x="42" y="36" width="16" height="8" rx="2" fill="#0F172A" />
          <path
            d="M36 58 Q46 65 36 74 M64 58 Q54 65 64 74"
            fill="none"
            stroke="#0F172A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case "children_danger":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
          <polygon
            points="50,10 92,86 8,86"
            fill="#FFFFFF"
            stroke="#DC2626"
            strokeWidth="9"
            strokeLinejoin="round"
          />
          <circle cx="43" cy="44" r="4.5" fill="#0F172A" />
          <path
            d="M43 50 L43 66 M43 54 L35 60 M43 54 L51 58 M43 66 L37 77 M43 66 L48 77"
            stroke="#0F172A"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="60" cy="49" r="3.8" fill="#0F172A" />
          <path
            d="M60 54 L60 67 M60 57 L53 60 M60 57 L66 62 M60 67 L55 77 M60 67 L65 77"
            stroke="#0F172A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case "keep_right":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
          <circle cx="50" cy="50" r="44" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="3" />
          <line x1="34" y1="34" x2="66" y2="66" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
          <polyline
            points="48,66 66,66 66,48"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}
