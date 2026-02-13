"use client"

import React, { useState, useCallback, useRef } from "react"
import {
  Camera,
  MessageSquare,
  PenTool,
  Download,
  ArrowLeft,
  ArrowRight,
  Plus,
  Loader2,
  Ruler,
  HardHat,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { PhotoCapture } from "@/components/sketch/photo-capture"
import { SketchChat } from "@/components/sketch/sketch-chat"
import { DrawingViewer } from "@/components/sketch/drawing-viewer"
import type {
  ChatMessage,
  Drawing,
  PhotoAnalysis,
  SketchSession,
} from "@/lib/sketch/types"

type Step = "capture" | "chat" | "drawing"

const STEPS: { key: Step; label: string; icon: React.ReactNode }[] = [
  { key: "capture", label: "Photo", icon: <Camera className="h-4 w-4" /> },
  { key: "chat", label: "Details", icon: <MessageSquare className="h-4 w-4" /> },
  { key: "drawing", label: "Drawing", icon: <PenTool className="h-4 w-4" /> },
]

export default function SketchPage() {
  const [step, setStep] = useState<Step>("capture")
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [drawing, setDrawing] = useState<Drawing | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [analysis, setAnalysis] = useState<PhotoAnalysis | null>(null)
  const [readyToGenerate, setReadyToGenerate] = useState(false)

  const conversationRef = useRef<
    { role: "user" | "assistant"; content: string }[]
  >([])

  // ── Step 1: Photo captured ──
  const handlePhotoCapture = useCallback(
    async (file: File, previewUrl: string) => {
      setPhotoFile(file)
      setPhotoUrl(previewUrl)
      setStep("chat")
      setIsLoading(true)

      // Add initial system message
      const welcomeMsg: ChatMessage = {
        id: "welcome",
        role: "assistant",
        content:
          "Got your photo. Analyzing the site now - I'll identify what I can see and estimate some dimensions. Hold tight...",
        timestamp: new Date().toISOString(),
      }
      setMessages([welcomeMsg])

      try {
        // Send photo to analysis API
        const formData = new FormData()
        formData.append("photo", file)
        formData.append(
          "message",
          "Analyze this construction/carpentry site photo. Identify all elements and estimate dimensions."
        )

        const res = await fetch("/api/sketch/analyze", {
          method: "POST",
          body: formData,
        })

        const data = await res.json()

        if (data.error) {
          const errorMsg: ChatMessage = {
            id: "error-" + Date.now(),
            role: "assistant",
            content: `Couldn't analyze the photo: ${data.error}\n\nNo worries - just tell me what you see and what you need, and I'll work with that.`,
            timestamp: new Date().toISOString(),
          }
          setMessages((prev) => [...prev, errorMsg])
          conversationRef.current.push({
            role: "assistant",
            content: errorMsg.content,
          })
        } else {
          // Build response from analysis
          let responseText = ""

          if (data.analysis) {
            setAnalysis(data.analysis)
            const a = data.analysis as PhotoAnalysis

            responseText = `Here's what I see:\n\n${a.description}\n\n`

            if (a.estimatedDimensions.length > 0) {
              responseText += "**Estimated dimensions:**\n"
              a.estimatedDimensions.forEach(
                (d: PhotoAnalysis["estimatedDimensions"][0]) => {
                  const m = (d.estimated_mm / 1000).toFixed(1)
                  responseText += `- ${d.element}: ~${m}m (${d.confidence} confidence)\n`
                }
              )
              responseText += "\n"
            }

            responseText += `I'd suggest a **${a.suggestedDrawingType.replace("_", " ")}** at **${a.suggestedScale}** scale.\n\n`

            if (a.followUpQuestions.length > 0) {
              responseText += a.followUpQuestions[0]
            }
          } else {
            responseText = data.text || "I can see your photo. What do you need me to draw?"
          }

          const analysisMsg: ChatMessage = {
            id: "analysis-" + Date.now(),
            role: "assistant",
            content: responseText,
            timestamp: new Date().toISOString(),
          }
          setMessages((prev) => [...prev, analysisMsg])
          conversationRef.current.push({
            role: "assistant",
            content: responseText,
          })
        }
      } catch (err) {
        const errorMsg: ChatMessage = {
          id: "error-" + Date.now(),
          role: "assistant",
          content:
            "Network issue - couldn't reach the AI. Just tell me what you need and I'll work with your description instead.",
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, errorMsg])
        conversationRef.current.push({
          role: "assistant",
          content: errorMsg.content,
        })
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  // ── Step 2: Chat message sent ──
  const handleSendMessage = useCallback(
    async (text: string) => {
      const userMsg: ChatMessage = {
        id: "user-" + Date.now(),
        role: "user",
        content: text,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, userMsg])
      conversationRef.current.push({ role: "user", content: text })
      setIsLoading(true)

      try {
        const res = await fetch("/api/sketch/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: conversationRef.current,
            hasPhoto: !!photoFile,
          }),
        })

        const data = await res.json()

        if (data.error) {
          const errorMsg: ChatMessage = {
            id: "error-" + Date.now(),
            role: "assistant",
            content: `Error: ${data.error}`,
            timestamp: new Date().toISOString(),
          }
          setMessages((prev) => [...prev, errorMsg])
          conversationRef.current.push({
            role: "assistant",
            content: errorMsg.content,
          })
        } else {
          const assistantMsg: ChatMessage = {
            id: "assistant-" + Date.now(),
            role: "assistant",
            content: data.text,
            timestamp: new Date().toISOString(),
          }
          setMessages((prev) => [...prev, assistantMsg])
          conversationRef.current.push({
            role: "assistant",
            content: data.text,
          })

          if (data.readyToGenerate) {
            setReadyToGenerate(true)
          }
        }
      } catch {
        const errorMsg: ChatMessage = {
          id: "error-" + Date.now(),
          role: "assistant",
          content:
            "Network error. Check your connection and try again.",
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, errorMsg])
      } finally {
        setIsLoading(false)
      }
    },
    [photoFile]
  )

  // ── Generate drawing ──
  const handleGenerateDrawing = useCallback(async () => {
    setIsGenerating(true)
    setStep("drawing")

    try {
      // Extract dimensions and notes from conversation
      const fullConversation = conversationRef.current
        .map((m) => `${m.role}: ${m.content}`)
        .join("\n")

      const res = await fetch("/api/sketch/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          drawingType: analysis?.suggestedDrawingType || "floor_plan",
          userDimensions: {},
          notes: [],
          title: "Site Sketch",
          unit: "mm",
          analysis: analysis,
          conversationContext: fullConversation,
        }),
      })

      const data = await res.json()

      if (data.error) {
        // Show error and go back to chat
        const errorMsg: ChatMessage = {
          id: "gen-error-" + Date.now(),
          role: "assistant",
          content: `Couldn't generate the drawing: ${data.error}. Let's try adding more details.`,
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, errorMsg])
        setStep("chat")
      } else if (data.drawing) {
        setDrawing(data.drawing)
      }
    } catch {
      setStep("chat")
      const errorMsg: ChatMessage = {
        id: "gen-error-" + Date.now(),
        role: "assistant",
        content:
          "Network error generating the drawing. Check your connection and try again.",
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsGenerating(false)
    }
  }, [analysis])

  // ── Update drawing (from dimension edits) ──
  const handleUpdateDrawing = useCallback((updated: Drawing) => {
    setDrawing(updated)
  }, [])

  // ── New sketch ──
  const handleNewSketch = useCallback(() => {
    if (photoUrl) URL.revokeObjectURL(photoUrl)
    setStep("capture")
    setPhotoUrl(null)
    setPhotoFile(null)
    setMessages([])
    setDrawing(null)
    setAnalysis(null)
    setReadyToGenerate(false)
    conversationRef.current = []
  }, [photoUrl])

  const currentStepIndex = STEPS.findIndex((s) => s.key === step)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2">
          <HardHat className="h-5 w-5 text-primary" />
          <h1 className="font-semibold text-base">SketchTool</h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNewSketch}
          className="text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          New
        </Button>
      </header>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-1 px-4 py-2 border-b bg-muted/30">
        {STEPS.map((s, i) => (
          <React.Fragment key={s.key}>
            <button
              onClick={() => {
                // Only allow going back or to completed steps
                if (i <= currentStepIndex) setStep(s.key)
                if (s.key === "drawing" && drawing) setStep(s.key)
              }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                step === s.key
                  ? "bg-primary text-primary-foreground"
                  : i < currentStepIndex
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground"
              )}
            >
              {s.icon}
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "w-8 h-0.5 rounded",
                  i < currentStepIndex ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        {/* Step 1: Photo Capture */}
        {step === "capture" && (
          <div className="flex flex-col items-center justify-center h-full px-4 py-8">
            <div className="text-center mb-8">
              <Ruler className="h-12 w-12 text-primary mx-auto mb-3" />
              <h2 className="text-xl font-semibold mb-1">
                Snap your job site
              </h2>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Take a photo and I&apos;ll help you turn it into a professional sketch
                with dimensions
              </p>
            </div>
            <PhotoCapture onPhotoCapture={handlePhotoCapture} />
          </div>
        )}

        {/* Step 2: AI Chat */}
        {step === "chat" && (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-hidden">
              <SketchChat
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                photoUrl={photoUrl}
              />
            </div>

            {/* Generate button */}
            {readyToGenerate && (
              <div className="px-4 py-3 border-t bg-primary/5">
                <Button
                  onClick={handleGenerateDrawing}
                  disabled={isGenerating}
                  className="w-full h-12 text-base font-semibold"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Generating Drawing...
                    </>
                  ) : (
                    <>
                      <PenTool className="h-5 w-5 mr-2" />
                      Generate Drawing
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Manual generate for when user wants to skip ahead */}
            {!readyToGenerate && messages.length > 2 && (
              <div className="px-4 py-2 border-t">
                <Button
                  variant="outline"
                  onClick={handleGenerateDrawing}
                  disabled={isGenerating || isLoading}
                  className="w-full h-10 text-sm"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4 mr-2" />
                      I&apos;ve given enough info - generate drawing
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Drawing View */}
        {step === "drawing" && (
          <div className="h-full">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <div className="text-center">
                  <p className="font-semibold">Generating your drawing...</p>
                  <p className="text-sm text-muted-foreground">
                    Building walls, adding dimensions, making it look sharp
                  </p>
                </div>
              </div>
            ) : drawing ? (
              <DrawingViewer
                drawing={drawing}
                onUpdateDrawing={handleUpdateDrawing}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <p className="text-muted-foreground">No drawing yet</p>
                <Button variant="outline" onClick={() => setStep("chat")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to chat
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
