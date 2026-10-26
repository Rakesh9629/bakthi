import { useState, useEffect } from 'react'
import { Mail, Phone, Calendar, Trash2, RefreshCw, MessageSquare } from 'lucide-react'
import { Badge, Button } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function AdminEnquiriesPage() {
  const { adminToken } = useAuth()
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)

  const reloadEnquiries = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/enquiries', {
        headers: {
          Authorization: `Bearer ${adminToken || ''}`,
        },
      })
      if (res.ok) {
        const data = await res.json()
        setEnquiries(data)
      } else {
        const local = JSON.parse(localStorage.getItem('bhakthi_demo_enquiries') || '[]')
        setEnquiries(local)
      }
    } catch {
      const local = JSON.parse(localStorage.getItem('bhakthi_demo_enquiries') || '[]')
      setEnquiries(local)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    fetch('/api/admin/enquiries', {
      headers: {
        Authorization: `Bearer ${adminToken || ''}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active) return
        if (Array.isArray(data)) {
          setEnquiries(data)
        } else {
          const local = JSON.parse(localStorage.getItem('bhakthi_demo_enquiries') || '[]')
          setEnquiries(local)
        }
        setLoading(false)
      })
      .catch(() => {
        if (!active) return
        const local = JSON.parse(localStorage.getItem('bhakthi_demo_enquiries') || '[]')
        setEnquiries(local)
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [adminToken])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return
    try {
      await fetch(`/api/admin/enquiries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken || ''}` },
      })
      setEnquiries((prev) => prev.filter((e) => e.id !== id))
      toast.success('Enquiry removed')
    } catch {
      setEnquiries((prev) => prev.filter((e) => e.id !== id))
      toast.success('Enquiry removed')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-stone-900">Customer Inquiries</h1>
          <p className="text-sm text-stone-500">
            Messages received from the website Contact Us page and forwarded to bhakthiprintings@gmail.com.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={reloadEnquiries}
          className="gap-2 self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </Button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-stone-400">Loading enquiries...</div>
      ) : enquiries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200/80 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto">
            <MessageSquare size={24} />
          </div>
          <h3 className="font-semibold text-stone-800">No Inquiries Yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Customer inquiries submitted through your Contact Us form will appear here and are dispatched to bhakthiprintings@gmail.com.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((enq) => (
            <div
              key={enq.id}
              className="bg-white rounded-xl border border-stone-200/80 p-5 shadow-xs hover:border-amber-300 transition-colors space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div>
                  <h3 className="font-semibold text-stone-900 text-base">{enq.subject || 'General Inquiry'}</h3>
                  <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                    <span className="font-medium text-stone-800">{enq.name}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Mail size={12} />
                      <a href={`mailto:${enq.email}`} className="hover:underline text-amber-800">
                        {enq.email}
                      </a>
                    </span>
                    {enq.phone && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Phone size={12} />
                          <a href={`tel:${enq.phone}`} className="hover:underline">
                            {enq.phone}
                          </a>
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="flex items-center gap-1 text-[11px] text-stone-400">
                    <Calendar size={12} />
                    <span>{enq.date}</span>
                  </div>
                  <Badge variant={enq.emailSent ? 'green' : 'amber'}>
                    {enq.emailSent ? 'Email Dispatched' : 'Recorded in DB'}
                  </Badge>
                  <button
                    onClick={() => handleDelete(enq.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Delete Inquiry"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <p className="text-sm text-stone-700 whitespace-pre-wrap leading-relaxed bg-stone-50/70 p-3.5 rounded-lg border border-stone-100">
                {enq.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
