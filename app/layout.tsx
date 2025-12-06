import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Playfair_Display, Noto_Serif_HK } from "next/font/google"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
})

const notoSerifHK = Noto_Serif_HK({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-noto-serif-hk",
  display: "swap",
})

export const metadata: Metadata = {
  title: "thoughts.txt",
  description: "things and thoughts and artefacts",
  generator: 'v0.app',
  openGraph: {
    title: "thoughts.txt [慧慧]",
    description: "i blunder words and overthink",
    url: "https://creaturewai.net",
    siteName: "thoughts.txt",
    images: [
      {
        url: "https://creaturewai.net/teahouse_hk.jpg",
        width: 1500,
        height: 1000,
      },
    ],
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${notoSerifHK.variable}`}>
      <body>
        <div className="film-container">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  )
}
