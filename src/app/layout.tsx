import { Header } from '@/components/header'
import { AuthProvider } from '@/providers/auth'

import '@/styles/globals.css'


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <html lang="en">
      <body>
        <AuthProvider>
          <Header />
        </AuthProvider>
        <main>{children}</main>
      </body>
    </html>
    </>
  )
}