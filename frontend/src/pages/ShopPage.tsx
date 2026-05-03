import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, SlidersHorizontal, Grid2X2, LayoutList, Heart, Star } from 'lucide-react'
import { motion } from 'framer-motion'

import { useQuery } from '@tanstack/react-query'
import { productsApi } from '@/api/products'
import api from '@/api/client'
import { cn } from '@/utils/cn'
import { Price } from '@/components/Price'

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: productsApi.getCategories
  })

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['shop-products', selectedCategory],
    queryFn: () => productsApi.getAll({ category_id: selectedCategory || undefined })
  })

  const { data: settings = {} } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => api.get('/settings').then(res => res.data)
  })

  return (
    <div className="min-h-screen pt-32 lg:pt-40">
      {/* ── Page Header ── */}
      <div className="border-b border-premium-divider py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          {/* ── Breadcrumb ── */}
          <nav className="flex justify-center gap-2 text-[10px] text-premium-text-muted tracking-[0.4em] uppercase mb-12">
            <Link to="/" className="hover:text-premium-secondary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-premium-secondary">Shop</span>
          </nav>

          <p className="text-premium-secondary text-[10px] tracking-[0.5em] uppercase mb-4 font-bold">Curated Essentials</p>
          <h1 className="text-6xl lg:text-7xl uppercase font-black tracking-tighter">{settings.shop_title || 'The Collection'}</h1>
          <p className="text-premium-text-muted font-medium mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
            {settings.shop_description || 'Elevate your workspace with our meticulously crafted selection of luxury laptop bags and tech-lifestyle accessories.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        {/* ── Toolbar ── */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 pb-8 border-b border-premium-divider gap-6">
          <p className="text-premium-text-muted text-xs tracking-widest uppercase font-bold">{products.length} Products Found</p>
          <div className="flex flex-wrap items-center gap-6">
            <button className="flex items-center gap-3 text-premium-primary text-[10px] tracking-[0.2em] uppercase font-bold hover:text-premium-secondary transition-colors border border-premium-divider px-8 py-3 rounded-full">
              <SlidersHorizontal size={14} />
              <span>Refine</span>
            </button>
            <div className="relative group">
              <select className="appearance-none bg-transparent border border-premium-divider text-premium-primary text-[10px] tracking-[0.2em] uppercase font-bold px-8 py-3 pr-12 rounded-full outline-none hover:border-premium-secondary transition-colors cursor-pointer">
                <option>Sort: Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-premium-text-muted">
                <ArrowRight size={12} className="rotate-90" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Category Tabs ── */}
        <div className="flex gap-10 mb-16 overflow-x-auto pb-4 scrollbar-hide border-b border-premium-divider/30">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "text-[10px] tracking-[0.3em] uppercase whitespace-nowrap pb-4 transition-all relative font-bold",
              selectedCategory === null 
              ? "text-premium-secondary" 
              : "text-premium-text-muted hover:text-premium-primary"
            )}
          >
            All Items
            {selectedCategory === null && <motion.div layoutId="activeCat" className="absolute bottom-0 left-0 right-0 h-0.5 bg-premium-secondary" />}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "text-[10px] tracking-[0.3em] uppercase whitespace-nowrap pb-4 transition-all relative font-bold",
                selectedCategory === cat.id 
                ? "text-premium-secondary" 
                : "text-premium-text-muted hover:text-premium-primary"
              )}
            >
              {cat.name}
              {selectedCategory === cat.id && <motion.div layoutId="activeCat" className="absolute bottom-0 left-0 right-0 h-0.5 bg-premium-secondary" />}
            </button>
          ))}
        </div>

        {/* ── Product Grid ── */}
        {isLoading ? (
          <div className="flex justify-center py-32">
            <div className="w-10 h-10 border-2 border-premium-secondary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {products.map((product) => (
              <Link key={product.id} to={`/product/${product.slug}`} className="group space-y-6">
                <div className="relative bg-white rounded-[30px] aspect-[1/1] flex items-center justify-center overflow-hidden border border-premium-divider/50 hover:border-premium-secondary/30 transition-all duration-500 shadow-sm hover:shadow-2xl">
                  {product.promotion_badge && (
                    <div className="absolute top-6 left-6 px-4 py-1.5 bg-premium-secondary text-white text-[9px] font-black uppercase tracking-widest rounded-full z-10 shadow-xl">
                      {product.promotion_badge}
                    </div>
                  )}
                  {product.images && product.images[0] ? (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  ) : (
                    <span className="text-premium-text-muted/20 text-[10px] tracking-[0.3em] uppercase font-bold">No Visual</span>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                  <button
                    onClick={(e) => e.preventDefault()}
                    className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg text-premium-text-muted hover:text-red-500 transition-all scale-0 group-hover:scale-100"
                  >
                    <Heart size={16} strokeWidth={1.5} />
                  </button>
                </div>
                <div className="space-y-3 px-2">
                  <h3 className="text-premium-primary font-bold text-lg tracking-tight leading-tight">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      {product.old_price && <Price amount={product.old_price} className="text-premium-text-muted text-xs line-through font-bold" />}
                      <Price amount={product.price} className="text-premium-secondary text-2xl font-black" />
                    </div>
                    <div className="flex items-center gap-1 text-premium-accent">
                        <Star size={14} fill="currentColor" />
                        <span className="text-premium-text-muted text-xs font-bold">{product.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ── Load More ── */}
        <div className="text-center mt-24">
          <button className="premium-button">
            Discover More
          </button>
        </div>
      </div>
    </div>
  )
}
