import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;

function base64ToUint8Array(base64: string): Uint8Array {
  const cleaned = base64.replace(/^data:[^;]+;base64,/, '');
  const binaryString = atob(cleaned);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Extracts raw text from a PDF file entirely in the browser (no server round-trip).
// Only works for PDFs with an embedded text layer (not scanned images).
//
// PDF renderers frequently emit one text item per glyph (common for CJK text),
// so naively joining items with a space breaks words apart (e.g. "결석"
// becomes "결 석"). Instead we only insert a space/newline when the item's
// position implies a real gap on the page, reconstructing the original layout.
export async function extractTextFromPdf(fileBase64: string): Promise<string> {
  const data = base64ToUint8Array(fileBase64);
  const pdf = await pdfjsLib.getDocument({ data }).promise;

  let fullText = '';
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    let lastItem: { str: string; transform: number[]; width: number } | null = null;
    for (const item of content.items) {
      if (!('str' in item)) continue;
      const str = item.str;

      if (str !== '' && lastItem) {
        const sameLine = Math.abs(item.transform[5] - lastItem.transform[5]) < 1;
        if (!sameLine) {
          fullText += '\n';
        } else {
          const prevEndX = lastItem.transform[4] + lastItem.width;
          const gap = item.transform[4] - prevEndX;
          const avgCharWidth = lastItem.width / Math.max(lastItem.str.length, 1);
          if (gap > avgCharWidth * 0.35 && !str.startsWith(' ') && !lastItem.str.endsWith(' ')) {
            fullText += ' ';
          }
        }
      }

      fullText += str;
      if ('hasEOL' in item && item.hasEOL) fullText += '\n';
      if (str !== '') lastItem = item;
    }
    fullText += '\n';
  }

  return fullText;
}
