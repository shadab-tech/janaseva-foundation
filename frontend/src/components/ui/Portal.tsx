import { useEffect, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  containerId?: string;
}

export const Portal = ({ children, containerId = 'portal-root' }: PortalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Create portal container if it doesn't exist
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      document.body.appendChild(container);
    }

    return () => {
      // Clean up empty portal container on unmount
      const portalContainer = document.getElementById(containerId);
      if (portalContainer && !portalContainer.hasChildNodes()) {
        document.body.removeChild(portalContainer);
      }
    };
  }, [containerId]);

  // Only render after component is mounted to ensure client-side rendering
  if (!mounted) return null;

  // Get or create portal container
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    document.body.appendChild(container);
  }

  return createPortal(children, container);
};

// Modal Portal
export const ModalPortal = ({ children }: { children: ReactNode }) => (
  <Portal containerId="modal-root">{children}</Portal>
);

// Toast Portal
export const ToastPortal = ({ children }: { children: ReactNode }) => (
  <Portal containerId="toast-root">{children}</Portal>
);

// Tooltip Portal
export const TooltipPortal = ({ children }: { children: ReactNode }) => (
  <Portal containerId="tooltip-root">{children}</Portal>
);

// Dropdown Portal
export const DropdownPortal = ({ children }: { children: ReactNode }) => (
  <Portal containerId="dropdown-root">{children}</Portal>
);

// Context Menu Portal
export const ContextMenuPortal = ({ children }: { children: ReactNode }) => (
  <Portal containerId="context-menu-root">{children}</Portal>
);

// Popover Portal
export const PopoverPortal = ({ children }: { children: ReactNode }) => (
  <Portal containerId="popover-root">{children}</Portal>
);

// Dialog Portal
export const DialogPortal = ({ children }: { children: ReactNode }) => (
  <Portal containerId="dialog-root">{children}</Portal>
);

// Alert Portal
export const AlertPortal = ({ children }: { children: ReactNode }) => (
  <Portal containerId="alert-root">{children}</Portal>
);

// Notification Portal
export const NotificationPortal = ({ children }: { children: ReactNode }) => (
  <Portal containerId="notification-root">{children}</Portal>
);

// Loading Portal
export const LoadingPortal = ({ children }: { children: ReactNode }) => (
  <Portal containerId="loading-root">{children}</Portal>
);

export default Portal;
