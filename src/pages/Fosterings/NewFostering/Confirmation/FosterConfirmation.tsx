import { useLocation, useNavigate } from "react-router-dom";
import styles from "./FosterConfirmation.module.css";
import heartImg from "/src/assets/fostering_heart.png";
import { generateFosteringReceiptPDF } from "@/utils/generateFosteringReceipt";

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

  /** Generates PDF using external utility */
  const handleDownloadPDF = () => {
    generateFosteringReceiptPDF({
      animalName: animal?.name || fostering.animalId,
      fullName: formData.fullName,
      nif: formData.nif,
      iban: formData.iban,
      monthValue,
      startDate,
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Obrigada por me apadrinhares!</h1>

      <p className={styles.subtitle}>Ansiosa/o por te conhecer!</p>

      <img
        src={heartImg}
        alt="Coração de agradecimento"
        className={styles.heartImage}
      />

      <button className={styles.downloadButton} onClick={handleDownloadPDF}>
        Descarregar Recibo
      </button>
    </div>
  );
}
