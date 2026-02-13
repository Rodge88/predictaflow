import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import type { PhotoAnalysis, DrawingType } from "@/lib/sketch/types"

const SYSTEM_PROMPT = `You are a construction and carpentry AI assistant. You analyze photos of job sites and help generate professional technical drawings.

When analyzing a photo, you must:
1. Describe what you see in the photo (room, structure, materials, etc.)
2. Identify key structural elements (walls, doors, windows, beams, joists, etc.)
3. Estimate dimensions based on standard construction sizes and visual cues:
   - Standard door width: 820mm (internal), 920mm (external)
   - Standard door height: 2040mm
   - Standard ceiling height: 2400mm
   - Standard stud spacing: 450mm or 600mm
   - Standard window height from floor: 900mm
   - Brick size: 230mm x 76mm x 110mm
   - Standard timber sizes: 90x45mm, 90x35mm, 140x45mm, 190x45mm, 240x45mm
4. Suggest the most appropriate drawing type
5. Ask follow-up questions to clarify requirements

Be practical and speak plainly - the user is a tradesperson on-site.

IMPORTANT: Respond with valid JSON matching this structure:
{
  "description": "Plain description of what you see",
  "identifiedElements": ["wall", "door", "window", etc.],
  "estimatedDimensions": [
    {"element": "room width", "estimated_mm": 3600, "confidence": "medium"}
  ],
  "suggestedDrawingType": "floor_plan",
  "suggestedScale": "1:50",
  "followUpQuestions": ["What are the actual room dimensions?", etc.]
}`

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY not configured. Add it to your .env.local file." },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const photo = formData.get("photo") as File | null
    const userMessage = formData.get("message") as string | null
    const conversationHistory = formData.get("history") as string | null

    if (!photo && !userMessage) {
      return NextResponse.json(
        { error: "Please provide a photo or message" },
        { status: 400 }
      )
    }

    const client = new Anthropic({ apiKey })

    // Build message content
    const content: Anthropic.MessageCreateParams["messages"][0]["content"] = []

    if (photo) {
      const bytes = await photo.arrayBuffer()
      const base64 = Buffer.from(bytes).toString("base64")
      const mediaType = photo.type as "image/jpeg" | "image/png" | "image/gif" | "image/webp"

      content.push({
        type: "image",
        source: {
          type: "base64",
          media_type: mediaType,
          data: base64,
        },
      })
    }

    if (userMessage) {
      content.push({
        type: "text",
        text: userMessage,
      })
    }

    // Build conversation messages
    const messages: Anthropic.MessageCreateParams["messages"] = []

    if (conversationHistory) {
      try {
        const history = JSON.parse(conversationHistory)
        for (const msg of history) {
          messages.push({
            role: msg.role,
            content: msg.content,
          })
        }
      } catch {
        // ignore parse errors
      }
    }

    messages.push({
      role: "user",
      content,
    })

    const response = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages,
    })

    const text =
      response.content[0].type === "text" ? response.content[0].text : ""

    // Try to parse as JSON analysis
    let analysis: PhotoAnalysis | null = null
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]) as PhotoAnalysis
      }
    } catch {
      // Not JSON - return as plain text response
    }

    return NextResponse.json({
      text,
      analysis,
    })
  } catch (error: unknown) {
    console.error("Sketch analyze error:", error)
    const message = error instanceof Error ? error.message : "Analysis failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
