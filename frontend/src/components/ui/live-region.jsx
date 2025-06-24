import React, { useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

const LiveRegion = ({ 
  children, 
  politeness = 'polite', 
  atomic = false,
  className,
  ...props 
}) => {
  const regionRef = useRef(null);

  useEffect(() => {
    if (regionRef.current && children) {
      // Forza l'aggiornamento per screen reader
      const content = regionRef.current.textContent;
      regionRef.current.textContent = '';
      setTimeout(() => {
        regionRef.current.textContent = content;
      }, 10);
    }
  }, [children]);

  return (
    <div
      ref={regionRef}
      aria-live={politeness}
      aria-atomic={atomic}
      className={cn("sr-only", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export { LiveRegion };