"use client";

import { useId } from "react";

/**
 * The AP orbit mark: an A–P ligature (the A's right leg is the P's stem) in the aurora gradient,
 * crossed by an orbit whose satellite echoes the site's pulsing "available" dot.
 * Same geometry as /public/brand/logo.svg, tuned with heavier strokes for small sizes.
 */
export function LogoMark({ className = "size-8", title }: { className?: string; title?: string }) {
  const raw = useId();
  const id = raw.replace(/[^a-zA-Z0-9_-]/g, "");
  const ink = `${id}-ink`;
  const ring = `${id}-ring`;
  const glowA = `${id}-ga`;
  const glowB = `${id}-gb`;
  const cut = `${id}-cut`;
  const clip = `${id}-clip`;
  const orbit = "M42 268 A214 64 0 0 0 470 268";

  return (
    <svg viewBox="0 0 512 512" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <defs>
        <linearGradient id={ink} x1="138" y1="400" x2="392" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#10B981" />
          <stop offset="0.5" stopColor="#22D3EE" />
          <stop offset="1" stopColor="#A78BFA" />
        </linearGradient>
        <linearGradient id={ring} x1="42" y1="0" x2="470" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FAFAFA" stopOpacity="0.4" />
          <stop offset="0.55" stopColor="#E0F2FE" stopOpacity="0.95" />
          <stop offset="1" stopColor="#10B981" />
        </linearGradient>
        <radialGradient id={glowA} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(96 84) scale(320)">
          <stop offset="0" stopColor="#10B981" stopOpacity="0.6" />
          <stop offset="1" stopColor="#10B981" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={glowB} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(400 500) scale(320)">
          <stop offset="0" stopColor="#A78BFA" stopOpacity="0.55" />
          <stop offset="1" stopColor="#A78BFA" stopOpacity="0" />
        </radialGradient>
        <mask id={cut} maskUnits="userSpaceOnUse" x="0" y="0" width="512" height="512">
          <rect width="512" height="512" fill="#fff" />
          <path d={orbit} transform="rotate(-16 256 268)" fill="none" stroke="#000" strokeWidth="44" />
        </mask>
        <clipPath id={clip}>
          <rect width="512" height="512" rx="116" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clip})`}>
        <rect width="512" height="512" fill="#09090B" />
        <rect width="512" height="512" fill={`url(#${glowA})`} />
        <rect width="512" height="512" fill={`url(#${glowB})`} />
        <path
          mask={`url(#${cut})`}
          d="M138 396 L252 124 L252 396 M252 124 H300 C360 124 392 160 392 208 C392 256 360 292 300 292 H252"
          fill="none"
          stroke={`url(#${ink})`}
          strokeWidth="58"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <g transform="rotate(-16 256 268)">
          <path d={orbit} fill="none" stroke={`url(#${ring})`} strokeWidth="20" strokeLinecap="round" />
          <circle cx="431" cy="305" r="40" fill="#10B981" opacity="0.45" className="logo-pulse" />
          <circle cx="431" cy="305" r="26" fill="#10B981" />
          <circle cx="431" cy="305" r="11" fill="#ECFDF5" />
        </g>
      </g>
      <rect x="2" y="2" width="508" height="508" rx="114" fill="none" stroke="#fff" strokeOpacity="0.12" strokeWidth="4" />
    </svg>
  );
}
