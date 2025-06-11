import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

// Simplified font loading - just use Inter and load others via CSS
const inter = Inter({ subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: "🎉 Happy Birthday Dr. Fredah Banda! ✨",
  description: "A magical birthday book celebration filled with love, wonder, and enchantment",
  keywords: "birthday, celebration, magical, book, Dr. Fredah Banda",
  authors: [{ name: "Birthday Magic Creator" }],
  openGraph: {
    title: "🎉 Happy Birthday Dr. Fredah Banda! ✨",
    description: "A magical birthday book celebration",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Dancing+Script:wght@400;700&family=Poppins:wght@300;400;500;600;700&family=Great+Vibes&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}
