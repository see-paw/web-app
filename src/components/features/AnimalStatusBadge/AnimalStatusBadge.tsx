import styles from "./AnimalStatusBadge.module.css";

/**
 * Animal state enum matching backend values
 */
export type AnimalState =
    | "Available"
    | "PartiallyFostered"
    | "TotallyFostered"
    | "HasOwner";

/**
 * Props for the AnimalStatusBadge component
 *
 * @interface AnimalStatusBadgeProps
 * @property {AnimalState} status - The current state of the animal
 * @property {'sm' | 'md' | 'lg'} [size='md'] - Optional size variant for the badge
 */
interface AnimalStatusBadgeProps {
    status: AnimalState;
    size?: 'sm' | 'md' | 'lg';
}

/**
 * Status configuration mapping for labels and CSS classes
 */
const STATUS_CONFIG = {
    Available: {
        label: 'Disponível',
        className: styles.statusAvailable
    },
    PartiallyFostered: {
        label: 'Parcialmente Apadrinhado',
        className: styles.statusPartiallyFostered
    },
    TotallyFostered: {
        label: 'Totalmente Apadrinhado',
        className: styles.statusTotallyFostered
    },
    HasOwner: {
        label: 'Adotado',
        className: styles.statusHasOwner
    }
} as const;

/**
 * AnimalStatusBadge component that displays the current status of an animal.
 *
 * @component
 * @param {AnimalStatusBadgeProps} props - The component props
 * @param {AnimalState} props.status - The animal's current state
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Optional size variant
 * @returns {JSX.Element} A styled badge showing the animal's status
 *
 * @description
 * This component displays a status badge with:
 * - Color-coded backgrounds based on status
 * - Portuguese labels for each status
 * - Three size variants (sm, md, lg)
 * - Blur effect backdrop for modern look
 * - Proper accessibility with data attributes
 *
 * Status Types:
 * - Available: Green - Animal is available for adoption/fostering
 * - PartiallyFostered: Orange - Animal has partial sponsorship
 * - TotallyFostered: Pink - Animal has full sponsorship coverage
 * - HasOwner: Gray - Animal has been adopted
 *
 * @example
 * // Default size (medium)
 * <AnimalStatusBadge status="Available" />
 *
 * @example
 * // Small size for compact displays
 * <AnimalStatusBadge status="HasOwner" size="sm" />
 *
 * @example
 * // Large size for prominent display
 * <AnimalStatusBadge status="TotallyFostered" size="lg" />
 */
function AnimalStatusBadge({ status, size = 'md' }: AnimalStatusBadgeProps) {
    const config = STATUS_CONFIG[status];

    if (!config) {
        return null;
    }

    const sizeClass = styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}`];

    return (
        <span
            className={`${styles.badge} ${config.className} ${sizeClass}`}
            data-testid="animal-status-badge"
            data-status={status}
        >
            {config.label}
        </span>
    );
}

export default AnimalStatusBadge;