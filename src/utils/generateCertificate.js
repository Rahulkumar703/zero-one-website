import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

async function fileToArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    if (!file) reject("File is empty");

    const reader = new FileReader();

    reader.onload = function (event) {
      const arrayBuffer = event.target.result;
      resolve(arrayBuffer);
    };

    reader.readAsArrayBuffer(file);
  });
}

function hexToRgb(hex) {
  // Remove the hash sign, if it exists
  hex = hex.replace(/^#/, "");

  // Parse hexadecimal color value into RGB components
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Return RGB color as an object with values in the range from 0 to 1
  return { r, g, b };
}

// Cache helpers
const CERT_CACHE_PREFIX = "cert-v1";
const CERT_CACHE_TTL_MS = 2 * 24 * 60 * 60 * 1000; // 2 days
const CERT_CACHE_SIZE_CAP_BYTES = 1.5 * 1024 * 1024; // ~1.5MB

function canUseLocalStorage() {
  try {
    if (typeof window === "undefined") return false;
    const testKey = "__ls_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch (_) {
    return false;
  }
}

function uint8ToBase64(uint8) {
  let binary = "";
  for (let i = 0; i < uint8.length; i++)
    binary += String.fromCharCode(uint8[i]);
  return btoa(binary);
}

function base64ToUint8(b64) {
  const binary = atob(b64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function buildCertCacheKey(certificateNumber) {
  // If needed later, include template/fields hash here for stronger keys
  return `${CERT_CACHE_PREFIX}|${certificateNumber}`;
}

function getCachedCertificateBytes(certificateNumber) {
  if (!canUseLocalStorage()) return null;
  try {
    const key = buildCertCacheKey(certificateNumber);
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.data || !parsed.ts) return null;
    const isExpired = Date.now() - parsed.ts > CERT_CACHE_TTL_MS;
    if (isExpired) {
      window.localStorage.removeItem(key);
      return null;
    }
    return base64ToUint8(parsed.data);
  } catch (_) {
    return null;
  }
}

function setCachedCertificateBytes(certificateNumber, bytes) {
  if (!canUseLocalStorage()) return;
  try {
    if (!bytes || bytes.byteLength > CERT_CACHE_SIZE_CAP_BYTES) return;
    const key = buildCertCacheKey(certificateNumber);
    const envelope = {
      data: uint8ToBase64(bytes),
      ts: Date.now(),
      size: bytes.byteLength,
    };
    window.localStorage.setItem(key, JSON.stringify(envelope));
  } catch (_) {
    // Best-effort: ignore quota or serialization errors
  }
}

const generateCertificate = async (fields, template, certificateNumber) => {
  try {
    if (!template) throw new Error("Template is empty");
    // Try cache first
    const cachedBytes = getCachedCertificateBytes(certificateNumber);
    if (cachedBytes) {
      const blob = new Blob([cachedBytes], { type: "application/pdf" });
      return URL.createObjectURL(blob);
    }

    let pdfBuffer;
    if (typeof template === "string") {
      pdfBuffer = await fetch(template).then((res) => res.arrayBuffer());
    } else {
      pdfBuffer = await fileToArrayBuffer(template[0]);
    }

    const pdfDoc = await PDFDocument.load(pdfBuffer);
    pdfDoc.registerFontkit(fontkit);

    let font = null;

    try {
      const fontBytes = await fetch("/static/fonts/Gilroy-SemiBold.ttf").then(
        (res) => res.arrayBuffer()
      );

      font = await pdfDoc.embedFont(fontBytes);
    } catch (error) {
      font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    }

    const pages = pdfDoc.getPages();
    const pageWidth = pages[0].getWidth();
    const pageHeight = pages[0].getHeight();

    await Promise.all(
      fields.map(async (field) => {
        if (field.value === "QR") {
          const qrImage = `https://quickchart.io/qr?text=https://zeroonemce.com/certificate?cn=${
            certificateNumber.value || certificateNumber
          }&dark=fff&light=000&ecLevel=Q&margin=2&size=${
            parseInt(field.size) || 150
          }`;

          const qrImageBuffer = await fetch(qrImage).then((res) =>
            res.arrayBuffer()
          );

          const Qr = await pdfDoc.embedPng(qrImageBuffer);

          pages[0].drawImage(Qr, {
            x: parseFloat(field.x) || pageWidth / 2 - field.size / 2,
            y: parseFloat(field.y) || pageHeight / 2 - field.size / 2,
            width: parseFloat(field.size) || 150,
            height: parseFloat(field.size) || 150,
          });
        } else {
          const { r, g, b } = hexToRgb(field.color);

          const textWidth = font.widthOfTextAtSize(
            String(field.value),
            Number(field.size)
          );
          const textHeight = font.sizeAtHeight(Number(field.size));

          pages[0].drawText(String(field.value), {
            x: parseFloat(field.x) || pageWidth / 2 - textWidth / 2,
            y: parseFloat(field.y) || pageHeight / 2 - textHeight / 2,
            size: parseFloat(field.size) || 34,
            font: font,
            color: rgb(r || 1, g || 1, b || 1),
          });
        }
      })
    );

    const modifiedPdfBytes = await pdfDoc.save();

    // Store in cache (best effort)
    setCachedCertificateBytes(certificateNumber, modifiedPdfBytes);

    const modifiedPdfBlob = new Blob([modifiedPdfBytes], {
      type: "application/pdf",
    });
    const modifiedPdfUrl = URL.createObjectURL(modifiedPdfBlob);

    return modifiedPdfUrl;
  } catch (error) {
    console.error("Error generating certificate:", error);
    throw error;
  }
};

export default generateCertificate;
