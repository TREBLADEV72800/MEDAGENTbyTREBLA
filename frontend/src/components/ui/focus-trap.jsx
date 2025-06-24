import React, { useEffect, useRef } from 'react';

const FocusTrap = ({ children, active = true }) => {
  const containerRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    firstFocusableRef.current = focusableElements[0];
    lastFocusableRef.current = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusableRef.current) {
          lastFocusableRef.current.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableRef.current) {
          firstFocusableRef.current.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstFocusableRef.current.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [active]);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
};

export { FocusTrap };