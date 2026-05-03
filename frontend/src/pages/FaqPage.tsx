import { useQuery } from '@tanstack/react-query'
import { cmsApi } from '@/api/cms'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { cn } from '@/utils/cn'

export default function FaqPage() {
  const [openId, setOpenId] = useState<number | null>(null)

  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ['faqs'],
    queryFn: cmsApi.getFaqs
  })

  return (
    <div className="min-h-screen pt-40 pb-32">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-24 space-y-6">
          <p className="text-premium-secondary text-[10px] tracking-[0.5em] uppercase font-bold">Exclusive Assistance</p>
          <h1 className="text-6xl lg:text-7xl uppercase font-black tracking-tighter">
            General Inquiries
          </h1>
          <p className="text-premium-text-muted max-w-xl mx-auto text-lg font-medium leading-relaxed">Everything you need to know about our luxury collections, artisan crafting, and bespoke logistics.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-32">
            <div className="w-10 h-10 border-2 border-premium-secondary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {faqs.map((faq: any) => (
              <div key={faq.id} className="premium-card !p-0 overflow-hidden group">
                <button 
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-10 text-left transition-all duration-500"
                >
                  <span className={cn(
                    "font-black text-xl uppercase tracking-tight transition-colors duration-500",
                    openId === faq.id ? "text-premium-secondary" : "text-premium-primary"
                  )}>{faq.question}</span>
                  <div className={cn(
                    "p-2 rounded-full transition-all duration-500",
                    openId === faq.id ? "bg-premium-secondary text-white rotate-45 shadow-lg" : "bg-premium-bg text-premium-text-muted group-hover:bg-premium-divider/30"
                  )}>
                    <Plus size={20} strokeWidth={3} />
                  </div>
                </button>
                <AnimatePresence>
                  {openId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-10 pt-0 text-premium-text-muted text-lg font-medium leading-relaxed border-t border-premium-divider/20 mt-4">
                        <p className="pt-8">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
