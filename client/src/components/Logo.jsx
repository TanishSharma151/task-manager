export default function Logo({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ borderRadius: '12px', flexShrink: 0 }}
    >
      <rect width="80" height="80" rx="18" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
      <line x1="18" y1="42" x2="32" y2="56" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <line x1="32" y1="56" x2="62" y2="22" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <line x1="24" y1="28" x2="50" y2="28" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="24" y1="36" x2="42" y2="36" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}