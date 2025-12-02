import Portal from "@/components/common/Portal/Portal";
import { useEffect, useRef } from "react";
import type { Receipt } from "@/utils/receiptGenerator";
import { formatReceiptDate } from "@/utils/receiptGenerator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faFileInvoice } from "@fortawesome/free-solid-svg-icons";
import styles from "./ReceiptsModal.module.css";

interface ReceiptsModalProps {
    isOpen: boolean;
    receipts: Receipt[];
    onClose: () => void;
    onDownloadPDF: (receipt: Receipt) => void;
}

/**
 * ReceiptsModal component - displays list of receipts for an ownership request.
 * 
 * @component
 * @description
 * Shows a modal with all generated receipts for an approved ownership request.
 * Each receipt can be downloaded as PDF.
 * 
 * @example
 * <ReceiptsModal
 *   isOpen={isOpen}
 *   receipts={mockReceipts}
 *   onClose={() => setIsOpen(false)}
 *   onDownloadPDF={(receipt) => generatePDF(receipt)}
 * />
 */
function ReceiptsModal({
    isOpen,
    receipts,
    onClose,
    onDownloadPDF
}: ReceiptsModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    /**
     * Handle ESC key to close
     */
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    /**
     * Handle click outside to close
     */
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <Portal>
            <div className={styles.backdrop} onClick={handleBackdropClick}>
                <div className={styles.modal} ref={modalRef}>
                    <div className={styles.header}>
                        <h2 className={styles.title}>
                            <FontAwesomeIcon icon={faFileInvoice} className={styles.titleIcon} />
                            Recibos de Adoção
                        </h2>
                        <button
                            type="button"
                            className={styles.closeButton}
                            onClick={onClose}
                            aria-label="Fechar"
                        >
                            ×
                        </button>
                    </div>

                    <div className={styles.content}>
                        {receipts.length === 0 ? (
                            <p className={styles.emptyState}>
                                Nenhum recibo disponível
                            </p>
                        ) : (
                            <div className={styles.receiptsList}>
                                {receipts.map((receipt) => (
                                    <div key={receipt.id} className={styles.receiptItem}>
                                        <div className={styles.receiptIcon}>
                                            <FontAwesomeIcon icon={faFileInvoice} />
                                        </div>
                                        <div className={styles.receiptInfo}>
                                            <h3 className={styles.receiptMonth}>
                                                Recibo {receipt.month}
                                            </h3>
                                            <div className={styles.receiptDetails}>
                                                <span className={styles.receiptAmount}>
                                                    {receipt.amount}€
                                                </span>
                                                <span className={styles.receiptDate}>
                                                    Data: {formatReceiptDate(receipt.date)}
                                                </span>
                                                <span className={styles.receiptNumber}>
                                                    Nº {receipt.receiptNumber}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            className={styles.downloadButton}
                                            onClick={() => onDownloadPDF(receipt)}
                                            title="Download PDF"
                                        >
                                            <FontAwesomeIcon icon={faDownload} />
                                            <span>PDF</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={styles.footer}>
                        <button
                            type="button"
                            className={styles.closeFooterButton}
                            onClick={onClose}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </Portal>
    );
}

export default ReceiptsModal;
