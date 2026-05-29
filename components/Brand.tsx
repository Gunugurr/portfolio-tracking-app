interface BrandProps {
  size?: "sm" | "lg";
  animate?: boolean;
}

export default function Brand({ size = "lg", animate = true }: BrandProps) {
  const iconW    = size === "lg" ? 34 : 22;
  const iconH    = size === "lg" ? 30 : 20;
  const fontSize = size === "lg" ? "2.15rem" : "1.35rem";
  const gap      = size === "lg" ? 10 : 7;

  return (
    <div className="flex items-center" style={{ gap }}>
      {/* logo — z-index üstte, metni örter */}
      <div style={{ position: "relative", zIndex: 2, flexShrink: 0 }}>
        <svg
          width={iconW}
          height={iconH}
          viewBox="0 0 34 30"
          fill="none"
          aria-hidden
          style={{ color: "var(--color-orange)", display: "block" }}
        >
          {/* logonun arkasına giren metni gizleyen dolgu */}
          <rect width="34" height="30" fill="var(--color-bg)" rx="2" />
          {/* bar 1 */}
          <rect x="0"  y="18" width="9" height="12" rx="2" fill="currentColor" opacity="0.5"  />
          {/* bar 2 */}
          <rect x="12" y="10" width="9" height="20" rx="2" fill="currentColor" opacity="0.75" />
          {/* bar 3 */}
          <rect x="24" y="2"  width="9" height="28" rx="2" fill="currentColor" />
          {/* trend çizgisi */}
          <path
            d="M4.5 18 L16.5 10 L28.5 2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.3"
            fill="none"
          />
          {/* ok ucu */}
          <path
            d="M24 2 L30 2 L30 8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.55"
            fill="none"
          />
        </svg>
      </div>

      {/* metin — overflow:hidden ile logo kenarında cliplenme */}
      <div style={{ overflow: "hidden", position: "relative", zIndex: 1 }}>
        <span
          className={animate ? "brand-text" : undefined}
          style={{
            fontFamily:    "var(--font-bebas)",
            fontSize,
            letterSpacing: size === "lg" ? "0.06em" : "0.04em",
            lineHeight:    1,
            color:         "var(--color-text)",
            whiteSpace:    "nowrap",
          }}
        >
          PORTFÖY
        </span>
      </div>
    </div>
  );
}
