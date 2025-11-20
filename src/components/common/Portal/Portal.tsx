import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
    children: ReactNode;
    /**
     * ID do elemento onde o portal será montado
     * @default 'portal-root'
     */
    containerId?: string;
}

/**
 * Portal Component
 *
 * Renderiza children fora da hierarquia DOM do componente pai,
 * diretamente no body ou em um container específico.
 *
 * Útil para modais, tooltips, dropdowns e overlays que precisam
 * escapar do stacking context dos componentes pai.
 *
 * @example
 * ```tsx
 * <Portal>
 *   <Modal onClose={handleClose}>...</Modal>
 * </Portal>
 * ```
 */
export default function Portal({ children, containerId = 'portal-root' }: PortalProps) {
    const [mounted, setMounted] = useState(false);
    const [container, setContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setMounted(true);

        // Tenta encontrar o container existente
        let portalContainer = document.getElementById(containerId);

        // Se não existir, cria um
        if (!portalContainer) {
            portalContainer = document.createElement('div');
            portalContainer.id = containerId;
            portalContainer.style.position = 'relative';
            portalContainer.style.zIndex = '9999';
            document.body.appendChild(portalContainer);
        }

        setContainer(portalContainer);

        return () => {
            setMounted(false);

            // Cleanup: remove o container se estiver vazio
            if (portalContainer && portalContainer.childNodes.length === 0) {
                portalContainer.remove();
            }
        };
    }, [containerId]);

    // Não renderiza no servidor (SSR safety)
    if (!mounted || !container) {
        return null;
    }

    return createPortal(children, container);
}