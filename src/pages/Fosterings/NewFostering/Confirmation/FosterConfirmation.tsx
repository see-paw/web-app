import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import styles from "./FosterConfirmation.module.css";

/**
 * FosterConfirmation page
 *
 * @description
 * Final step of the fostering flow. Displays a thank-you message
 * and provides a PDF receipt download.
 */
export default function FosterConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();

  const { fostering, formData, monthValue, animal } = location.state || {};

  if (!fostering || !formData || !monthValue) {
    navigate("/animals");
    return null;
  }

  const startDate = new Date(fostering.startDate).toLocaleDateString("pt-PT");

  /** Mask IBAN: PT50 *****************1234 */
  const maskIban = (iban: string) => {
    return (
      iban.substring(0, 4) +
      " " +
      "*".repeat(iban.length - 8) +
      iban.substring(iban.length - 4)
    );
  };

  /** Generate and download PDF receipt */
  const handleDownloadPDF = () => {
    const pdf = new jsPDF();

    pdf.setFont("helvetica", "normal");

    // Title
    pdf.setFontSize(20);
    pdf.text("Recibo de Apadrinhamento", 105, 20, { align: "center" });

    pdf.setFontSize(12);

    // Receipt body
    pdf.text(`Animal: ${animal?.name || fostering.animalId}`, 20, 40);
    pdf.text(`Nome do Padrinho: ${formData.fullName}`, 20, 50);
    pdf.text(`NIF: ${formData.nif}`, 20, 60);
    pdf.text(`IBAN: ${maskIban(formData.iban)}`, 20, 70);
    pdf.text(`Valor Mensal: ${monthValue}€`, 20, 80);
    pdf.text(`Data de Início: ${startDate}`, 20, 90);

    // Additional message
    pdf.text(
      "Todos os meses, na mesmo dia do início do apadrinhamento,",
      20,
      110
    );
    pdf.text(
      "será debitado da conta o valor escolhido.",
      20,
      120
    );

    // Footer message
    pdf.setFontSize(11);
    pdf.text(
      "Obrigado por ajudar a mudar vidas! ❤",
      105,
      140,
      { align: "center" }
    );

    // Save the file
    pdf.save("recibo-apadrinhamento.pdf");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.thankYou}>
        Obrigada por me apadrinhares <span className={styles.heart}>❤️</span>
      </h1>

      <button className={styles.downloadButton} onClick={handleDownloadPDF}>
        Descarregar Recibo
      </button>
    </div>
  );
}
