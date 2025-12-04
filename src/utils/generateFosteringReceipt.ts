import jsPDF from "jspdf";

/**
 * Generates and downloads a fostering receipt PDF.
 *
 * @param data Object containing all necessary info for the PDF
 */
export function generateFosteringReceiptPDF(data: {
  animalName: string;
  fullName: string;
  nif: string;
  iban: string;
  monthValue: number;
  startDate: string;
}) {
  const { animalName, fullName, nif, iban, monthValue, startDate } = data;

  const pdf = new jsPDF();
  pdf.setFont("helvetica", "normal");

  // Title
  pdf.setFontSize(20);
  pdf.text("Recibo de Apadrinhamento", 105, 20, { align: "center" });

  pdf.setFontSize(12);

  // Body
  pdf.text(`Animal: ${animalName}`, 20, 40);
  pdf.text(`Nome do Padrinho: ${fullName}`, 20, 50);
  pdf.text(`NIF: ${nif}`, 20, 60);
  pdf.text(`IBAN: ${maskIban(iban)}`, 20, 70);
  pdf.text(`Valor Mensal: ${monthValue}€`, 20, 80);
  pdf.text(`Data de Início: ${startDate}`, 20, 90);

  pdf.text(
    "Todos os meses, no mesmo dia do início do apadrinhamento,",
    20,
    110
  );
  pdf.text("será debitado da conta o valor escolhido.", 20, 120);

  pdf.setFontSize(11);
  pdf.text("Obrigado por ajudar a mudar vidas!", 105, 140, {
    align: "center",
  });

  pdf.save("recibo-apadrinhamento.pdf");
}

/** Mask IBAN: PT50 ***********1234 */
function maskIban(iban: string) {
  return (
    iban.substring(0, 4) +
    " " +
    "*".repeat(iban.length - 8) +
    iban.substring(iban.length - 4)
  );
}
