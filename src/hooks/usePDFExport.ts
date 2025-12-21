import { useCallback, useState } from "react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const usePDFExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = useCallback(
    async (element: HTMLElement, filename: string = "itinerary") => {
      setIsExporting(true);
      toast.info("جاري إنشاء PDF...", { duration: 10000 });

      try {
        // Get element dimensions
        const elementWidth = element.offsetWidth;
        const elementHeight = element.offsetHeight;

        // Create a wrapper div with exact dimensions
        const wrapper = document.createElement("div");
        wrapper.style.position = "fixed";
        wrapper.style.left = "-99999px";
        wrapper.style.top = "0";
        wrapper.style.width = `${elementWidth}px`;
        wrapper.style.height = `${elementHeight}px`;
        wrapper.style.backgroundColor = "white";
        
        // Clone the element
        const clone = element.cloneNode(true) as HTMLElement;
        wrapper.appendChild(clone);
        document.body.appendChild(wrapper);

        try {
          // Render using html2canvas
          const scale = 2;
          const canvas = await html2canvas(wrapper, {
            scale: scale,
            useCORS: true,
            allowTaint: true,
            logging: false,
            backgroundColor: "#ffffff",
          });

          // Remove wrapper
          document.body.removeChild(wrapper);

          // Get canvas image
          const imgData = canvas.toDataURL("image/png");
          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;

          // Create PDF with exact canvas dimensions
          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "px",
            format: [canvasWidth, canvasHeight],
          });

          // Add image
          pdf.addImage(imgData, "PNG", 0, 0, canvasWidth, canvasHeight);

          // Extract links from ORIGINAL element (not clone, to get correct positioning)
          const allLinks = element.querySelectorAll("a[href]");
          
          allLinks.forEach((linkEl) => {
            const href = linkEl.getAttribute("href");
            if (href && (href.startsWith("http://") || href.startsWith("https://"))) {
              try {
                const rect = linkEl.getBoundingClientRect();
                const elementRect = element.getBoundingClientRect();
                
                // Calculate relative position within the element
                const relX = (rect.left - elementRect.left) * scale;
                const relY = (rect.top - elementRect.top) * scale;
                const width = rect.width * scale;
                const height = rect.height * scale;

                // Only add if dimensions are valid
                if (width > 2 && height > 2) {
                  // Add the link annotation using jsPDF's internal API
                  const linkData = {
                    x: relX,
                    y: relY,
                    w: width,
                    h: height,
                    type: "URI",
                    url: href,
                  };

                  // Use internal method to add link
                  if ((pdf as any)._addPage) {
                    const pageLinks = (pdf as any)._pageLinks[pdf.internal.getNumberOfPages()];
                    if (pageLinks) {
                      pageLinks.push(linkData);
                    }
                  } else {
                    // Fallback: use link method
                    (pdf as any).link(relX, relY, width, height, { url: href });
                  }
                }
              } catch (error) {
                console.warn("Error processing link:", error);
              }
            }
          });

          pdf.save(`${filename}.pdf`);
          toast.success("تم تصدير PDF بنجاح!");
        } catch (error) {
          // Clean up wrapper if still present
          if (document.body.contains(wrapper)) {
            document.body.removeChild(wrapper);
          }
          throw error;
        }
      } catch (error) {
        console.error("Error exporting PDF:", error);
        toast.error("فشل تصدير PDF. يرجى المحاولة مرة أخرى.");
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  return { exportToPDF, isExporting };
};
