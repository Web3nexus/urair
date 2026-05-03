import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { curationsApi } from '@/api/curations'
import { ArrowRight } from 'lucide-react'

export default function CurationsPage() {
  const { data: curations = [], isLoading } = useQuery({
    queryKey: ['curations'],
    queryFn: curationsApi.getAll
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-premium-bg">
        <div className="w-12 h-12 border-4 border-premium-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 lg:pt-40 pb-32 bg-premium-bg">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-24 space-y-8">
          <p className="text-premium-secondary text-[10px] tracking-[0.5em] uppercase font-black">Expert Intelligence</p>
          <h1 className="text-6xl lg:text-8xl font-black uppercase tracking-tighter text-premium-primary leading-none">
            The <span className="text-premium-secondary">Curations</span>
          </h1>
          <p className="text-premium-text-muted max-w-2xl mx-auto text-lg font-medium leading-relaxed">
            Meticulously architected sets of tech gear, curated for specific professional protocols and lifestyle high-performance.
          </p>
        </div>

        {/* Curations Grid */}
        <div className="grid gap-20">
          {curations.map((curation: any, idx: number) => (
            <motion.div
              key={curation.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className="group relative"
            >
              <Link to={`/curations/${curation.slug}`} className="block">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                  <div className="aspect-[16/10] bg-white rounded-[40px] overflow-hidden border border-premium-divider/50 shadow-2xl group-hover:scale-[1.02] transition-transform duration-1000">
                    <img 
                      src={curation.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"} 
                      alt={curation.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                  </div>
                  <div className="space-y-10">
                    <div className="space-y-6">
                      <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-premium-primary group-hover:text-premium-secondary transition-colors duration-500">
                        {curation.name}
                      </h2>
                      <p className="text-premium-text-muted text-lg leading-relaxed font-medium">
                        {curation.description}
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-6 text-premium-primary text-[10px] tracking-[0.4em] uppercase font-black">
                      View Selection 
                      <div className="w-12 h-[1px] bg-premium-divider transition-all group-hover:w-20 group-hover:bg-premium-secondary" />
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
