import { FC, ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  containerId: string;
}

export const Portal: FC<PortalProps> = ({ children, containerId }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Create portal container if it doesn't exist
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      // Add any default styles needed for the container
      container.style.position = 'relative';
      container.style.zIndex = '50';
      document.body.appendChild(container);
    }

    return () => {
      // Clean up container if it's empty when this portal is unmounted
      const container = document.getElementById(containerId);
      if (container && container.childNodes.length === 0) {
        document.body.removeChild(container);
      }
    };
  }, [containerId]);

  // Hydration safety: only render on client-side
  if (!mounted) return null;

  // Get or create container element
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    document.body.appendChild(container);
  }

  return createPortal(children, container);
};

// Helper function to ensure portal container exists
export const ensurePortalContainer = (containerId: string): HTMLElement => {
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    container.style.position = 'relative';
    container.style.zIndex = '50';
    document.body.appendChild(container);
  }
  return container;
};

// Helper function to remove portal container if empty
export const cleanupPortalContainer = (containerId: string): void => {
  const container = document.getElementById(containerId);
  if (container && container.childNodes.length === 0) {
    document.body.removeChild(container);
  }
};

// Example usage:
// <Portal containerId="modal-root">
//   <Modal>Modal content</Modal>
// </Portal>

// <Portal containerId="tooltip-root">
//   <Tooltip>Tooltip content</Tooltip>
// </Portal>

// <Portal containerId="notification-root">
//   <Notification>Notification content</Notification>
// </Portal>

export default Portal;
