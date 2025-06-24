import React from 'react';
import { cn } from '../../lib/utils';

const SkipLink = ({ href = "#main-content", children = "Salta al contenuto principale", className, ...props }) => {
  return (
    <a
      href={href}
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
};

export { SkipLink };