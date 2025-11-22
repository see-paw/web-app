import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
    children: ReactNode;
    /**
     * The ID of the DOM element where the portal content will be mounted.
     * If the container does not exist, it will be created dynamically.
     *
     * @default 'portal-root'
     */
    containerId?: string;
}

/**
 * Portal Component
 *
 * This component renders its children into a DOM node that exists
 * outside the parent component hierarchy. It uses ReactDOM.createPortal
 * to "teleport" elements to a target container, usually placed at the
 * end of the <body>.
 *
 * Portals are commonly used for:
 *  - Modals and dialogs
 *  - Tooltips and popovers
 *  - Dropdowns
 *  - Overlays
 *
 * They ensure proper rendering above all stacking contexts and avoid
 * issues with overflow:hidden or z-index limitations within the app.
 *
 * This component:
 *  - Ensures SSR safety (no DOM access until mounted)
 *  - Creates the portal container dynamically if it doesn't exist
 *  - Cleans up empty containers when unmounted
 *
 * @param {PortalProps} props - Component props
 * @param {ReactNode} props.children - Content to render in the portal
 * @param {string} [props.containerId='portal-root'] - ID of the portal container element
 * @returns {JSX.Element | null} Portal content or null if not mounted
 */
export default function Portal({ children, containerId = 'portal-root' }: PortalProps) {
    // Tracks whether the component is mounted (important for SSR safety)
    const [mounted, setMounted] = useState(false);
    // Reference to the portal container DOM element
    const [container, setContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
        // Mark component as mounted — prevents SSR mismatches
        setMounted(true);

        // Try to find an existing portal container
        let portalContainer = document.getElementById(containerId);

        // Create container if it does not exist
        if (!portalContainer) {
            portalContainer = document.createElement('div');
            portalContainer.id = containerId;
            // Ensure the portal always renders above all UI layers
            portalContainer.style.position = 'relative';
            portalContainer.style.zIndex = '9999';
            document.body.appendChild(portalContainer);
        }

        setContainer(portalContainer);

        return () => {
            setMounted(false);
            // Cleanup:
            // If the container exists and has no children,
            // remove it to avoid leftover empty divs in <body>.
            if (portalContainer && portalContainer.childNodes.length === 0) {
                portalContainer.remove();
            }
        };
    }, [containerId]);

    /**
     * Prevent rendering on server or before the portal container exists.
     * This avoids:
     *  - SSR DOM access errors
     *  - Hydration mismatches
     */
    if (!mounted || !container) {
        return null;
    }

    // Render children into the portal container
    return createPortal(children, container);
}
