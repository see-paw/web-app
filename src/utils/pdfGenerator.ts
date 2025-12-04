import jsPDF from "jspdf";
import type { Receipt } from "./receiptGenerator";
import { formatReceiptDate } from "./receiptGenerator";

/**
 * Generates a PDF receipt for an ownership request.
 * 
 * @param receipt - Receipt data to generate PDF
 * 
 * @example
 * generateReceiptPDF(receipt);
 * // Downloads a PDF file: "Recibo_Janeiro_2025.pdf"
 */
export function generateReceiptPDF(receipt: Receipt): void {
    // Create new PDF document (A4 format)
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const leftMargin = 20;
    const rightMargin = pageWidth - 20;
    const contentWidth = rightMargin - leftMargin;
    
    let yPosition = 20;

    // ========== HEADER ==========
    
    // Logo text (SeePaw)
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(219, 39, 119); // Pink color
    doc.text("SeePaw", leftMargin, yPosition);
    
    yPosition += 15;
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text("Recibo de Adoção", leftMargin, yPosition);
    
    yPosition += 3;
    
    // Horizontal line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(leftMargin, yPosition, rightMargin, yPosition);
    
    yPosition += 10;

    // ========== RECEIPT INFO ==========
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    
    // Receipt number
    doc.text(`Número: ${receipt.receiptNumber}`, leftMargin, yPosition);
    
    // Date (right aligned)
    const dateText = `Data: ${formatReceiptDate(receipt.date)}`;
    const dateWidth = doc.getTextWidth(dateText);
    doc.text(dateText, rightMargin - dateWidth, yPosition);
    
    yPosition += 7;
    
    // Period
    doc.text(`Período: ${receipt.month}`, leftMargin, yPosition);
    
    yPosition += 15;

    // ========== ANIMAL & OWNER SECTION ==========
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Dados da Adoção", leftMargin, yPosition);
    
    yPosition += 8;
    
    // Box background
    doc.setFillColor(248, 250, 252);
    doc.rect(leftMargin, yPosition - 5, contentWidth, 25, "F");
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    
    // Animal
    doc.setFont("helvetica", "bold");
    doc.text("Animal:", leftMargin + 5, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(receipt.animalName, leftMargin + 25, yPosition);
    
    yPosition += 7;
    
    // Owner
    doc.setFont("helvetica", "bold");
    doc.text("Adotante:", leftMargin + 5, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(receipt.ownerName, leftMargin + 25, yPosition);
    
    yPosition += 7;
    
    // Amount (highlighted)
    doc.setFont("helvetica", "bold");
    doc.text("Valor Mensal:", leftMargin + 5, yPosition);
    doc.setFontSize(14);
    doc.setTextColor(37, 99, 235); // Blue color
    doc.text(`${receipt.amount}€`, leftMargin + 35, yPosition);
    
    yPosition += 18;

    // ========== PAYMENT INFO SECTION ==========
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Informação de Pagamento", leftMargin, yPosition);
    
    yPosition += 8;
    
    // Box background
    doc.setFillColor(248, 250, 252);
    doc.rect(leftMargin, yPosition - 5, contentWidth, 20, "F");
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    
    // Payment method
    doc.setFont("helvetica", "bold");
    doc.text("Método:", leftMargin + 5, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(receipt.paymentMethod, leftMargin + 25, yPosition);
    
    yPosition += 7;
    
    // IBAN
    doc.setFont("helvetica", "bold");
    doc.text("IBAN:", leftMargin + 5, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(receipt.iban, leftMargin + 25, yPosition);
    
    yPosition += 18;

    // ========== STATUS ==========
    
    // Success box
    doc.setFillColor(220, 252, 231); // Light green
    doc.setDrawColor(34, 197, 94); // Green border
    doc.setLineWidth(0.5);
    doc.rect(leftMargin, yPosition - 5, contentWidth, 12, "FD");
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(22, 163, 74); // Green text
    doc.text("✓ Pagamento Processado com Sucesso", leftMargin + 5, yPosition);
    
    yPosition += 20;

    // ========== FOOTER NOTE ==========
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(120, 120, 120);
    
    const footerText = "Este é um recibo automático gerado pelo sistema SeePaw.";
    const footerWidth = doc.getTextWidth(footerText);
    doc.text(footerText, (pageWidth - footerWidth) / 2, yPosition);
    
    yPosition += 5;
    
    const footerText2 = "Para mais informações, contacte o seu abrigo.";
    const footerWidth2 = doc.getTextWidth(footerText2);
    doc.text(footerText2, (pageWidth - footerWidth2) / 2, yPosition);

    // ========== BOTTOM LINE ==========
    
    const bottomY = doc.internal.pageSize.getHeight() - 20;
    doc.setDrawColor(200, 200, 200);
    doc.line(leftMargin, bottomY, rightMargin, bottomY);
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150);
    
    const bottomText = "SeePaw - Sistema de Gestão de Abrigos";
    const bottomWidth = doc.getTextWidth(bottomText);
    doc.text(bottomText, (pageWidth - bottomWidth) / 2, bottomY + 5);

    // ========== SAVE PDF ==========
    
    const fileName = `Recibo_${receipt.month.replace(" ", "_")}.pdf`;
    doc.save(fileName);
}