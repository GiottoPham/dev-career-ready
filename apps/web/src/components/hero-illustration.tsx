export function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 440 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-sm"
      aria-hidden="true"
    >
      <style>{`
        @keyframes flow { to { stroke-dashoffset: -16; } }
        .flow { animation: flow 1.2s linear infinite; }
      `}</style>

      {/* CV document */}
      <text x="5" y="55" fill="#78716c" fontSize="9" fontFamily="inherit">
        CV.PDF
      </text>
      <rect x="5" y="60" width="80" height="120" stroke="#fbbf24" strokeWidth="1" />
      <line x1="16" y1="82" x2="76" y2="82" stroke="#57534e" strokeWidth="1" />
      <line x1="16" y1="94" x2="60" y2="94" stroke="#57534e" strokeWidth="1" />
      <line x1="16" y1="106" x2="76" y2="106" stroke="#57534e" strokeWidth="1" />
      <line x1="16" y1="118" x2="48" y2="118" stroke="#57534e" strokeWidth="1" />
      <line x1="16" y1="130" x2="76" y2="130" stroke="#57534e" strokeWidth="1" />
      <line x1="16" y1="142" x2="65" y2="142" stroke="#57534e" strokeWidth="1" />
      <line x1="16" y1="154" x2="76" y2="154" stroke="#57534e" strokeWidth="1" />
      <line x1="16" y1="166" x2="42" y2="166" stroke="#57534e" strokeWidth="1" />

      {/* Connector: CV → AI */}
      <path
        d="M 85 120 L 152 120"
        stroke="#fbbf24"
        strokeWidth="1"
        strokeDasharray="4 2"
        className="flow"
      />
      <polygon points="151,116 162,120 151,124" fill="#fbbf24" />

      {/* AI Analysis box */}
      <rect x="162" y="90" width="90" height="60" stroke="#fbbf24" strokeWidth="1.5" />
      <text
        x="207"
        y="118"
        fill="#fbbf24"
        fontSize="18"
        fontWeight="bold"
        textAnchor="middle"
        fontFamily="inherit"
      >
        AI
      </text>
      <text
        x="207"
        y="134"
        fill="#78716c"
        fontSize="7.5"
        textAnchor="middle"
        letterSpacing="1.5"
        fontFamily="inherit"
      >
        ANALYSIS
      </text>

      {/* Connector: AI → distribution spine */}
      <path
        d="M 252 120 L 266 120"
        stroke="#fbbf24"
        strokeWidth="1"
        strokeDasharray="4 2"
        className="flow"
      />

      {/* Vertical spine */}
      <line x1="266" y1="71" x2="266" y2="191" stroke="#fbbf24" strokeWidth="0.75" />

      {/* Horizontal branches */}
      <line x1="266" y1="71" x2="276" y2="71" stroke="#fbbf24" strokeWidth="0.75" />
      <line x1="266" y1="111" x2="276" y2="111" stroke="#fbbf24" strokeWidth="0.75" />
      <line x1="266" y1="151" x2="276" y2="151" stroke="#78716c" strokeWidth="0.75" />
      <line x1="266" y1="191" x2="276" y2="191" stroke="#78716c" strokeWidth="0.75" />

      {/* Output: matched */}
      <rect x="276" y="60" width="152" height="22" stroke="#fbbf24" strokeWidth="1" />
      <text x="286" y="75" fill="#fbbf24" fontSize="9" fontFamily="inherit">
        React.js ✓
      </text>

      <rect x="276" y="100" width="152" height="22" stroke="#fbbf24" strokeWidth="1" />
      <text x="286" y="115" fill="#fbbf24" fontSize="9" fontFamily="inherit">
        TypeScript ✓
      </text>

      {/* Output: missing */}
      <rect
        x="276"
        y="140"
        width="152"
        height="22"
        stroke="#78716c"
        strokeWidth="1"
        strokeDasharray="3 2"
      />
      <text x="286" y="155" fill="#78716c" fontSize="9" fontFamily="inherit">
        Docker ✗
      </text>

      <rect
        x="276"
        y="180"
        width="152"
        height="22"
        stroke="#78716c"
        strokeWidth="1"
        strokeDasharray="3 2"
      />
      <text x="286" y="195" fill="#78716c" fontSize="9" fontFamily="inherit">
        Kubernetes ✗
      </text>
    </svg>
  )
}
