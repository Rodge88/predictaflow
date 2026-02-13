// ============================================
// SVG Drawing Engine for Construction Sketches
// ============================================

import type {
  Drawing,
  DrawingElement,
  WallElement,
  DoorElement,
  WindowElement,
  DimensionElement,
  NoteElement,
  LineElement,
  RectElement,
  StructuralElement,
  StairsElement,
  DimensionUnit,
} from "./types"

/** Convert mm value to display string with unit */
export function formatDimension(valueMm: number, unit: DimensionUnit): string {
  switch (unit) {
    case "mm":
      return `${Math.round(valueMm)}mm`
    case "cm":
      return `${(valueMm / 10).toFixed(1)}cm`
    case "m":
      return `${(valueMm / 1000).toFixed(2)}m`
    case "in":
      return `${(valueMm / 25.4).toFixed(1)}"`
    case "ft":
      const totalInches = valueMm / 25.4
      const feet = Math.floor(totalInches / 12)
      const inches = Math.round(totalInches % 12)
      return `${feet}'${inches}"`
    default:
      return `${Math.round(valueMm)}mm`
  }
}

/** Calculate SVG scale factor to fit drawing in viewport */
export function calculateScale(
  drawingWidthMm: number,
  drawingHeightMm: number,
  viewportWidth: number,
  viewportHeight: number,
  padding: number = 60
): number {
  const availableW = viewportWidth - padding * 2
  const availableH = viewportHeight - padding * 2
  const scaleX = availableW / drawingWidthMm
  const scaleY = availableH / drawingHeightMm
  return Math.min(scaleX, scaleY)
}

/** Generate SVG for a wall */
export function renderWall(wall: WallElement, scale: number): string {
  const x1 = wall.x1 * scale
  const y1 = wall.y1 * scale
  const x2 = wall.x2 * scale
  const y2 = wall.y2 * scale
  const thickness = Math.max(wall.thickness * scale, 2)

  // Calculate perpendicular offset for wall thickness
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len === 0) return ""

  const nx = (-dy / len) * (thickness / 2)
  const ny = (dx / len) * (thickness / 2)

  return `<polygon
    data-id="${wall.id}"
    data-type="wall"
    points="${x1 + nx},${y1 + ny} ${x2 + nx},${y2 + ny} ${x2 - nx},${y2 - ny} ${x1 - nx},${y1 - ny}"
    fill="#2d2d2d"
    stroke="#1a1a1a"
    stroke-width="0.5"
    class="drawing-element"
  />`
}

/** Generate SVG for a door */
export function renderDoor(door: DoorElement, scale: number): string {
  const x = door.x * scale
  const y = door.y * scale
  const w = door.width * scale

  const transform = `translate(${x}, ${y}) rotate(${door.angle})`

  if (door.swing === "sliding") {
    return `<g data-id="${door.id}" data-type="door" transform="${transform}" class="drawing-element">
      <line x1="0" y1="0" x2="${w}" y2="0" stroke="#fff" stroke-width="${Math.max(4, 8 * scale)}" />
      <line x1="0" y1="-2" x2="${w * 0.6}" y2="-2" stroke="#1a1a1a" stroke-width="2" />
      <line x1="${w * 0.4}" y1="2" x2="${w}" y2="2" stroke="#1a1a1a" stroke-width="2" stroke-dasharray="4,2" />
    </g>`
  }

  const swingDir = door.swing === "right" ? 1 : -1
  const arcFlag = door.swing === "right" ? "0,1" : "0,0"

  return `<g data-id="${door.id}" data-type="door" transform="${transform}" class="drawing-element">
    <line x1="0" y1="0" x2="${w}" y2="0" stroke="#fff" stroke-width="${Math.max(4, 8 * scale)}" />
    <line x1="0" y1="0" x2="0" y2="${w * swingDir}" stroke="#1a1a1a" stroke-width="1.5" />
    <path d="M 0 ${w * swingDir} A ${w} ${w} 0 ${arcFlag} ${w} 0"
      fill="none" stroke="#1a1a1a" stroke-width="1" stroke-dasharray="4,2" />
  </g>`
}

/** Generate SVG for a window */
export function renderWindow(window: WindowElement, scale: number): string {
  const x = window.x * scale
  const y = window.y * scale
  const w = window.width * scale

  const transform = `translate(${x}, ${y}) rotate(${window.angle})`

  return `<g data-id="${window.id}" data-type="window" transform="${transform}" class="drawing-element">
    <line x1="0" y1="0" x2="${w}" y2="0" stroke="#fff" stroke-width="${Math.max(4, 8 * scale)}" />
    <line x1="0" y1="-3" x2="${w}" y2="-3" stroke="#1a1a1a" stroke-width="1.5" />
    <line x1="0" y1="3" x2="${w}" y2="3" stroke="#1a1a1a" stroke-width="1.5" />
    <line x1="0" y1="-3" x2="0" y2="3" stroke="#1a1a1a" stroke-width="1" />
    <line x1="${w}" y1="-3" x2="${w}" y2="3" stroke="#1a1a1a" stroke-width="1" />
    <line x1="${w / 2}" y1="-3" x2="${w / 2}" y2="3" stroke="#1a1a1a" stroke-width="0.5" />
  </g>`
}

/** Generate SVG for a dimension annotation */
export function renderDimension(
  dim: DimensionElement,
  scale: number,
  unit: DimensionUnit
): string {
  const x1 = dim.x1 * scale
  const y1 = dim.y1 * scale
  const x2 = dim.x2 * scale
  const y2 = dim.y2 * scale
  const offset = dim.offset * scale

  // Calculate direction perpendicular to the dimension line
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len === 0) return ""

  const nx = -dy / len
  const ny = dx / len

  // Offset points
  const ox1 = x1 + nx * offset
  const oy1 = y1 + ny * offset
  const ox2 = x2 + nx * offset
  const oy2 = y2 + ny * offset

  // Extension lines
  const ext = 6
  const gap = 3

  // Midpoint for text
  const mx = (ox1 + ox2) / 2
  const my = (oy1 + oy2) / 2

  // Angle for text rotation
  let angle = Math.atan2(dy, dx) * (180 / Math.PI)
  if (angle > 90 || angle < -90) angle += 180

  const displayText = dim.label || formatDimension(dim.value, dim.unit || unit)
  const tickSize = 4

  return `<g data-id="${dim.id}" data-type="dimension" class="drawing-element dimension-element" style="cursor:pointer">
    <!-- Extension lines -->
    <line x1="${x1 + nx * gap}" y1="${y1 + ny * gap}" x2="${ox1 + nx * ext}" y2="${oy1 + ny * ext}"
      stroke="#e63946" stroke-width="0.7" />
    <line x1="${x2 + nx * gap}" y1="${y2 + ny * gap}" x2="${ox2 + nx * ext}" y2="${oy2 + ny * ext}"
      stroke="#e63946" stroke-width="0.7" />
    <!-- Dimension line -->
    <line x1="${ox1}" y1="${oy1}" x2="${ox2}" y2="${oy2}"
      stroke="#e63946" stroke-width="0.8" />
    <!-- Tick marks -->
    <line x1="${ox1 - nx * tickSize}" y1="${oy1 - ny * tickSize}"
      x2="${ox1 + nx * tickSize}" y2="${oy1 + ny * tickSize}"
      stroke="#e63946" stroke-width="1.2" />
    <line x1="${ox2 - nx * tickSize}" y1="${oy2 - ny * tickSize}"
      x2="${ox2 + nx * tickSize}" y2="${oy2 + ny * tickSize}"
      stroke="#e63946" stroke-width="1.2" />
    <!-- Text background -->
    <rect x="${mx - 24}" y="${my - 8}" width="48" height="16" rx="2"
      fill="white" stroke="none" transform="rotate(${angle}, ${mx}, ${my})" />
    <!-- Text -->
    <text x="${mx}" y="${my + 4}"
      text-anchor="middle" font-size="11" font-family="monospace"
      fill="#e63946" font-weight="600"
      transform="rotate(${angle}, ${mx}, ${my})">
      ${displayText}
    </text>
  </g>`
}

/** Generate SVG for a note */
export function renderNote(note: NoteElement, scale: number): string {
  const x = note.x * scale
  const y = note.y * scale
  const fontSize = note.fontSize || 10

  return `<g data-id="${note.id}" data-type="note" class="drawing-element">
    <text x="${x}" y="${y}" font-size="${fontSize}" font-family="sans-serif"
      fill="#457b9d" font-style="italic">
      ${note.text}
    </text>
  </g>`
}

/** Generate SVG for a line */
export function renderLine(line: LineElement, scale: number): string {
  const x1 = line.x1 * scale
  const y1 = line.y1 * scale
  const x2 = line.x2 * scale
  const y2 = line.y2 * scale

  return `<line
    data-id="${line.id}" data-type="line"
    x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
    stroke="#1a1a1a" stroke-width="${line.strokeWidth || 1}"
    ${line.dashed ? 'stroke-dasharray="6,3"' : ""}
    class="drawing-element"
  />`
}

/** Generate SVG for a rectangle */
export function renderRect(rect: RectElement, scale: number): string {
  const x = rect.x * scale
  const y = rect.y * scale
  const w = rect.width * scale
  const h = rect.height * scale

  return `<g data-id="${rect.id}" data-type="rect" class="drawing-element">
    <rect x="${x}" y="${y}" width="${w}" height="${h}"
      fill="${rect.fill || 'none'}" stroke="#1a1a1a" stroke-width="1" />
    ${rect.label ? `<text x="${x + w / 2}" y="${y + h / 2 + 4}" text-anchor="middle" font-size="9" fill="#666">${rect.label}</text>` : ""}
  </g>`
}

/** Generate SVG for structural elements */
export function renderStructural(el: StructuralElement, scale: number): string {
  const x1 = el.x1 * scale
  const y1 = el.y1 * scale
  const x2 = el.x2 * scale
  const y2 = el.y2 * scale
  const w = el.width * scale

  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len === 0) return ""

  const nx = (-dy / len) * (w / 2)
  const ny = (dx / len) * (w / 2)

  const fillColor = el.type === "beam" ? "#d4a574" : el.type === "joist" ? "#c9a96e" : "#b8956a"

  return `<g data-id="${el.id}" data-type="${el.type}" class="drawing-element">
    <polygon
      points="${x1 + nx},${y1 + ny} ${x2 + nx},${y2 + ny} ${x2 - nx},${y2 - ny} ${x1 - nx},${y1 - ny}"
      fill="${fillColor}" fill-opacity="0.3"
      stroke="#8b6914" stroke-width="1" />
    <!-- Cross hatching for timber -->
    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#8b6914" stroke-width="0.5" stroke-dasharray="2,4" />
    ${el.label ? `<text x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2 - w / 2 - 4}" text-anchor="middle" font-size="8" fill="#8b6914">${el.label}</text>` : ""}
  </g>`
}

/** Generate SVG for stairs */
export function renderStairs(stairs: StairsElement, scale: number): string {
  const x = stairs.x * scale
  const y = stairs.y * scale
  const w = stairs.width * scale
  const l = stairs.length * scale
  const stepDepth = l / stairs.steps

  let lines = ""
  for (let i = 0; i <= stairs.steps; i++) {
    const sy = y + i * stepDepth
    lines += `<line x1="${x}" y1="${sy}" x2="${x + w}" y2="${sy}" stroke="#1a1a1a" stroke-width="0.8" />`
  }

  // Arrow indicating direction
  const arrowY = stairs.direction === "up" ? y + 10 : y + l - 10
  const arrowDir = stairs.direction === "up" ? -1 : 1

  return `<g data-id="${stairs.id}" data-type="stairs" transform="rotate(${stairs.angle}, ${x + w / 2}, ${y + l / 2})" class="drawing-element">
    <rect x="${x}" y="${y}" width="${w}" height="${l}" fill="none" stroke="#1a1a1a" stroke-width="1" />
    ${lines}
    <line x1="${x + w / 2}" y1="${y + l / 2}" x2="${x + w / 2}" y2="${arrowY}"
      stroke="#1a1a1a" stroke-width="1.5" marker-end="url(#arrowhead)" />
    <text x="${x + w / 2}" y="${y + l / 2}" text-anchor="middle" font-size="8" fill="#666">
      ${stairs.direction === "up" ? "UP" : "DN"}
    </text>
  </g>`
}

/** Render a single element */
export function renderElement(
  el: DrawingElement,
  scale: number,
  unit: DimensionUnit
): string {
  switch (el.type) {
    case "wall":
      return renderWall(el, scale)
    case "door":
      return renderDoor(el, scale)
    case "window":
      return renderWindow(el, scale)
    case "dimension":
      return renderDimension(el, scale, unit)
    case "note":
      return renderNote(el, scale)
    case "line":
      return renderLine(el, scale)
    case "rect":
      return renderRect(el, scale)
    case "beam":
    case "joist":
    case "stud":
      return renderStructural(el, scale)
    case "stairs":
      return renderStairs(el, scale)
    default:
      return ""
  }
}

/** Generate the title block SVG */
export function renderTitleBlock(
  drawing: Drawing,
  svgWidth: number,
  svgHeight: number
): string {
  const blockH = 60
  const blockW = 220
  const x = svgWidth - blockW - 10
  const y = svgHeight - blockH - 10

  return `<g class="title-block">
    <rect x="${x}" y="${y}" width="${blockW}" height="${blockH}"
      fill="white" stroke="#1a1a1a" stroke-width="1.5" />
    <line x1="${x}" y1="${y + 20}" x2="${x + blockW}" y2="${y + 20}" stroke="#1a1a1a" stroke-width="0.5" />
    <line x1="${x}" y1="${y + 40}" x2="${x + blockW}" y2="${y + 40}" stroke="#1a1a1a" stroke-width="0.5" />
    <text x="${x + blockW / 2}" y="${y + 14}" text-anchor="middle" font-size="11" font-weight="bold" fill="#1a1a1a">
      ${drawing.title}
    </text>
    <text x="${x + 6}" y="${y + 33}" font-size="8" fill="#666">
      Scale: ${drawing.scale}
    </text>
    <text x="${x + blockW / 2}" y="${y + 33}" font-size="8" fill="#666">
      Units: ${drawing.unit}
    </text>
    <text x="${x + blockW - 6}" y="${y + 33}" text-anchor="end" font-size="8" fill="#666">
      ${drawing.type.replace("_", " ").toUpperCase()}
    </text>
    <text x="${x + 6}" y="${y + 53}" font-size="8" fill="#666">
      ${drawing.drawnBy || "SketchTool"}
    </text>
    <text x="${x + blockW - 6}" y="${y + 53}" text-anchor="end" font-size="8" fill="#666">
      ${new Date(drawing.updatedAt).toLocaleDateString()}
    </text>
  </g>`
}

/** Generate the complete SVG string for a drawing */
export function generateSVG(
  drawing: Drawing,
  viewportWidth: number,
  viewportHeight: number
): string {
  const padding = 60
  const scale = calculateScale(
    drawing.width,
    drawing.height,
    viewportWidth,
    viewportHeight,
    padding
  )

  // Render all elements (dimensions on top)
  const nonDimElements = drawing.elements.filter((e) => e.type !== "dimension")
  const dimElements = drawing.elements.filter((e) => e.type === "dimension")

  const elementsStr = [...nonDimElements, ...dimElements]
    .map((el) => renderElement(el, scale, drawing.unit))
    .join("\n")

  const titleBlock = renderTitleBlock(drawing, viewportWidth, viewportHeight)

  return `<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 ${viewportWidth} ${viewportHeight}"
    width="${viewportWidth}"
    height="${viewportHeight}"
    class="sketch-svg"
  >
    <defs>
      <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="#1a1a1a" />
      </marker>
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e8e8e8" stroke-width="0.5" />
      </pattern>
    </defs>

    <!-- Border -->
    <rect x="5" y="5" width="${viewportWidth - 10}" height="${viewportHeight - 10}"
      fill="white" stroke="#1a1a1a" stroke-width="2" />

    <!-- Grid -->
    <rect x="6" y="6" width="${viewportWidth - 12}" height="${viewportHeight - 12}"
      fill="url(#grid)" />

    <!-- Drawing content -->
    <g transform="translate(${padding}, ${padding})">
      ${elementsStr}
    </g>

    <!-- Title block -->
    ${titleBlock}
  </svg>`
}
