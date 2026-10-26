import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-amber-50">
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { borderRadius: '10px', fontSize: '14px' } }} />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
