import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "SketchTool - Site Sketch Generator",
  description:
    "Take a photo on-site, chat with AI, get a professional technical drawing. Built for tradespeople.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function SketchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-background">
      {children}
    </div>
  )
}
