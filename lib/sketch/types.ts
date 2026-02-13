// ============================================
// Carpentry Sketch Tool - Type Definitions
// ============================================

/** Units for dimensions */
export type DimensionUnit = "mm" | "cm" | "m" | "in" | "ft"

/** Types of drawings the tool can generate */
export type DrawingType = "floor_plan" | "elevation" | "section" | "detail" | "site_plan"

/** Types of drawing elements */
export type ElementType =
  | "wall"
  | "door"
  | "window"
  | "dimension"
  | "note"
  | "line"
  | "rect"
  | "arc"
  | "stud"
  | "beam"
  | "joist"
  | "stairs"

/** A point in 2D space (in mm) */
export interface Point {
  x: number
  y: number
}

/** A wall element */
export interface WallElement {
  type: "wall"
  id: string
  x1: number
  y1: number
  x2: number
  y2: number
  thickness: number // mm
  label?: string
}

/** A door element */
export interface DoorElement {
  type: "door"
  id: string
  x: number
  y: number
  width: number // mm
  wallId?: string
  swing: "left" | "right" | "double" | "sliding"
  angle: number // rotation in degrees
}

/** A window element */
export interface WindowElement {
  type: "window"
  id: string
  x: number
  y: number
  width: number // mm
  wallId?: string
  angle: number // rotation in degrees
}

/** A dimension annotation */
export interface DimensionElement {
  type: "dimension"
  id: string
  x1: number
  y1: number
  x2: number
  y2: number
  value: number // the actual measurement in mm
  unit: DimensionUnit
  offset: number // how far the dimension line is from the element
  label?: string // override display text
}

/** A text note */
export interface NoteElement {
  type: "note"
  id: string
  x: number
  y: number
  text: string
  fontSize?: number
}

/** A generic line */
export interface LineElement {
  type: "line"
  id: string
  x1: number
  y1: number
  x2: number
  y2: number
  strokeWidth?: number
  dashed?: boolean
  label?: string
}

/** A rectangle element */
export interface RectElement {
  type: "rect"
  id: string
  x: number
  y: number
  width: number
  height: number
  label?: string
  fill?: string
}

/** A structural element (beam, joist, stud) */
export interface StructuralElement {
  type: "beam" | "joist" | "stud"
  id: string
  x1: number
  y1: number
  x2: number
  y2: number
  width: number
  depth: number
  label?: string
}

/** A staircase element */
export interface StairsElement {
  type: "stairs"
  id: string
  x: number
  y: number
  width: number
  length: number
  steps: number
  angle: number
  direction: "up" | "down"
}

/** Union of all drawing elements */
export type DrawingElement =
  | WallElement
  | DoorElement
  | WindowElement
  | DimensionElement
  | NoteElement
  | LineElement
  | RectElement
  | StructuralElement
  | StairsElement

/** The complete drawing data */
export interface Drawing {
  id: string
  type: DrawingType
  title: string
  description?: string
  unit: DimensionUnit
  scale: string // e.g. "1:50", "1:100"
  elements: DrawingElement[]
  width: number // viewport width in mm
  height: number // viewport height in mm
  createdAt: string
  updatedAt: string
  projectName?: string
  drawnBy?: string
  notes?: string[]
}

/** Chat message in the sketch workflow */
export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  imageUrl?: string // for photo messages
}

/** The overall sketch session state */
export interface SketchSession {
  id: string
  step: "capture" | "chat" | "drawing" | "export"
  photoUrl: string | null
  photoFile: File | null
  messages: ChatMessage[]
  drawing: Drawing | null
  isAnalyzing: boolean
  isGenerating: boolean
}

/** AI analysis response from photo */
export interface PhotoAnalysis {
  description: string
  identifiedElements: string[]
  estimatedDimensions: {
    element: string
    estimated_mm: number
    confidence: "high" | "medium" | "low"
  }[]
  suggestedDrawingType: DrawingType
  suggestedScale: string
  followUpQuestions: string[]
}

/** Request to generate a drawing */
export interface GenerateDrawingRequest {
  photoBase64?: string
  analysis?: PhotoAnalysis
  drawingType: DrawingType
  userDimensions: Record<string, number> // key -> mm
  notes: string[]
  title: string
  unit: DimensionUnit
}
