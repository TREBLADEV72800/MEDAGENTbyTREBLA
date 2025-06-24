import React from 'react';
import { SkipLink } from '../ui/skip-link';
import { LiveRegion } from '../ui/live-region';
import { useAnnounce } from '../../hooks/use-announce';

const AccessibleLayout = ({ children, announcement }) => {
  const { announcement: globalAnnouncement } = useAnnounce();

  return (
    <>
      <SkipLink />
      <LiveRegion politeness="polite">
        {announcement || globalAnnouncement}
      </LiveRegion>
      <div className="min-h-screen">
        {children}
      </div>
    </>
  );
};

export { AccessibleLayout };