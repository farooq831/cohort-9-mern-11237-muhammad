import { useEffect, useRef } from 'react';

const useFocusTrap = (isOpen) => {
  const containerRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    previouslyFocused.current = document.activeElement;

    const container = containerRef.current;
    const focusableSelector =
      'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])';

    const focusables = container
      ? Array.from(container.querySelectorAll(focusableSelector))
      : [];

    if (focusables.length > 0) {
      focusables[0].focus();
    }

    const handleKeyDown = (event) => {
      if (event.key !== 'Tab' || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      const fallback = previouslyFocused.current;
      if (fallback && fallback.isConnected) {
        fallback.focus();
      } else {
        document.body.focus();
      }
    };
  }, [isOpen]);

  return containerRef;
};

export default useFocusTrap;