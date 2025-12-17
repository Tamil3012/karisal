import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import "antd/dist/reset.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import ColorVarsLoader from "@/components/color-vars-loader"




export const metadata: Metadata = {
  title: "Blog Hub - Insights and Inspiration",
  description: "Explore our curated collection of insights, tips, and industry trends to elevate your knowledge.",
  keywords: "blog, articles, insights, technology, frontend, backend, devops",
  generator: "v0.app",
  openGraph: {
    title: "Blog Hub",
    description: "Explore our curated collection of insights",
    type: "website",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <ColorVarsLoader />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
