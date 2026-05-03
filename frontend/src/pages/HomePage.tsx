import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Mail, X } from 'lucide-react'
import { useCMSStore } from '@/store/cmsStore'
import { cn } from '@/utils/cn'
import { useQuery } from '@tanstack/react-query'
import { homepageApi } from '@/api/homepage'
import { Price } from '@/components/Price'
import { HeroSlider } from '@/components/HeroSlider'

export default function HomePage() {
  const { 
    announcementText, 
    showAnnouncement, 
    newsletterTitle, 
    newsletterPlaceholder, 
    newsletterButtonText 
  } = useCMSStore()

  const { data: sections = [], isLoading, isError } = useQuery({
    queryKey: ['homepage-sections'],
    queryFn: homepageApi.get
  })

  if (isLoading) {
    return (
      <div className="flex flex-col bg-white min-h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-obsidian border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6 text-center">
        <div className="space-y-4">
          <h1 className="text-2xl font-serif font-black text-obsidian uppercase">Connection Error</h1>
          <p className="text-stone">Failed to load storefront content. Please check your connection.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-white">
      {sections.map((section: any) => {
        switch (section.type) {
          case 'brand_carousel':
            return (
              <div key={section.id} className="bg-obsidian py-6 overflow-hidden whitespace-nowrap">
                <motion.div 
                  animate={{ x: [0, -1000] }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="flex gap-24 items-center"
                >
                  {(section.content?.brands || []).concat(section.content?.brands || []).map((brand: string, idx: number) => (
                    <img key={idx} src={brand} alt="Brand Logo" className="h-12 object-contain opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all max-w-[150px]" />
                  ))}
                </motion.div>
              </div>
            )
          case 'hero':
            return (
              <HeroSlider 
                key={section.id} 
                slides={section.content?.slides || []} 
                stats={section.content?.stats || [
                  { value: '200+', label: 'International Brands' },
                  { value: '2,000+', label: 'High-Quality Products' },
                  { value: '30,000+', label: 'Happy Customers' }
                ]} 
              />
            )

          case 'product_grid':
            return (
              <section key={section.id} className="py-24 container mx-auto px-6">
                <div className="text-center mb-16">
                  <h2 className="text-4xl lg:text-5xl font-serif font-black text-obsidian uppercase tracking-tight">{section.title}</h2>
                  {section.subtitle && <p className="text-stone mt-4 uppercase tracking-widest text-xs font-bold">{section.subtitle}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {section.items.map((item: any) => (
                    <ProductCard 
                      key={item.id}
                      {...item.product}
                    />
                  ))}
                </div>
                <div className="mt-16 text-center">
                  <Link to="/shop" className="inline-block border border-mist px-12 py-4 rounded-full text-[10px] tracking-[0.3em] uppercase font-bold text-obsidian hover:bg-bg-light transition-all">
                    View All
                  </Link>
                </div>
              </section>
            )

          case 'banner':
            return (
              <section key={section.id} className="py-24 container mx-auto px-6">
                <div 
                  className="relative h-[60vh] rounded-[40px] overflow-hidden group shadow-2xl" 
                  style={{ backgroundColor: section.content?.bg_color || '#000000' }}
                >
                  {section.content?.bg_image && (
                    <img 
                      src={section.content?.bg_image} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-60"
                      alt={section.title}
                    />
                  )}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10">
                    <motion.h2 
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      className="text-white text-5xl lg:text-7xl font-serif font-black uppercase mb-6 tracking-tighter leading-none"
                    >
                      {section.title}
                    </motion.h2>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-white/80 max-w-2xl text-lg mb-10 font-medium leading-relaxed"
                    >
                      {section.subtitle}
                    </motion.p>
                    <Link to={section.content?.cta_link || "/shop"} className="bg-white text-obsidian px-12 py-5 rounded-full text-xs tracking-[0.2em] uppercase font-black hover:bg-pearl transition-all hover:scale-105 shadow-xl">
                      {section.content?.cta_label || "Discover More"}
                    </Link>
                  </div>
                </div>
              </section>
            )

          case 'category_grid':
            return (
              <section key={section.id} className="py-24 container mx-auto px-6">
                <div className="bg-pearl rounded-[40px] p-10 lg:p-20">
                  <h2 className="font-serif text-4xl lg:text-6xl text-obsidian uppercase font-black text-center mb-16 tracking-tighter">
                    {section.title}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {section.items.map((item: any, idx: number) => {
                      const spans = [
                        'md:col-span-5 h-80',
                        'md:col-span-7 h-80',
                        'md:col-span-7 h-80',
                        'md:col-span-5 h-80'
                      ]
                      return (
                        <Link 
                          key={idx} 
                          to={item.link || '/shop'}
                          className={cn(
                            "relative bg-white rounded-3xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500",
                            spans[idx % 4]
                          )}
                        >
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.title} 
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                            />
                          )}
                          <div className="absolute top-8 left-10 z-10">
                            <h3 className="text-3xl font-black uppercase tracking-tighter leading-none" style={{ color: item.text_color || '#000000' }}>
                              {item.title}
                            </h3>
                            {item.subtitle && <p className="mt-2 text-xs font-bold uppercase tracking-widest opacity-70" style={{ color: item.text_color || '#000000' }}>{item.subtitle}</p>}
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5" />
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </section>
            )

          case 'testimonials':
            const testimonials = section.content?.testimonials || [];
            return (
              <section key={section.id} className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                  <div className="text-center mb-20">
                     <motion.h2 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      className="font-serif text-4xl lg:text-6xl text-obsidian uppercase font-black tracking-tighter"
                     >
                       {section.title}
                     </motion.h2>
                     {section.subtitle && <p className="text-stone mt-4 uppercase tracking-[0.3em] text-[10px] font-black">{section.subtitle}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t: any, idx: number) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-pearl p-10 rounded-[40px] space-y-8 flex flex-col justify-between hover:bg-mist/10 transition-colors group border border-transparent hover:border-mist"
                      >
                        <div className="space-y-6">
                          <div className="flex gap-1 text-gold">
                            {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                          </div>
                          <p className="text-obsidian text-xl font-medium leading-relaxed italic">"{t.quote}"</p>
                        </div>
                        <div className="flex items-center gap-4 border-t border-mist/30 pt-8">
                          {t.image && (
                            <img src={t.image} alt={t.author} className="w-12 h-12 rounded-full object-cover ring-2 ring-white" />
                          )}
                          <div>
                            <p className="text-obsidian font-black uppercase tracking-tighter text-sm">{t.author}</p>
                            <p className="text-stone text-[10px] font-bold uppercase tracking-widest">{t.role}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            )

          default:
            return null
        }
      })}

      {/* ── Newsletter Overlay ── */}
      <section className="px-6 lg:px-12 relative z-10 translate-y-1/2">
        <div className="max-w-7xl mx-auto bg-obsidian rounded-[40px] p-10 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl">
          <h2 className="font-serif text-4xl lg:text-5xl text-white uppercase font-black tracking-tight max-w-xl leading-[1]">
            {newsletterTitle}
          </h2>
          <div className="w-full max-w-md space-y-4">
            <div className="relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-stone/50" size={20} />
              <input 
                type="email" 
                placeholder={newsletterPlaceholder}
                className="w-full bg-white rounded-full py-5 pl-16 pr-8 text-sm outline-none focus:ring-2 ring-gold/20 transition-all font-medium"
              />
            </div>
            <button className="w-full bg-white text-obsidian rounded-full py-5 text-[10px] tracking-[0.3em] uppercase font-black hover:bg-pearl transition-all shadow-lg">
              {newsletterButtonText}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

function ProductCard({ name, price, old_price, rating, images, slug, promotion_badge }: any) {
  const imageUrl = Array.isArray(images) && images.length > 0 ? images[0] : null;

  return (
    <Link to={`/product/${slug}`} className="text-left space-y-4 group block">
      <div className="aspect-square bg-card-bg rounded-[20px] overflow-hidden relative flex items-center justify-center">
         {promotion_badge && (
           <div className="absolute top-4 left-4 px-3 py-1 bg-premium-secondary text-white text-[8px] font-black uppercase tracking-widest rounded-full z-10 shadow-lg">
             {promotion_badge}
           </div>
         )}
         {imageUrl ? (
           <img src={imageUrl} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
         ) : (
           <span className="text-stone/30 uppercase tracking-widest text-[10px] font-bold">No Image</span>
         )}
      </div>
      <div className="space-y-2">
        <h3 className="text-obsidian font-bold text-base truncate">{name}</h3>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 text-gold">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={14} fill={i < Math.floor(rating || 4) ? "currentColor" : "none"} />
            ))}
          </div>
          <span className="text-obsidian text-sm font-medium">{rating || 4.5}/<span className="text-stone">5</span></span>
        </div>
        <div className="flex items-center gap-3">
          <Price amount={price} className="text-obsidian text-xl font-bold" />
          {old_price && <Price amount={old_price} className="text-stone line-through font-bold text-xl" />}
          {old_price && typeof price === 'number' && typeof old_price === 'number' && (
            <span className="bg-red-500/10 text-red-500 text-xs px-2 py-1 rounded-full font-bold">
              -{Math.round((1 - price / old_price) * 100)}%
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

function DressStyleCard({ label, className }: { label: string; className?: string }) {
  return (
    <div className={cn("relative bg-white rounded-[20px] overflow-hidden group cursor-pointer", className)}>
       <div className="absolute top-6 left-8 z-10">
          <h3 className="text-obsidian text-3xl font-bold">{label}</h3>
       </div>
       <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5" />
    </div>
  )
}

