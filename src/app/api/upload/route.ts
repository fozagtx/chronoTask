import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      );
    }

    // Read file content
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Dynamic import pdf-parse to avoid build issues
    const pdfParse = (await import("pdf-parse")).default;

    // Extract text from PDF
    const pdfData = await pdfParse(buffer);
    const text = pdfData.text || "";

    if (!text.trim()) {
      return NextResponse.json(
        {
          error: "Unable to extract text from this PDF. The PDF may be image-based or scanned.",
          code: "NO_TEXT_CONTENT"
        },
        { status: 400 }
      );
    }

    // Generate a unique document ID
    const documentId = crypto.randomUUID();

    return NextResponse.json({
      success: true,
      documentId,
      fileName: file.name,
      text: text.trim(),
      textLength: text.trim().length,
      pageCount: pdfData.numpages,
    });
  } catch (error: unknown) {
    console.error("Error processing PDF:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to process PDF";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
