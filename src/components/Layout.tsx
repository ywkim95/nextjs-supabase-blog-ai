import Navbar from './Navbar'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-background">
      <Navbar />
      <main>{children}</main>
    </div>
  )
}