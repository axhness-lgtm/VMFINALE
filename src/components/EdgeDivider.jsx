import React from 'react';

export default function EdgeDivider({ src, className = "" }) {
  const isStraddleEdge = src?.includes('/edge.png') || src?.endsWith('edge.png') || src?.includes('edge3.png');

  // 1. edge.png & edge3.png -> straddling directly centered across the transition seam line ("right on the edge")
  if (isStraddleEdge) {
    return (
      <div className={`w-full h-0 relative z-40 pointer-events-none select-none overflow-visible ${className}`}>
        <img 
          src={src} 
          alt="" 
          loading="lazy"
          decoding="async"
          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[103%] max-w-none h-auto block" 
        />
      </div>
    );
  }

  // 2. edge4.png & all other edges -> bottom edge sits exactly flush on top of the transition seam (with transparent padding completely removed)
  return (
    <div className={`w-full h-0 relative z-40 pointer-events-none select-none overflow-visible ${className}`}>
      <img 
        src={src} 
        alt="" 
        loading="lazy"
        decoding="async"
        className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[103%] max-w-none h-auto block" 
      />
    </div>
  );
}
