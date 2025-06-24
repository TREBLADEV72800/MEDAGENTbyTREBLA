import { useState, useCallback } from 'react';

export const useAnnounce = () => {
  const [announcement, setAnnouncement] = useState('');

  const announce = useCallback((message, politeness = 'polite') => {
    setAnnouncement(''); // Reset per forzare l'aggiornamento
    setTimeout(() => {
      setAnnouncement(message);
    }, 10);
  }, []);

  const clearAnnouncement = useCallback(() => {
    setAnnouncement('');
  }, []);

  return { announcement, announce, clearAnnouncement };
};