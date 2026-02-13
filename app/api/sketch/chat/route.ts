import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const SYSTEM_PROMPT = `You are a helpful construction and carpentry AI assistant called SketchTool. You help tradespeople create professional technical drawings from site photos.

Your job is to have a natural conversation to understand what the user needs. You should:

1. Be practical and speak plainly - the user is a tradesperson on-site
2. Ask about the type of drawing they need (floor plan, elevation, section, detail)
3. Ask about key dimensions (or confirm AI-estimated ones)
4. Ask about specific requirements (materials, notes for the crew, etc.)
5. When you have enough information, tell the user you're ready to generate the drawing

Keep responses SHORT and to the point. These people are busy.

When you have enough info to generate a drawing, include the marker [READY_TO_GENERATE] at the end of your message along with a summary of what you'll draw.

Common drawing types:
- Floor plan: Top-down view of room/building layout
- Elevation: Side view of a wall or facade
- Section: Cross-section cut through a structure
- Detail: Zoomed-in view of specific construction detail (joinery, connection, etc.)
- Site plan: Overview of the whole site/property`

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY not configured. Add it to your .env.local file." },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { messages, hasPhoto } = body as {
      messages: { role: "user" | "assistant"; content: string }[]
      hasPhoto: boolean
    }

    const client = new Anthropic({ apiKey })

    const response = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    })

    const text =
      response.content[0].type === "text" ? response.content[0].text : ""

    const readyToGenerate = text.includes("[READY_TO_GENERATE]")
    const cleanText = text.replace("[READY_TO_GENERATE]", "").trim()

    return NextResponse.json({
      text: cleanText,
      readyToGenerate,
    })
  } catch (error: unknown) {
    console.error("Chat error:", error)
    const message = error instanceof Error ? error.message : "Chat failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
