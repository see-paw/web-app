import { useState, useEffect, useRef } from "react";
import Portal from "@/components/common/Portal/Portal";
import styles from "./ConfirmDialog.module.css";

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    showTextarea?: boolean;
    textareaLabel?: string;
    textareaPlaceholder?: string;
    onConfirm: (value?: string) => void;
    onCancel: () => void;
    variant?: "confirm" | "danger";
}

/**
 * ConfirmDialog component - Modern modal for confirmations with optional textarea.
 * 
 * @component
 * @description
 * Replaces browser's native confirm() and prompt() with a better UX.
 * 
 * Features:
 * - Optional textarea for input
 * - Customizable buttons and messages
 * - Click outside to close
 * - ESC key to close
 * - Focus management
 * 
 * @example
 * <ConfirmDialog
 *   isOpen={isOpen}
 *   title="Rejeitar Pedido"
 *   message="Tem certeza que deseja rejeitar este pedido?"
 *   showTextarea
 *   textareaLabel="Motivo da rejeição (opcional)"
 *   onConfirm={(reason) => handleReject(id, reason)}
 *   onCancel={() => setIsOpen(false)}
 *   variant="danger"
 * />
 */
function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    showTextarea = false,
    textareaLabel,
    textareaPlaceholder,
    onConfirm,
    onCancel,
    variant = "confirm"
}: ConfirmDialogProps) {
    const [textValue, setTextValue] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const dialogRef = useRef<HTMLDivElement>(null);

    /**
     * Focus textarea when dialog opens
     */
    useEffect(() => {
        if (isOpen && showTextarea && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isOpen, showTextarea]);

    /**
     * Reset textarea value when dialog closes
     */
    useEffect(() => {
        if (!isOpen) {
            setTextValue("");
        }
    }, [isOpen]);

    /**
     * Handle ESC key to close
     */
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onCancel();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onCancel]);

    /**
     * Handle click outside to close
     */
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
            onCancel();
        }
    };

    const handleConfirm = () => {
        onConfirm(showTextarea ? textValue : undefined);
        setTextValue("");
    };

    if (!isOpen) return null;

    return (
        <Portal>
            <div className={styles.backdrop} onClick={handleBackdropClick}>
                <div className={styles.dialog} ref={dialogRef}>
                    <div className={styles.header}>
                        <h2 className={styles.title}>{title}</h2>
                    </div>

                    <div className={styles.content}>
                        <p className={styles.message}>{message}</p>

                        {showTextarea && (
                            <div className={styles.textareaWrapper}>
                                {textareaLabel && (
                                    <label className={styles.textareaLabel}>
                                        {textareaLabel}
                                    </label>
                                )}
                                <textarea
                                    ref={textareaRef}
                                    className={styles.textarea}
                                    value={textValue}
                                    onChange={(e) => setTextValue(e.target.value)}
                                    placeholder={textareaPlaceholder}
                                    rows={4}
                                />
                            </div>
                        )}
                    </div>

                    <div className={styles.footer}>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={onCancel}
                        >
                            {cancelText}
                        </button>
                        <button
                            type="button"
                            className={`${styles.confirmButton} ${
                                variant === "danger" ? styles.dangerButton : ""
                            }`}
                            onClick={handleConfirm}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </Portal>
    );
}

export default ConfirmDialog;
