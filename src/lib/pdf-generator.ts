import { jsPDF } from "jspdf";

export interface PaymentDetails {
  payerName: string;
  beneficiaryName: string;
  amount: string;
  accountNumber: string;
  companyName: string;
}

async function loadImageAsBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch image");
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer.toString("base64");
  } catch (e) {
    return null;
  }
}

export async function generatePaymentPDF(details: PaymentDetails): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Set colors and fonts
  const primaryColor = [37, 99, 235]; // #2563eb
  const textColor = [0, 0, 0];
  const lightTextColor = [102, 102, 102];

  // Page width for calculations
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPosition = 15;

  // Add logo image from Cloudinary
  const imageUrl = "https://res.cloudinary.com/dntyghmap/image/upload/v1786459117/image_dyha8k.png";
  const base64Image = await loadImageAsBase64(imageUrl);
  if (base64Image) {
    try {
      const imageWidth = 140;
      const imageHeight = 100;
      const imageX = (pageWidth - imageWidth) / 2;
      doc.addImage(`data:image/png;base64,${base64Image}`, "PNG", imageX, yPosition, imageWidth, imageHeight);
      yPosition += imageHeight + 20;
    } catch (e) {
      // If image fails to add, continue without it
      yPosition += 10;
    }
  } else {
    yPosition += 10;
  }

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("Confirmation de Paiement", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 10;

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text("Virement bancaire SEPA", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 12;

  // Separator line
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(1);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 8;

  // Payment details box background
  const boxHeight = 60;
  doc.setFillColor(240, 244, 248);
  doc.rect(margin, yPosition, contentWidth, boxHeight, "F");

  // Payment details content
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...textColor);

  let detailY = yPosition + 10;
  const labelX = margin + 10;
  const valueX = margin + 80;

  // Row 1
  doc.text("Transfert de :", labelX, detailY);
  doc.setFont("helvetica", "normal");
  doc.text(details.payerName, valueX, detailY);

  // Row 2
  detailY += 12;
  doc.setFont("helvetica", "bold");
  doc.text("Bénéficiaire :", labelX, detailY);
  doc.setFont("helvetica", "normal");
  doc.text(details.beneficiaryName, valueX, detailY);

  // Row 3
  detailY += 12;
  doc.setFont("helvetica", "bold");
  doc.text("Montant du virement :", labelX, detailY);
  doc.setFont("helvetica", "normal");
  doc.text(`€ ${details.amount}`, valueX, detailY);

  // Row 4
  detailY += 12;
  doc.setFont("helvetica", "bold");
  doc.text("Numéro de compte IBAN :", labelX, detailY);
  doc.setFont("helvetica", "normal");
  doc.text(details.accountNumber, valueX, detailY);

  yPosition += boxHeight + 8;

  // Separator line
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(1);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 8;

  // Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...lightTextColor);
  doc.text(`Généré par ${details.companyName}`, pageWidth / 2, yPosition, { align: "center" });
  yPosition += 6;
  doc.text(`Date: ${new Date().toLocaleDateString("fr-FR")}`, pageWidth / 2, yPosition, { align: "center" });
  yPosition += 6;
  doc.setFontSize(8);
  doc.text("Paiement par virement bancaire SEPA - Ce document ne remplace pas un contrat officiel", pageWidth / 2, yPosition, {
    align: "center",
    maxWidth: contentWidth,
  });

  // Convert to Buffer
  const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
  return pdfBuffer;
}
