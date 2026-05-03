import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag, ArrowLeft, ArrowRight, Shield, Truck, RefreshCcw, Star, Plus, Minus, Check, ChevronRight, MessageCircle } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { cn } from '@/utils/cn'

import { useQuery } from '@tanstack/react-query'
import api from '@/api/client'
import { Price } from '@/components/Price'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('Large')
  const [selectedColor, setSelectedColor] = useState('#4F4631')
  const [addedToCart, setAddedToCart] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'faq'>('description')
  
  const addItem = useCartStore((s) => s.addItem)
  const { toggle, isWishlisted } = useWishlistStore()

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.get(`/products/${slug}`).then(res => res.data),
    enabled: !!slug
  })

  const { data: settings } = useQuery({
    queryKey: ['storefront-settings'],
    queryFn: () => api.get('/settings').then(res => res.data)
  })

  const { data: realProducts = [] } = useQuery({
    queryKey: ['all-products'],
    queryFn: () => api.get('/products').then(res => res.data)
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="w-12 h-12 border-4 border-premium-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-black text-premium-primary uppercase tracking-tighter">Product Not Found</h1>
          <Link to="/shop" className="inline-block bg-premium-primary text-white px-12 py-4 rounded-full text-xs font-black uppercase tracking-widest">Return to Shop</Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem({
      id: Date.now(),
      productId: product.id,
      name: product.name,
      slug: slug || '',
      price: product.price,
      image: product.images?.[0] || '',
      quantity: quantity
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 3000)
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-24">
      {/* ── Top Bar ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 flex items-center justify-between">
        <Link to="/shop" className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-premium-text-muted hover:text-premium-primary transition-all">
          <div className="w-8 h-8 rounded-full border border-premium-divider flex items-center justify-center group-hover:bg-premium-bg transition-colors">
            <ArrowLeft size={14} />
          </div>
          Back to Collections
        </Link>
        <div className="flex gap-4">
           <button 
             onClick={() => toggle({
               id: product.id,
               productId: product.id,
               name: product.name,
               slug: slug || '',
               price: product.price,
               image: product.images?.[0] || ''
             })}
             className={cn(
               "w-10 h-10 rounded-full border flex items-center justify-center transition-all",
               isWishlisted(product.id) ? "bg-red-500 border-red-500 text-white shadow-lg" : "bg-white border-premium-divider text-premium-primary hover:border-premium-secondary"
             )}
           >
             <Heart size={18} fill={isWishlisted(product.id) ? "currentColor" : "none"} />
           </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start justify-center lg:max-w-[1000px] mx-auto">
          
          {/* ── Visual Gallery ── */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center sm:justify-start flex-shrink-0">
            {/* Vertical Thumbnails (Desktop) */}
            <div className="hidden sm:flex flex-col gap-4 w-[152px] flex-shrink-0 max-h-[530px] overflow-y-auto hidden-scrollbar pb-2">
              {(product.images || [1,2,3,4]).map((img: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={cn(
                    "w-[152px] h-[167px] rounded-2xl bg-white border transition-all duration-300 overflow-hidden flex-shrink-0",
                    selectedImage === idx ? "border-premium-secondary ring-2 ring-premium-secondary/20" : "border-premium-divider hover:border-premium-secondary/30"
                  )}
                >
                  <img src={typeof img === 'string' ? img : "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=200"} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            
            {/* Main Image Group (Desktop & Mobile) */}
            <div className="flex flex-col gap-4 mx-auto sm:mx-0">
              {/* Main Image */}
              <div className="w-[358px] h-[290px] sm:w-[444px] sm:h-[530px] bg-white rounded-[2rem] overflow-hidden border border-premium-divider/50 shadow-xl relative group cursor-zoom-in flex-shrink-0">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={selectedImage}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    src={product.images?.[selectedImage] || "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=800"} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute top-6 left-6">
                   <span className="bg-white/90 backdrop-blur-md border border-premium-divider px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest text-premium-primary shadow-lg">
                     New Release
                   </span>
                </div>
              </div>
              
              {/* Mobile thumbnails (horizontal) */}
              <div className="sm:hidden flex gap-3 overflow-x-auto pb-2 snap-x max-w-[358px]">
                {(product.images || [1,2,3,4]).map((img: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={cn(
                      "w-[111px] h-[106px] flex-shrink-0 rounded-[1.25rem] bg-white border transition-all overflow-hidden snap-center",
                      selectedImage === idx ? "border-premium-secondary ring-2 ring-premium-secondary/20" : "border-premium-divider hover:border-premium-secondary/30"
                    )}
                  >
                    <img src={typeof img === 'string' ? img : "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=200"} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Product Specification ── */}
          <div className="flex-1 flex flex-col py-0 w-full">
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-premium-secondary text-[9px] font-black tracking-[0.4em] uppercase">Masterpiece Collection</p>
                <h1 className="text-2xl font-black text-premium-primary uppercase tracking-tighter leading-none">{product.name}</h1>
                <div className="flex items-center gap-2 pt-0.5">
                  <div className="flex text-premium-secondary">
                    {[1,2,3,4,5].map(s => <Star key={s} size={10} fill={s <= 4 ? "currentColor" : "none"} />)}
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-premium-text-muted">4.8/5.0 (142 reviews)</span>
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <Price amount={product.price} className="text-2xl font-black text-premium-primary tracking-tighter" />
                {product.old_price && <Price amount={product.old_price} className="text-sm text-premium-text-muted/40 line-through font-bold" />}
              </div>

              <p className="text-xs text-premium-text-muted font-medium leading-relaxed max-w-xl line-clamp-2">
                {product.description || "The intersection of high-performance engineering and industrial luxury. Designed for those who demand nothing less than the extraordinary."}
              </p>

              <div className="h-px bg-premium-divider/50 w-12 my-2" />

              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-premium-primary">Select Finish</p>
                  <div className="flex gap-2">
                    {['#1A1A1A', '#BFA181', '#F5F5F5'].map(color => (
                      <button 
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center p-0.5",
                          selectedColor === color ? "border-premium-secondary scale-110 shadow-lg" : "border-transparent"
                        )}
                      >
                        <div className="w-full h-full rounded-full" style={{ backgroundColor: color }} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-premium-primary">Dimension</p>
                  <div className="flex flex-wrap gap-2">
                    {['Standard', 'Pro', 'Ultra'].map(size => (
                      <button 
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                          selectedSize === size ? "bg-premium-primary text-white shadow-lg" : "bg-white border border-premium-divider text-premium-text-muted hover:border-premium-secondary"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-1 space-y-2">
                {/* Row 1: Quantity + Add to Cart */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-white border border-premium-divider rounded-full px-3 py-1.5 shadow-sm">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 text-premium-text-muted hover:text-premium-secondary transition-colors"><Minus size={14} /></button>
                    <span className="w-6 text-center text-sm font-black text-premium-primary">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="p-1 text-premium-text-muted hover:text-premium-secondary transition-colors"><Plus size={14} /></button>
                  </div>
                  
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 border-2 border-premium-primary text-premium-primary py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-premium-primary hover:text-white transition-all flex items-center justify-center gap-2 group active:scale-95"
                  >
                    {addedToCart ? (
                      <>Added <Check size={12} /></>
                    ) : (
                      <>Add to Cart <ShoppingBag size={12} /></>
                    )}
                  </button>
                </div>

                {/* Row 2: Buy Now */}
                <button 
                  onClick={() => { handleAddToCart(); navigate('/checkout'); }}
                  className="w-full bg-premium-primary text-white py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-premium-secondary transition-all shadow-lg flex items-center justify-center gap-2 group active:scale-95"
                >
                  Buy Now <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Row 3: Buy on WhatsApp (conditional) */}
                {settings?.whatsapp_number && settings?.whatsapp_buy_enabled !== '0' && (
                  <button 
                    onClick={() => {
                      const msg = encodeURIComponent(`Hi! I'd like to purchase: ${product.name} (₦${product.price}) x${quantity}`)
                      window.open(`https://wa.me/${settings.whatsapp_number.replace('+', '')}?text=${msg}`, '_blank')
                    }}
                    className="w-full bg-[#25D366] text-white py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-[#1DA851] transition-all shadow-lg flex items-center justify-center gap-2 group active:scale-95"
                  >
                    <MessageCircle size={12} fill="currentColor" /> Buy on WhatsApp
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-premium-divider/30">
                <div className="flex flex-col items-center text-center gap-1.5">
                   <div className="w-8 h-8 bg-premium-bg rounded-lg flex items-center justify-center text-premium-secondary border border-premium-divider/50 shadow-sm"><Truck size={14} /></div>
                   <p className="text-[7px] font-black uppercase tracking-[0.15em] text-premium-text-muted">Free Shipping</p>
                </div>
                <div className="flex flex-col items-center text-center gap-1.5">
                   <div className="w-8 h-8 bg-premium-bg rounded-lg flex items-center justify-center text-premium-secondary border border-premium-divider/50 shadow-sm"><Shield size={14} /></div>
                   <p className="text-[7px] font-black uppercase tracking-[0.15em] text-premium-text-muted">2 Year Warranty</p>
                </div>
                <div className="flex flex-col items-center text-center gap-1.5">
                   <div className="w-8 h-8 bg-premium-bg rounded-lg flex items-center justify-center text-premium-secondary border border-premium-divider/50 shadow-sm"><RefreshCcw size={14} /></div>
                   <p className="text-[7px] font-black uppercase tracking-[0.15em] text-premium-text-muted">Easy Returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs: Description / Reviews / FAQ ── */}
        <div className="mt-20 border-t border-premium-divider pt-10">
          <div className="flex gap-8 border-b border-premium-divider mb-10 justify-center">
            {(['description', 'reviews', 'faq'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all border-b-2",
                  activeTab === tab ? "text-premium-primary border-premium-secondary" : "text-premium-text-muted border-transparent hover:text-premium-primary"
                )}
              >
                {tab === 'description' ? 'Description' : tab === 'reviews' ? `Reviews (${product.approved_reviews_count || 0})` : 'FAQ'}
              </button>
            ))}
          </div>

          {/* Description Tab */}
          {activeTab === 'description' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <p className="text-sm text-premium-text-muted leading-relaxed">
                {product.description || "Engineered with precision and designed for those who demand excellence. Every detail has been meticulously crafted to deliver an unparalleled experience."}
              </p>
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mt-8">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-premium-primary mb-4">Specifications</h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                    {Object.entries(product.specifications).map(([key, value]: [string, any]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-premium-divider/30">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-premium-text-muted">{key}</span>
                        <span className="text-[10px] font-black text-premium-primary">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {product.material && (
                <div className="flex gap-8 pt-4">
                  <div><span className="text-[9px] font-black uppercase tracking-widest text-premium-text-muted">Material</span><p className="text-sm font-bold text-premium-primary mt-1">{product.material}</p></div>
                  {product.weight && <div><span className="text-[9px] font-black uppercase tracking-widest text-premium-text-muted">Weight</span><p className="text-sm font-bold text-premium-primary mt-1">{product.weight}</p></div>}
                </div>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-8 max-w-3xl mx-auto">
              {product.approved_reviews && product.approved_reviews.length > 0 ? (
                product.approved_reviews.map((review: any) => (
                  <div key={review.id} className="bg-white border border-premium-divider rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 bg-premium-bg rounded-full flex items-center justify-center font-black text-premium-primary text-[10px]">
                          {review.user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="text-xs font-black text-premium-primary uppercase">{review.user?.name || 'Anonymous'}</p>
                          <div className="flex text-premium-secondary mt-0.5">
                            {[1,2,3,4,5].map(s => <Star key={s} size={10} fill={s <= review.rating ? "currentColor" : "none"} />)}
                          </div>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-premium-text-muted">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-premium-text-muted leading-relaxed">{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 space-y-3">
                  <Star size={32} className="mx-auto text-premium-divider" />
                  <p className="text-sm font-bold text-premium-text-muted">No reviews yet. Be the first to share your experience.</p>
                </div>
              )}
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              {[
                { q: 'What is the return policy?', a: 'We offer a 30-day hassle-free return policy for all unused items in original packaging.' },
                { q: 'How long does shipping take?', a: 'Standard shipping takes 3-5 business days. Express shipping is available at checkout for 1-2 day delivery.' },
                { q: 'Is this product covered by warranty?', a: 'Yes, all products come with a 2-year manufacturer warranty covering defects in materials and workmanship.' },
                { q: 'Can I track my order?', a: 'Absolutely. Once shipped, you will receive a tracking number via email to monitor your delivery in real-time.' },
              ].map((faq, idx) => (
                <details key={idx} className="group bg-white border border-premium-divider rounded-xl overflow-hidden">
                  <summary className="flex justify-between items-center px-6 py-4 cursor-pointer text-sm font-bold text-premium-primary hover:bg-premium-bg transition-colors">
                    {faq.q}
                    <ChevronRight size={14} className="text-premium-text-muted group-open:rotate-90 transition-transform" />
                  </summary>
                  <p className="px-6 pb-4 text-sm text-premium-text-muted leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          )}
        </div>

        {/* ── You Might Like ── */}
        {realProducts.length > 1 && (
          <div className="mt-20 border-t border-premium-divider pt-10">
            <h2 className="text-2xl font-black text-premium-primary uppercase tracking-tighter mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {realProducts
                .filter((p: any) => p.id !== product.id)
                .sort((a: any, b: any) => {
                  if (a.category_id === product.category_id && b.category_id !== product.category_id) return -1;
                  if (b.category_id === product.category_id && a.category_id !== product.category_id) return 1;
                  return 0;
                })
                .slice(0, 4)
                .map((p: any) => (
                  <Link key={p.id} to={`/product/${p.slug}`} className="group block space-y-3">
                    <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-premium-divider group-hover:border-premium-secondary transition-all shadow-sm">
                      <img src={p.images?.[0] || ''} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-premium-primary truncate">{p.name}</h3>
                      <Price amount={p.price} className="text-sm font-black text-premium-primary mt-1" />
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-[90px] left-0 right-0 z-[55] px-6 pointer-events-none">
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/95 backdrop-blur-xl border border-premium-divider/30 shadow-2xl rounded-[2.5rem] p-4 flex items-center justify-between pointer-events-auto"
        >
          <div className="pl-4">
             <p className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Total Value</p>
             <Price amount={product.price} className="text-xl font-black text-premium-primary" />
          </div>
          <button 
            onClick={handleAddToCart}
            className="bg-premium-primary text-white px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center gap-3"
          >
            {addedToCart ? (
              <>Added <Check size={16} /></>
            ) : (
              <>Add to Cart <ShoppingBag size={16} /></>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  )
}
