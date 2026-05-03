import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, CheckCircle2 } from 'lucide-react'
import api from '@/api/client'
import { useCMSStore } from '@/store/cmsStore'

export default function NewsletterPopup() {
  const { systemName } = useCMSStore()
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  // Settings from backend (could be fetched or passed)
  const [popupSettings, setPopupSettings] = useState({
    title: 'Unlock 20% Off Your First Order',
    subtitle: `Join the ${systemName} inner circle and stay updated with exclusive drops and premium tech lifestyle insights.`,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=1200',
    buttonText: 'Join the Circle'
  })

  useEffect(() => {
    // Check if user already saw it or subscribed
    const hasSeen = localStorage.getItem('newsletter_popup_seen')
    const isSubscribed = localStorage.getItem('newsletter_subscribed')

    if (!hasSeen && !isSubscribed) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 5000) // Show after 5 seconds
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
      // Fetch settings from backend
      api.get('/settings').then(res => {
          if (res.data.newsletter_popup_title) {
              setPopupSettings({
                  title: res.data.newsletter_popup_title,
                  subtitle: res.data.newsletter_popup_subtitle || popupSettings.subtitle,
                  image: res.data.newsletter_popup_image || popupSettings.image,
                  buttonText: res.data.newsletter_popup_button_text || popupSettings.buttonText
              })
          }
      })
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem('newsletter_popup_seen', 'true')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      await api.post('/newsletter/subscribe', { email })
      setStatus('success')
      localStorage.setItem('newsletter_subscribed', 'true')
      setTimeout(() => setIsOpen(false), 3000)
    } catch (err: any) {
      setStatus('error')
      setMessage(err.response?.data?.message || 'Something went wrong. Please try again.')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-obsidian/60 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl bg-white rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row"
          >
            {/* Close Button */}
            <button 
              onClick={handleClose}
              className="absolute top-6 right-6 z-10 p-2 bg-white/20 hover:bg-white/40 text-white md:text-obsidian md:bg-transparent md:hover:bg-premium-bg rounded-full transition-all"
            >
              <X size={20} />
            </button>

            {/* Image Column */}
            <div className="w-full md:w-1/2 h-64 md:h-auto relative">
              <img 
                src={popupSettings.image} 
                alt="Newsletter" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/40 to-transparent md:hidden" />
            </div>

            {/* Content Column */}
            <div className="w-full md:w-1/2 p-10 lg:p-16 flex flex-col justify-center text-center md:text-left">
              <div className="space-y-6">
                <div>
                  <h2 className="text-premium-secondary text-[10px] tracking-[0.5em] uppercase font-bold mb-4">Elite Membership</h2>
                  <h3 className="text-3xl lg:text-4xl font-serif font-black text-premium-primary leading-tight uppercase tracking-tighter">
                    {popupSettings.title}
                  </h3>
                </div>

                <p className="text-premium-text-muted text-sm font-medium leading-relaxed">
                  {popupSettings.subtitle}
                </p>

                {status === 'success' ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center md:items-start gap-4 py-4"
                  >
                    <div className="flex items-center gap-3 text-emerald-600">
                      <CheckCircle2 size={32} />
                      <p className="text-lg font-bold">Welcome to the inner circle!</p>
                    </div>
                    <p className="text-sm text-premium-text-muted">Check your inbox for your exclusive code.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-premium-text-muted/40" size={18} />
                      <input 
                        type="email" 
                        required
                        placeholder="Your premium email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-premium-bg border border-premium-divider/50 rounded-full py-4 pl-14 pr-6 text-sm outline-none focus:border-premium-secondary transition-all"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full bg-premium-primary text-white rounded-full py-4 text-[10px] tracking-[0.3em] uppercase font-black hover:bg-premium-secondary shadow-lg transition-all disabled:opacity-50"
                    >
                      {status === 'loading' ? 'Processing...' : popupSettings.buttonText}
                    </button>
                    {status === 'error' && (
                      <p className="text-xs text-red-500 font-medium ml-2">{message}</p>
                    )}
                  </form>
                )}

                <p className="text-[8px] text-premium-text-muted/40 uppercase tracking-[0.2em] font-bold">
                  By joining, you agree to our Privacy Policy and Terms. You can unsubscribe at any time.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
