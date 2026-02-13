import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PredictaFlow - AI-Powered Predictive Analytics",
  description: "Transform your business with AI-powered predictions. From retail inventory to hospitality management, make data-driven decisions with confidence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
