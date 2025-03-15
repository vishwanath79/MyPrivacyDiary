import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-[#0f1015] text-gray-100 min-h-screen flex flex-col">
        <div className="flex-grow">
          {children}
        </div>
        <footer className="w-full py-4 text-center border-t border-gray-800 mt-auto">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} ingvay7. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  )
} 