import { Link } from 'react-router-dom'
import { Home, ShoppingBag } from 'lucide-react'
import { Button } from '../components/ui'

export default function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-3xl font-serif font-bold mx-auto mb-4">
        🕉️
      </div>
      <h1 className="text-3xl font-bold font-serif text-stone-900 mb-2">Page Not Found</h1>
      <p className="text-sm text-stone-500 mb-6">
        The divine page you are looking for has moved or does not exist.
      </p>
      <div className="flex justify-center gap-3">
        <Link to="/">
          <Button variant="outline" className="gap-1.5">
            <Home size={16} /> Home
          </Button>
        </Link>
        <Link to="/shop">
          <Button className="gap-1.5">
            <ShoppingBag size={16} /> Browse Frames
          </Button>
        </Link>
      </div>
    </div>
  )
}