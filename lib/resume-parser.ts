const MAX_RESUME_SIZE_BYTES = 4 * 1024 * 1024;

function hasSupportedResumeExtension(name: string) {
  return [".pdf", ".docx", ".txt", ".md"].some((extension) => name.toLowerCase().endsWith(extension));
}

function normalizeText(text: string) {
  return text.replace(/\s+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

export async function parseResumeFile(file: File) {
  if (!hasSupportedResumeExtension(file.name)) {
    throw new Error("Unsupported file type. Please upload a PDF, DOCX, TXT, or MD resume.");
  }

  if (file.size > MAX_RESUME_SIZE_BYTES) {
    throw new Error("Resume file is too large. Please keep it under 4 MB.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = file.name.toLowerCase();

  if (file.type === "application/pdf" || fileName.endsWith(".pdf")) {
    const { default: pdfParse } = await import("pdf-parse/lib/pdf-parse.js");
    const parsed = await pdfParse(buffer);
    const text = normalizeText(parsed.text);

    if (!text) {
      throw new Error("We could not extract readable text from this PDF. Try a text-based PDF or paste the resume manually.");
    }

    return text;
  }

  if (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileName.endsWith(".docx")
  ) {
    const { default: mammoth } = await import("mammoth");
    const parsed = await mammoth.extractRawText({ buffer });
    const text = normalizeText(parsed.value);

    if (!text) {
      throw new Error("We could not extract readable text from this DOCX file. Try another export or paste the resume manually.");
    }

    return text;
  }

  const text = normalizeText(buffer.toString("utf-8"));

  if (!text) {
    throw new Error("The uploaded file appears to be empty.");
  }

  return text;
}
