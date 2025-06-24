import { useEffect, useCallback } from 'react';

export const useKeyboardNavigation = (items, onSelect, isOpen = true) => {
  const handleKeyDown = useCallback((event) => {
    if (!isOpen || !items.length) return;

    const currentIndex = items.findIndex(item => item.focused);
    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'ArrowUp':
        event.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        break;
      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        nextIndex = items.length - 1;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (currentIndex >= 0 && onSelect) {
          onSelect(items[currentIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        // Gestito dal componente padre
        break;
      default:
        return;
    }

    // Aggiorna il focus se necessario
    if (nextIndex !== currentIndex && nextIndex >= 0) {
      const nextElement = document.querySelector(`[data-index="${nextIndex}"]`);
      if (nextElement) {
        nextElement.focus();
      }
    }
  }, [items, onSelect, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, isOpen]);

  return handleKeyDown;
};