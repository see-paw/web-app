import type { OwnershipRequest } from "@/types/ownershipRequest";
import { OwnershipStatus } from "@/types/ownershipRequest";
import styles from "./OwnershipRequestsTable.module.css";

interface OwnershipRequestsTableProps {
    requests: OwnershipRequest[];
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    onAnalyze: (id: string) => void;
    onViewReceipts: (request: OwnershipRequest) => void;
    isLoading: boolean;
}

/**
 * Table component for displaying ownership requests with action buttons.
 * 
 * @component
 * @param {OwnershipRequestsTableProps} props - Component props
 * @returns {JSX.Element} A table with ownership requests and action buttons
 */
function OwnershipRequestsTable({
    requests,
    onApprove,
    onReject,
    onAnalyze,
    onViewReceipts,
    isLoading
}: OwnershipRequestsTableProps) {
    /**
     * Get CSS class for status badge based on ownership status
     */
    const getStatusClass = (status: string) => {
        switch (status) {
            case OwnershipStatus.Pending:
                return styles.statusPending;
            case OwnershipStatus.Analysing:
                return styles.statusAnalysing;
            case OwnershipStatus.Approved:
                return styles.statusApproved;
            case OwnershipStatus.Rejected:
                return styles.statusRejected;
            default:
                return "";
        }
    };

    /**
     * Get translated status label
     */
    const getStatusLabel = (status: string) => {
        switch (status) {
            case OwnershipStatus.Pending:
                return "Pendente";
            case OwnershipStatus.Analysing:
                return "Em Análise";
            case OwnershipStatus.Approved:
                return "Aprovado";
            case OwnershipStatus.Rejected:
                return "Rejeitado";
            default:
                return status;
        }
    };

    /**
     * Format date to Portuguese locale
     */
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("pt-PT", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Animal</th>
                        <th>Utilizador</th>
                        <th>Valor</th>
                        <th>Estado</th>
                        <th>Data</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((request) => (
                        <tr 
                            key={request.id}
                            className={request.status === OwnershipStatus.Approved ? styles.clickableRow : ""}
                            onClick={() => {
                                if (request.status === OwnershipStatus.Approved) {
                                    onViewReceipts(request);
                                }
                            }}
                            title={request.status === OwnershipStatus.Approved ? "Clique para ver recibos" : ""}
                        >
                            <td>{request.animalName}</td>
                            <td>{request.userName}</td>
                            <td>{request.amount}€</td>
                            <td>
                                <span
                                    className={`${styles.statusBadge} ${getStatusClass(
                                        request.status
                                    )}`}
                                >
                                    {getStatusLabel(request.status)}
                                </span>
                            </td>
                            <td>{formatDate(request.requestedAt)}</td>
                            <td>
                                <div className={styles.actions}>
                                    {request.status === OwnershipStatus.Pending && (
                                        <>
                                            <button
                                                className={`${styles.actionButton} ${styles.analyzeButton}`}
                                                onClick={() => onAnalyze(request.id)}
                                                disabled={isLoading}
                                            >
                                                Analisar
                                            </button>
                                            <button
                                                className={`${styles.actionButton} ${styles.approveButton}`}
                                                onClick={() => onApprove(request.id)}
                                                disabled={isLoading}
                                            >
                                                Aprovar
                                            </button>
                                            <button
                                                className={`${styles.actionButton} ${styles.rejectButton}`}
                                                onClick={() => onReject(request.id)}
                                                disabled={isLoading}
                                            >
                                                Rejeitar
                                            </button>
                                        </>
                                    )}
                                    {request.status === OwnershipStatus.Analysing && (
                                        <>
                                            <button
                                                className={`${styles.actionButton} ${styles.approveButton}`}
                                                onClick={() => onApprove(request.id)}
                                                disabled={isLoading}
                                            >
                                                Aprovar
                                            </button>
                                            <button
                                                className={`${styles.actionButton} ${styles.rejectButton}`}
                                                onClick={() => onReject(request.id)}
                                                disabled={isLoading}
                                            >
                                                Rejeitar
                                            </button>
                                        </>
                                    )}
                                    {request.status === OwnershipStatus.Approved && (
                                        <span className={styles.noActions}>Finalizado</span>
                                    )}
                                    {request.status === OwnershipStatus.Rejected && (
                                        <button
                                            className={`${styles.actionButton} ${styles.analyzeButton}`}
                                            onClick={() => onAnalyze(request.id)}
                                            disabled={isLoading}
                                        >
                                            Reabrir para Análise
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default OwnershipRequestsTable;
