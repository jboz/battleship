import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NavBar from './(core)/navbar'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Battle ship',
  description: 'Battle ship network game',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header><NavBar /></header>
        <main>{children}</main>
      </body>
    </html>
  )
}
