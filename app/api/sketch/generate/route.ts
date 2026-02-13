import { NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"
import type { Drawing, DrawingElement, GenerateDrawingRequest } from "@/lib/sketch/types"

const SYSTEM_PROMPT = `You are a construction drawing generator. Given a description of a space, dimensions, and requirements, you generate structured drawing data as JSON.

You must return valid JSON matching this Drawing structure. All dimensions are in millimeters.

Element types you can use:
- wall: { type: "wall", id: string, x1, y1, x2, y2, thickness (mm), label? }
- door: { type: "door", id: string, x, y, width (mm), swing: "left"|"right"|"double"|"sliding", angle (degrees) }
- window: { type: "window", id: string, x, y, width (mm), angle (degrees) }
- dimension: { type: "dimension", id: string, x1, y1, x2, y2, value (mm), unit, offset (mm for line offset) }
- note: { type: "note", id: string, x, y, text, fontSize? }
- line: { type: "line", id: string, x1, y1, x2, y2, strokeWidth?, dashed? }
- rect: { type: "rect", id: string, x, y, width, height, label?, fill? }
- beam/joist/stud: { type: "beam"|"joist"|"stud", id: string, x1, y1, x2, y2, width, depth, label? }
- stairs: { type: "stairs", id: string, x, y, width, length, steps, angle, direction: "up"|"down" }

IMPORTANT RULES:
1. Position elements using mm coordinates starting from (0,0) at top-left
2. Wall thickness should be 90-110mm for internal, 230-280mm for external
3. Add dimension annotations for all key measurements
4. Include notes for important details
5. Set the drawing width/height to encompass all elements with some margin
6. Use a sensible scale (1:50 for rooms, 1:20 for details, 1:100 for larger areas)

Return ONLY the JSON, no other text. The JSON should match this structure:
{
  "type": "floor_plan",
  "title": "Room Name - Drawing Type",
  "description": "Brief description",
  "unit": "mm",
  "scale": "1:50",
  "width": 6000,
  "height": 4000,
  "elements": [...],
  "notes": ["Note 1", "Note 2"]
}`

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "GOOGLE_AI_API_KEY not configured" },
        { status: 500 }
      )
    }

    const body = (await request.json()) as GenerateDrawingRequest

    const ai = new GoogleGenAI({ apiKey })

    const prompt = buildPrompt(body)

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `${SYSTEM_PROMPT}\n\n${prompt}`,
      config: {
        thinkingConfig: {
          thinkingLevel: "low",
        },
      },
    })

    const text = response.text ?? ""

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to generate drawing data" },
        { status: 500 }
      )
    }

    const drawingData = JSON.parse(jsonMatch[0])

    // Build the full Drawing object
    const drawing: Drawing = {
      id: crypto.randomUUID(),
      type: drawingData.type || body.drawingType || "floor_plan",
      title: drawingData.title || body.title || "Untitled Drawing",
      description: drawingData.description,
      unit: body.unit || drawingData.unit || "mm",
      scale: drawingData.scale || "1:50",
      elements: (drawingData.elements || []).map(
        (el: DrawingElement, i: number) => ({
          ...el,
          id: el.id || `el-${i}`,
        })
      ),
      width: drawingData.width || 6000,
      height: drawingData.height || 4000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      projectName: body.title,
      drawnBy: "SketchTool AI",
      notes: drawingData.notes || body.notes,
    }

    return NextResponse.json({ drawing })
  } catch (error: unknown) {
    console.error("Drawing generation error:", error)
    const message =
      error instanceof Error ? error.message : "Generation failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

function buildPrompt(req: GenerateDrawingRequest): string {
  let prompt = `Generate a ${req.drawingType.replace("_", " ")} drawing.\n\n`

  prompt += `Title: ${req.title}\n`
  prompt += `Units: ${req.unit}\n\n`

  if (Object.keys(req.userDimensions).length > 0) {
    prompt += "Dimensions provided by the user:\n"
    for (const [key, value] of Object.entries(req.userDimensions)) {
      prompt += `- ${key}: ${value}mm\n`
    }
    prompt += "\n"
  }

  if (req.notes && req.notes.length > 0) {
    prompt += "Notes:\n"
    req.notes.forEach((note) => {
      prompt += `- ${note}\n`
    })
    prompt += "\n"
  }

  if (req.analysis) {
    prompt += "AI Photo Analysis:\n"
    prompt += `Description: ${req.analysis.description}\n`
    prompt += `Elements: ${req.analysis.identifiedElements.join(", ")}\n`
    if (req.analysis.estimatedDimensions.length > 0) {
      prompt += "Estimated dimensions:\n"
      req.analysis.estimatedDimensions.forEach((d) => {
        prompt += `- ${d.element}: ~${d.estimated_mm}mm (${d.confidence} confidence)\n`
      })
    }
    prompt += "\n"
  }

  prompt +=
    "Generate the drawing JSON now. Make it professional and accurate with all dimensions annotated."

  return prompt
}
