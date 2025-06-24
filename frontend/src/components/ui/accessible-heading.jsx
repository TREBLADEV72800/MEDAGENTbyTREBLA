import React from 'react';
import { cn } from '../../lib/utils';

const AccessibleHeading = ({ 
  level = 1, 
  children, 
  className,
  id,
  'aria-label': ariaLabel,
  ...props 
}) => {
  const Tag = `h${level}`;
  const headingId = id || React.useId();
  
  return React.createElement(
    Tag,
    {
      id: headingId,
      className: cn(
        "scroll-mt-20", // Per compensare header fisso
        level === 1 && "text-4xl lg:text-5xl font-bold",
        level === 2 && "text-3xl lg:text-4xl font-bold",
        level === 3 && "text-2xl lg:text-3xl font-semibold",
        level === 4 && "text-xl lg:text-2xl font-semibold",
        level === 5 && "text-lg lg:text-xl font-medium",
        level === 6 && "text-base lg:text-lg font-medium",
        className
      ),
      'aria-label': ariaLabel,
      ...props
    },
    children
  );
};

export { AccessibleHeading };