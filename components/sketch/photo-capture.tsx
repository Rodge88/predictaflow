"use client"

import React, { useRef, useState, useCallback } from "react"
import { Camera, Upload, RotateCcw, Check, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PhotoCaptureProps {
  onPhotoCapture: (file: File, previewUrl: string) => void
  className?: string
}

export function PhotoCapture({ onPhotoCapture, className }: PhotoCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [capturedFile, setCapturedFile] = useState<File | null>(null)

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      const url = URL.createObjectURL(file)
      setPreview(url)
      setCapturedFile(file)
    },
    []
  )

  const handleConfirm = useCallback(() => {
    if (capturedFile && preview) {
      onPhotoCapture(capturedFile, preview)
    }
  }, [capturedFile, preview, onPhotoCapture])

  const handleRetake = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    setCapturedFile(null)
  }, [preview])

  if (preview) {
    return (
      <div className={cn("flex flex-col items-center gap-4", className)}>
        <div className="relative w-full max-w-md aspect-[4/3] rounded-xl overflow-hidden border-2 border-border shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Captured site photo"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex gap-3 w-full max-w-md">
          <Button
            variant="outline"
            onClick={handleRetake}
            className="flex-1 h-12 text-base"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Retake
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 h-12 text-base"
          >
            <Check className="mr-2 h-5 w-5" />
            Use Photo
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      <div className="w-full max-w-md aspect-[4/3] rounded-xl border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-4 bg-muted/30">
        <ImageIcon className="h-16 w-16 text-muted-foreground/40" />
        <p className="text-muted-foreground text-sm text-center px-4">
          Take a photo of the job site or upload an existing image
        </p>
      </div>

      <div className="flex gap-3 w-full max-w-md">
        {/* Camera capture - opens native camera on mobile */}
        <Button
          onClick={() => cameraInputRef.current?.click()}
          className="flex-1 h-14 text-base"
          size="lg"
        >
          <Camera className="mr-2 h-5 w-5" />
          Take Photo
        </Button>
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* File upload */}
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 h-14 text-base"
          size="lg"
        >
          <Upload className="mr-2 h-5 w-5" />
          Upload
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  )
}
