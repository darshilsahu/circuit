import { brandTrace } from '@/lib/brand';

export function BrandMark({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Circuit"
    >
      <rect width="64" height="64" rx="13" fill="#75aff2" />
      <path
        d={brandTrace}
        fill="none"
        stroke="#10243f"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="43" cy="18.5" r="3.25" fill="#10243f" />
      <circle cx="43" cy="18.5" r="1.25" fill="#ddebff" />
    </svg>
  );
}
