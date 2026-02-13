import { Injectable } from '@angular/core';

// These will be available globally from the scripts in index.html
declare var html2canvas: any;
declare var jspdf: any;

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  async generatePdfFromElement(element: HTMLElement, fileName: string): Promise<void> {
    if (!element) {
      console.error('Element not provided for PDF generation');
      return;
    }

    // The main content area is scrollable. To capture the full content,
    // we need to temporarily remove the overflow constraint.
    const scrollableContent = element.querySelector('main');
    let originalOverflow = '';
    if (scrollableContent) {
        originalOverflow = scrollableContent.style.overflowY;
        scrollableContent.style.overflowY = 'visible';
    }

    try {
        const canvas = await html2canvas(element, {
          scale: 2, // Use a higher scale for better resolution
          useCORS: true,
          logging: false,
          // Explicitly set width and height to the element's full scroll dimensions
          // This ensures the entire content is captured, not just the visible part.
          width: element.scrollWidth,
          height: element.scrollHeight,
          windowWidth: element.scrollWidth,
          windowHeight: element.scrollHeight,
          ignoreElements: (el) => el.classList.contains('pdf-exclude')
        });

        const { jsPDF } = jspdf;
        
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const margin = 15; // Use a 15mm margin for better spacing

        const contentWidth = pdfWidth - (margin * 2);
        const pageContentHeight = pdfHeight - (margin * 2);

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        // Calculate the pixel height equivalent to one page's content area in the PDF
        const pxPerMm = canvasWidth / contentWidth;
        const pageContentHeightInPx = Math.floor(pageContentHeight * pxPerMm);

        let yCanvasPosition = 0;
        let pageCount = 1;

        // Loop through the canvas, creating a new PDF page for each slice
        while (yCanvasPosition < canvasHeight) {
          if (pageCount > 1) {
            pdf.addPage();
          }

          // Determine the height of the current slice from the main canvas
          const sliceHeight = Math.min(pageContentHeightInPx, canvasHeight - yCanvasPosition);

          // Create a temporary canvas for this slice
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = canvasWidth;
          pageCanvas.height = sliceHeight;
          const pageCtx = pageCanvas.getContext('2d');

          if (pageCtx) {
            // Draw the slice from the main canvas onto the temporary canvas
            pageCtx.drawImage(
              canvas,
              0, yCanvasPosition, // Source x, y
              canvasWidth, sliceHeight, // Source width, height
              0, 0, // Destination x, y
              canvasWidth, sliceHeight // Destination width, height
            );

            const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);
            
            // Calculate the height of the image slice in PDF units (mm)
            const imageSliceHeightInPdf = (sliceHeight * contentWidth) / canvasWidth;

            // Add the sliced image to the PDF, positioned within the margins.
            // This ensures top and bottom margins are respected on every page.
            pdf.addImage(pageImgData, 'JPEG', margin, margin, contentWidth, imageSliceHeightInPdf);
          }
          
          yCanvasPosition += pageContentHeightInPx;
          pageCount++;
        }
        
        pdf.save(`${fileName}.pdf`);
    } finally {
        // IMPORTANT: Restore the original style to avoid breaking the UI.
        if (scrollableContent) {
            scrollableContent.style.overflowY = originalOverflow;
        }
    }
  }
}
