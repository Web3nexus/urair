import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { cmsApi } from '@/api/cms'
import { motion } from 'framer-motion'

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>()

  const { data: page, isLoading, error } = useQuery({
    queryKey: ['page', slug],
    queryFn: () => cmsApi.getPage(slug!),
    enabled: !!slug
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-premium-bg">
        <div className="w-16 h-16 border-2 border-premium-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-premium-bg p-6 text-center space-y-8">
        <div className="space-y-4">
           <p className="text-premium-secondary text-[10px] tracking-[0.5em] uppercase font-black">Error 404</p>
           <h1 className="text-5xl lg:text-7xl font-black text-premium-primary uppercase tracking-tighter leading-none">Endpoint <span className="text-premium-secondary">Not Found</span></h1>
        </div>
        <p className="text-premium-text-muted max-w-md mx-auto font-medium text-lg leading-relaxed">The architectural layer you are attempting to access has been decommissioned or relocated.</p>
        <button onClick={() => window.history.back()} className="text-premium-primary text-[10px] tracking-widest uppercase font-black border border-premium-divider rounded-full px-12 py-4 hover:bg-premium-primary hover:text-white transition-all">Revert Protocol</button>
      </div>
    )
  }

  return (
    <div className="bg-premium-bg min-h-screen pt-40 pb-32">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-20"
        >
          <div className="text-center space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-4 text-premium-secondary text-[10px] tracking-[0.6em] uppercase font-black"
            >
              <div className="w-12 h-[1px] bg-premium-secondary/30" />
              Editorial Intelligence
              <div className="w-12 h-[1px] bg-premium-secondary/30" />
            </motion.div>
            <h1 className="text-6xl lg:text-8xl font-black text-premium-primary leading-[0.9] uppercase tracking-tighter max-w-4xl mx-auto">
              {page.title}
            </h1>
            <div className="w-24 h-1 bg-premium-secondary mx-auto mt-12 opacity-50" />
          </div>

          <div 
            className="prose prose-lg max-w-none text-premium-primary/80 leading-[1.8] font-medium selection:bg-premium-secondary selection:text-white"
            dangerouslySetInnerHTML={{ __html: page.content || '' }}
          />
          
          <div className="pt-20 border-t border-premium-divider flex justify-between items-center">
             <div className="text-[9px] tracking-[0.4em] uppercase text-premium-text-muted font-black">URAIR Internal Release 2.4.0</div>
             <div className="flex gap-8">
                {['Twitter', 'Instagram', 'LinkedIn'].map(social => (
                  <button key={social} className="text-[9px] tracking-widest uppercase font-black text-premium-secondary hover:text-premium-primary transition-colors">{social}</button>
                ))}
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
