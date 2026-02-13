"use client"

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react"
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Edit3,
  Download,
  RotateCcw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { Drawing, DimensionElement, DimensionUnit } from "@/lib/sketch/types"
import { generateSVG, formatDimension } from "@/lib/sketch/drawing-engine"
import { downloadPDF } from "@/lib/sketch/pdf-export"

interface DrawingViewerProps {
  drawing: Drawing
  onUpdateDrawing: (drawing: Drawing) => void
  className?: string
}

export function DrawingViewer({
  drawing,
  onUpdateDrawing,
  className,
}: DrawingViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgContainerRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [editingDimension, setEditingDimension] = useState<DimensionElement | null>(null)
  const [editValue, setEditValue] = useState("")
  const [viewportSize, setViewportSize] = useState({ width: 800, height: 600 })
  const [isExporting, setIsExporting] = useState(false)

  // Measure container
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setViewportSize({
          width: Math.max(rect.width, 320),
          height: Math.max(rect.height - 52, 300), // minus toolbar
        })
      }
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  // Generate SVG
  const svgString = useMemo(
    () => generateSVG(drawing, viewportSize.width, viewportSize.height),
    [drawing, viewportSize]
  )

  // Handle click on dimension elements to edit
  const handleSvgClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as SVGElement
      const dimGroup = target.closest("[data-type='dimension']")
      if (dimGroup) {
        const id = dimGroup.getAttribute("data-id")
        const dim = drawing.elements.find(
          (el) => el.id === id && el.type === "dimension"
        ) as DimensionElement | undefined
        if (dim) {
          setEditingDimension(dim)
          setEditValue(String(dim.value))
        }
      }
    },
    [drawing]
  )

  // Save dimension edit
  const handleSaveDimension = useCallback(() => {
    if (!editingDimension) return
    const newValue = parseFloat(editValue)
    if (isNaN(newValue) || newValue <= 0) return

    const updatedElements = drawing.elements.map((el) => {
      if (el.id === editingDimension.id && el.type === "dimension") {
        return { ...el, value: newValue }
      }
      return el
    })

    onUpdateDrawing({
      ...drawing,
      elements: updatedElements,
      updatedAt: new Date().toISOString(),
    })
    setEditingDimension(null)
  }, [editingDimension, editValue, drawing, onUpdateDrawing])

  // Zoom controls
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 4))
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.25))
  const handleFit = () => {
    setZoom(1)
    setPanOffset({ x: 0, y: 0 })
  }

  // Touch/mouse pan
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch" || e.button === 0) {
      setIsPanning(true)
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y })
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPanning) return
    setPanOffset({
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y,
    })
  }

  const handlePointerUp = () => setIsPanning(false)

  // Pinch zoom
  const lastTouchDistRef = useRef(0)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      lastTouchDistRef.current = Math.sqrt(dx * dx + dy * dy)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const delta = dist - lastTouchDistRef.current
      lastTouchDistRef.current = dist
      setZoom((z) => Math.max(0.25, Math.min(4, z + delta * 0.005)))
    }
  }

  // Export PDF
  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      const svgEl = svgContainerRef.current?.querySelector("svg") as SVGSVGElement | null
      await downloadPDF(drawing, svgEl)
    } catch (err) {
      console.error("PDF export failed:", err)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div ref={containerRef} className={cn("flex flex-col h-full", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-background">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-9 w-9">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs font-mono w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-9 w-9">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleFit} className="h-9 w-9">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground mr-2 hidden sm:inline">
            Tap dimensions to edit
          </span>
          <Button
            variant="default"
            size="sm"
            onClick={handleExportPDF}
            disabled={isExporting}
            className="h-9"
          >
            <Download className="h-4 w-4 mr-1" />
            {isExporting ? "Exporting..." : "PDF"}
          </Button>
        </div>
      </div>

      {/* Drawing area */}
      <div
        className="flex-1 overflow-hidden bg-muted/20 touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <div
          ref={svgContainerRef}
          className="w-full h-full"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
            transformOrigin: "center center",
          }}
          onClick={handleSvgClick}
          dangerouslySetInnerHTML={{ __html: svgString }}
        />
      </div>

      {/* Dimension edit dialog */}
      <Dialog
        open={!!editingDimension}
        onOpenChange={(open) => !open && setEditingDimension(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Edit Dimension
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {editingDimension && (
              <>
                <p className="text-sm text-muted-foreground">
                  Current:{" "}
                  {formatDimension(
                    editingDimension.value,
                    editingDimension.unit || drawing.unit
                  )}
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveDimension()}
                    className="text-lg h-12"
                    autoFocus
                    min={0}
                    step={1}
                  />
                  <span className="text-sm font-mono text-muted-foreground shrink-0">
                    {editingDimension.unit || drawing.unit}
                  </span>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingDimension(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveDimension}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
