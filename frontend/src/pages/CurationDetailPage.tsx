import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { curationsApi } from '@/api/curations'
import { Star, Heart, ArrowLeft } from 'lucide-react'
import { Price } from '@/components/Price'

export default function CurationDetailPage() {
  const { slug } = useParams<{ slug: string }>()

  const { data: curation, isLoading } = useQuery({
    queryKey: ['curation', slug],
    queryFn: () => curationsApi.getBySlug(slug!),
    enabled: !!slug
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-premium-bg">
        <div className="w-12 h-12 border-4 border-premium-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!curation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-premium-bg">
        <h1 className="text-4xl font-black uppercase text-premium-primary">Curation Not Found</h1>
        <Link to="/curations" className="mt-8 text-premium-secondary underline uppercase tracking-widest text-xs">Back to Curations</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 lg:pt-40 bg-premium-bg">
      {/* Hero Section */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <img 
          src={curation.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"} 
          alt={curation.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-premium-bg via-premium-bg/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-12 lg:p-24 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-4 text-premium-secondary text-[10px] tracking-[0.6em] uppercase font-black">
              <Link to="/curations" className="hover:text-premium-primary transition-colors flex items-center gap-2">
                <ArrowLeft size={12} /> Curations
              </Link>
              <div className="w-8 h-[1px] bg-premium-secondary/30" />
              Volume 01
            </div>
            <h1 className="text-6xl lg:text-8xl font-black uppercase tracking-tighter text-premium-primary leading-[0.9]">
              {curation.name}
            </h1>
            <p className="text-premium-text-muted max-w-2xl text-xl font-medium leading-relaxed">
              {curation.description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-32">
        <div className="flex items-center justify-between mb-20">
           <h2 className="text-3xl font-black uppercase tracking-tight text-premium-primary">The Selected Layer</h2>
           <div className="text-[10px] tracking-[0.4em] uppercase text-premium-text-muted font-bold">
             {curation.products?.length || 0} Professional Assets
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {curation.products?.map((product: any, idx: number) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <Link to={`/product/${product.slug}`} className="group space-y-8">
                <div className="aspect-square bg-white rounded-[40px] overflow-hidden border border-premium-divider/50 shadow-sm hover:shadow-2xl transition-all duration-700 relative">
                  <img 
                    src={product.images?.[0] || ""} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute top-6 right-6 p-4 bg-white/80 backdrop-blur-md rounded-full shadow-lg text-premium-text-muted scale-0 group-hover:scale-100 transition-all duration-500">
                    <Heart size={18} />
                  </div>
                </div>
                <div className="space-y-4 px-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-[10px] tracking-widest text-premium-secondary uppercase font-black">{product.brand?.name}</p>
                      <h3 className="text-xl font-black text-premium-primary uppercase tracking-tight leading-none group-hover:text-premium-secondary transition-colors">
                        {product.name}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-premium-divider/30">
                    <Price amount={product.price} className="text-2xl font-black text-premium-primary" />
                    <div className="flex items-center gap-2">
                       <Star size={14} className="text-premium-accent" fill="currentColor" />
                       <span className="text-[10px] font-black tracking-widest text-premium-text-muted">{product.rating}</span>
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
