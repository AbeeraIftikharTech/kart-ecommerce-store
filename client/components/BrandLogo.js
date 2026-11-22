'use client';
import { useState } from 'react';

/* Shows /public/brands/<slug>.svg when it exists, otherwise a coloured monogram. */
export default function BrandLogo({ b }) {
  const [failed, setFailed] = useState(false);
  if (!failed) return <img className="logo-img" src={`/brands/${b.slug}.svg`} alt={`${b.name} logo`} onError={() => setFailed(true)} />;
  return <span className="mono" style={{ background: b.color + '1A', color: b.color }}>{b.short}</span>;
}
