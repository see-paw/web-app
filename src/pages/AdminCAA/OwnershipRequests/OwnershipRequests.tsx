import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { ownershipRequestsApi } from "@/api/ownershipRequests";
import type { PagedList } from "@/types/pagedList";
import type { OwnershipRequest } from "@/types/ownershipRequest";
import { NotificationType } from "@/types/notification";
import Pagination from "@/components/common/Pagination/Pagination";
import OwnershipRequestsTable from "./components/OwnershipRequestsTable";
import ConfirmDialog from "@/components/common/ConfirmDialog/ConfirmDialog";
import ReceiptsModal from "@/components/features/ReceiptsModal/ReceiptsModal";
import { useSignalR } from "@/hooks/useSignalR";
import { generateMockReceipts, type Receipt } from "@/utils/receiptGenerator";
import { generateReceiptPDF } from "@/utils/pdfGenerator";
import styles from "./OwnershipRequests.module.css";
import toast from "react-hot-toast";

/**
 * Query key factory for ownership requests
 */
export const ownershipRequestsQueryKey = (pageNumber: string) => [
    "ownershipRequests",
    pageNumber
];

/**
 * OwnershipRequests page component for AdminCAA users.
 * 
 * @component
 * @description
 * Displays a paginated table of ownership requests for animals in the admin's shelter.
 * Provides actions to approve, reject, or update request status to analyzing.
 * 
 * Features:
 * - Paginated list with URL-based page tracking
 * - Real-time actions (approve, reject, analyze)
 * - Optimistic UI updates with automatic cache invalidation
 * - Loading and error states
 * 
 * @returns {JSX.Element} The ownership requests management page
 */
function OwnershipRequests() {
    const [searchParams] = useSearchParams();
    const page = searchParams.get("page") ?? "1";
    const queryClient = useQueryClient();

    // Modal state management
    const [dialogState, setDialogState] = useState<{
        isOpen: boolean;
        type: "approve" | "reject" | "analyze" | null;
        requestId: string | null;
    }>({
        isOpen: false,
        type: null,
        requestId: null
    });

    // Receipts modal state
    const [receiptsModalState, setReceiptsModalState] = useState<{
        isOpen: boolean;
        receipts: Receipt[];
    }>({
        isOpen: false,
        receipts: []
    });

    // SignalR connection for real-time notifications
    const { onNotification } = useSignalR();

    /**
     * Subscribe to SignalR notifications
     * Invalidates queries when new ownership requests arrive
     */
    useEffect(() => {
        const cleanup = onNotification?.((notification) => {
            // Invalidate ownership requests query on new request notifications
            if (notification.type === NotificationType.NEW_OWNERSHIP_REQUEST) {
                queryClient.invalidateQueries({ queryKey: ["ownershipRequests"] });
                toast.success("Novo pedido de adoção recebido!");
            }
        });

        return cleanup;
    }, [onNotification, queryClient]);

    /**
     * Fetch paginated ownership requests
     */
    const {
        data: pagedRequests,
        isLoading,
        isError,
        error
    } = useQuery<PagedList<OwnershipRequest>>({
        queryKey: ownershipRequestsQueryKey(page),
        queryFn: ({ signal }) =>
            ownershipRequestsApi.getOwnershipRequests({
                pageNumber: parseInt(page, 10),
                signal
            })
    });

    /**
     * Mutation for approving ownership requests
     */
    const approveMutation = useMutation({
        mutationFn: (id: string) => ownershipRequestsApi.approve({ id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ownershipRequests"] });
            toast.success("Pedido aprovado com sucesso!");
        },
        onError: (error: Error) => {
            toast.error(`Erro ao aprovar: ${error.message}`);
        }
    });

    /**
     * Mutation for rejecting ownership requests
     */
    const rejectMutation = useMutation({
        mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
            ownershipRequestsApi.reject({ id, rejectionReason: reason }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ownershipRequests"] });
            toast.success("Pedido rejeitado.");
        },
        onError: (error: Error) => {
            toast.error(`Erro ao rejeitar: ${error.message}`);
        }
    });

    /**
     * Mutation for updating status to "Analysing"
     */
    const analyzeMutation = useMutation({
        mutationFn: ({ id, requestInfo }: { id: string; requestInfo?: string }) =>
            ownershipRequestsApi.updateToAnalysing({ id, requestInfo }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ownershipRequests"] });
            toast.success("Pedido em análise.");
        },
        onError: (error: Error) => {
            toast.error(`Erro ao atualizar: ${error.message}`);
        }
    });

    /**
     * Handle approve action - opens confirm dialog
     */
    const handleApprove = (id: string) => {
        setDialogState({ isOpen: true, type: "approve", requestId: id });
    };

    /**
     * Handle reject action - opens dialog with textarea
     */
    const handleReject = (id: string) => {
        setDialogState({ isOpen: true, type: "reject", requestId: id });
    };

    /**
     * Handle analyze action - opens dialog with textarea
     */
    const handleAnalyze = (id: string) => {
        setDialogState({ isOpen: true, type: "analyze", requestId: id });
    };

    /**
     * Handle dialog confirmation
     */
    const handleDialogConfirm = (value?: string) => {
        if (!dialogState.requestId) return;

        const id = dialogState.requestId;

        switch (dialogState.type) {
            case "approve":
                approveMutation.mutate(id);
                break;
            case "reject":
                rejectMutation.mutate({ id, reason: value || undefined });
                break;
            case "analyze":
                analyzeMutation.mutate({ id, requestInfo: value || undefined });
                break;
        }

        setDialogState({ isOpen: false, type: null, requestId: null });
    };

    /**
     * Handle dialog cancellation
     */
    const handleDialogCancel = () => {
        setDialogState({ isOpen: false, type: null, requestId: null });
    };

    /**
     * Handle view receipts for approved ownership request
     */
    const handleViewReceipts = (request: OwnershipRequest) => {
        // Use updatedAt as approval date, fallback to current date if null
        const approvalDate = request.updatedAt || new Date().toISOString();
        
        // Generate mock receipts based on approval date
        const receipts = generateMockReceipts(
            approvalDate,
            request.amount,
            request.animalName,
            request.userName
        );

        setReceiptsModalState({
            isOpen: true,
            receipts: receipts
        });
    };

    /**
     * Handle download PDF for a receipt
     */
    const handleDownloadPDF = (receipt: Receipt) => {
        generateReceiptPDF(receipt);
        toast.success("Recibo descarregado!");
    };

    /**
     * Handle close receipts modal
     */
    const handleCloseReceiptsModal = () => {
        setReceiptsModalState({
            isOpen: false,
            receipts: []
        });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Pedidos de Adoção</h1>
                </div>
                <div className={styles.content}>
                    <p className={styles.loading}>A carregar pedidos...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Pedidos de Adoção</h1>
                </div>
                <div className={styles.content}>
                    <div className={styles.error}>
                        <h2>Erro ao carregar pedidos</h2>
                        <p>{error.message}</p>
                    </div>
                </div>
            </div>
        );
    }

    const isEmpty = !pagedRequests?.items || pagedRequests.items.length === 0;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Pedidos de Adoção</h1>
                {pagedRequests && (
                    <p className={styles.subtitle}>
                        {pagedRequests.totalCount}{" "}
                        {pagedRequests.totalCount === 1 ? "pedido" : "pedidos"} no total
                    </p>
                )}
            </div>

            <div className={styles.content}>
                {isEmpty ? (
                    <p className={styles.emptyState}>Nenhum pedido de adoção encontrado</p>
                ) : (
                    <OwnershipRequestsTable
                        requests={pagedRequests.items}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        onAnalyze={handleAnalyze}
                        onViewReceipts={handleViewReceipts}
                        isLoading={
                            approveMutation.isPending ||
                            rejectMutation.isPending ||
                            analyzeMutation.isPending
                        }
                    />
                )}
            </div>

            {pagedRequests && pagedRequests.totalPages > 1 && (
                <Pagination
                    currentPage={pagedRequests.currentPage}
                    totalPages={pagedRequests.totalPages}
                />
            )}

            {/* Confirmation Dialog */}
            <ConfirmDialog
                isOpen={dialogState.isOpen}
                title={
                    dialogState.type === "approve"
                        ? "Aprovar Pedido"
                        : dialogState.type === "reject"
                        ? "Rejeitar Pedido"
                        : "Analisar Pedido"
                }
                message={
                    dialogState.type === "approve"
                        ? "Tem certeza que deseja aprovar este pedido de adoção?"
                        : dialogState.type === "reject"
                        ? "Tem certeza que deseja rejeitar este pedido?"
                        : "Alterar o estado do pedido para 'Em Análise'?"
                }
                confirmText={
                    dialogState.type === "approve"
                        ? "Aprovar"
                        : dialogState.type === "reject"
                        ? "Rejeitar"
                        : "Confirmar"
                }
                cancelText="Cancelar"
                showTextarea={dialogState.type === "reject" || dialogState.type === "analyze"}
                textareaLabel={
                    dialogState.type === "reject"
                        ? "Motivo da rejeição (opcional)"
                        : "Informação adicional (opcional)"
                }
                textareaPlaceholder={
                    dialogState.type === "reject"
                        ? "Ex: Documentação incompleta, perfil não adequado..."
                        : "Ex: Aguardar verificação de referências..."
                }
                onConfirm={handleDialogConfirm}
                onCancel={handleDialogCancel}
                variant={dialogState.type === "reject" ? "danger" : "confirm"}
            />

            {/* Receipts Modal */}
            <ReceiptsModal
                isOpen={receiptsModalState.isOpen}
                receipts={receiptsModalState.receipts}
                onClose={handleCloseReceiptsModal}
                onDownloadPDF={handleDownloadPDF}
            />
        </div>
    );
}

export default OwnershipRequests;
