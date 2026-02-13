// ============================================
// PDF Export for Construction Sketches
// ============================================

import { jsPDF } from "jspdf"
import type { Drawing } from "./types"
import { generateSVG } from "./drawing-engine"

/** Export drawing as PDF (A4 landscape) */
export async function exportToPDF(
  drawing: Drawing,
  svgElement: SVGSVGElement | null
): Promise<Blob> {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  })

  const pageWidth = 297
  const pageHeight = 210

  // If we have the SVG element, convert it to an image
  if (svgElement) {
    const svgData = new XMLSerializer().serializeToString(svgElement)
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    const url = URL.createObjectURL(svgBlob)

    // Create canvas and draw SVG onto it
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!
    const img = new Image()

    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        canvas.width = img.width * 2 // 2x for quality
        canvas.height = img.height * 2
        ctx.scale(2, 2)
        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
        resolve()
      }
      img.onerror = reject
      img.src = url
    })

    const imgData = canvas.toDataURL("image/png")
    URL.revokeObjectURL(url)

    // Add image to PDF, maintaining aspect ratio
    const imgAspect = canvas.width / canvas.height
    const pageAspect = pageWidth / pageHeight

    let drawWidth: number, drawHeight: number, drawX: number, drawY: number

    if (imgAspect > pageAspect) {
      drawWidth = pageWidth - 10
      drawHeight = drawWidth / imgAspect
      drawX = 5
      drawY = (pageHeight - drawHeight) / 2
    } else {
      drawHeight = pageHeight - 10
      drawWidth = drawHeight * imgAspect
      drawX = (pageWidth - drawWidth) / 2
      drawY = 5
    }

    pdf.addImage(imgData, "PNG", drawX, drawY, drawWidth, drawHeight)
  } else {
    // Fallback: generate SVG string and render
    const svgStr = generateSVG(drawing, 1190, 842) // A4 at 96dpi landscape
    // Write text-based summary
    pdf.setFontSize(16)
    pdf.text(drawing.title, pageWidth / 2, 15, { align: "center" })
    pdf.setFontSize(10)
    pdf.text(`Type: ${drawing.type.replace("_", " ")} | Scale: ${drawing.scale} | Units: ${drawing.unit}`, pageWidth / 2, 22, { align: "center" })

    if (drawing.notes && drawing.notes.length > 0) {
      pdf.setFontSize(9)
      let y = 30
      drawing.notes.forEach((note) => {
        pdf.text(`- ${note}`, 15, y)
        y += 5
      })
    }
  }

  return pdf.output("blob")
}

/** Trigger PDF download */
export async function downloadPDF(
  drawing: Drawing,
  svgElement: SVGSVGElement | null
): Promise<void> {
  const blob = await exportToPDF(drawing, svgElement)
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${drawing.title.replace(/\s+/g, "_").toLowerCase()}_${new Date().toISOString().split("T")[0]}.pdf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
