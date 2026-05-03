import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Plus, Minus, X, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { cn } from '@/utils/cn'
import { Price } from '@/components/Price'
import { useCMSStore } from '@/store/cmsStore'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore()
  const { currencyCode } = useCMSStore()
  const navigate = useNavigate()

  const subtotal = totalPrice()
  const shipping = 0 // Calculated at next step in ref
  const tax = subtotal * 0.08 // Simulating 8% tax as in ref
  const total = subtotal + tax

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-8 px-6 bg-white">
        <div className="w-24 h-24 bg-premium-bg rounded-full flex items-center justify-center text-premium-secondary">
          <ShoppingBag size={40} />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-3xl text-premium-primary uppercase font-black tracking-tight">Your cart is empty</h1>
          <p className="text-premium-text-muted font-medium">Explore our latest arrivals and find something that suits your style.</p>
        </div>
        <Link
          to="/shop"
          className="bg-premium-primary text-white px-12 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:bg-premium-secondary transition-all"
        >
          Go to Shop
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-24">
      {/* Checkout Header */}
      <header className="h-20 bg-white border-b border-premium-divider flex items-center justify-between px-10 sticky top-0 z-50">
        <Link to="/" className="text-2xl font-['Poppins'] font-black tracking-tighter text-premium-primary uppercase">
          UR<span className="text-premium-secondary">AIR</span>
        </Link>
        
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-premium-primary text-white flex items-center justify-center text-xs font-black">1</div>
             <span className="text-[10px] font-black uppercase tracking-widest text-premium-primary">Cart</span>
          </div>
          <div className="flex items-center gap-4 opacity-30">
             <div className="w-8 h-8 rounded-full border border-premium-divider flex items-center justify-center text-xs font-black">2</div>
             <span className="text-[10px] font-black uppercase tracking-widest text-premium-primary">Shipping</span>
          </div>
          <div className="flex items-center gap-4 opacity-30">
             <div className="w-8 h-8 rounded-full border border-premium-divider flex items-center justify-center text-xs font-black">3</div>
             <span className="text-[10px] font-black uppercase tracking-widest text-premium-primary">Payment</span>
          </div>
        </div>

        <button onClick={() => navigate(-1)} className="p-2 text-premium-primary hover:scale-110 transition-transform">
          <X size={24} />
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Cart Items */}
          <div className="flex-1 space-y-12">
            <h1 className="text-3xl font-black text-premium-primary uppercase tracking-tighter mb-12">Shopping Cart <span className="text-premium-secondary">/ {items.length}</span></h1>
            
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col sm:flex-row gap-10 pb-12 border-b border-premium-divider/50 group"
                >
                  <div className="w-full sm:w-36 aspect-square bg-white rounded-2xl overflow-hidden border border-premium-divider group-hover:border-premium-secondary transition-all duration-500 shadow-sm flex-shrink-0 relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-premium-secondary text-[10px] font-black tracking-[0.3em] uppercase mb-2">Authenticated Gear</p>
                        <h3 className="text-lg font-black text-premium-primary uppercase tracking-tight leading-none mb-3">{item.name}</h3>
                        <div className="flex items-center gap-3">
                           <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                           <p className="text-[10px] text-premium-text-muted font-bold uppercase tracking-widest">In Stock / Ready for Dispatch</p>
                        </div>
                      </div>
                      <Price amount={item.price} className="text-xl font-black text-premium-primary tracking-tight" />
                    </div>

                    <div className="flex items-center justify-between mt-10">
                      <div className="flex items-center bg-white border border-premium-divider rounded-2xl px-6 py-3 shadow-sm">
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 text-premium-text-muted hover:text-premium-secondary transition-colors"
                        >
                          <Minus size={18} />
                        </button>
                        <span className="w-12 text-center text-lg font-black text-premium-primary">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 text-premium-text-muted hover:text-premium-secondary transition-colors"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.productId)}
                        className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-premium-text-muted hover:text-red-500 transition-all"
                      >
                        <Trash2 size={14} className="group-hover:rotate-12 transition-transform" />
                        Remove Registry
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-[450px]">
            <div className="bg-white border border-premium-divider rounded-[2.5rem] p-10 space-y-10 shadow-2xl sticky top-32">
              <div className="space-y-2">
                <h2 className="text-xl font-black text-premium-primary uppercase tracking-tight">Order Summary</h2>
                <p className="text-[10px] text-premium-text-muted font-bold uppercase tracking-widest">Review your selection before checkout</p>
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-between text-[11px] font-black text-premium-text-muted uppercase tracking-[0.2em]">
                  <span>Subtotal</span>
                  <Price amount={subtotal} className="text-premium-primary" />
                </div>
                <div className="flex justify-between text-[11px] font-black text-premium-text-muted uppercase tracking-[0.2em]">
                  <span>Shipping</span>
                  <span className="text-premium-secondary">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-[11px] font-black text-premium-text-muted uppercase tracking-[0.2em]">
                  <span>Estimated Tax</span>
                  <Price amount={tax} className="text-premium-primary" />
                </div>
                
                <div className="h-px bg-premium-divider/50 my-8" />
                
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black text-premium-text-muted uppercase tracking-widest mb-1">Total</p>
                    <span className="text-[10px] font-bold text-premium-text-muted uppercase">{currencyCode}</span>
                  </div>
                  <Price amount={total} className="text-3xl font-black text-premium-primary tracking-tighter" />
                </div>
              </div>

              <div className="space-y-6 pt-4">
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="ACCESS CODE" 
                    className="w-full bg-premium-bg border border-premium-divider rounded-2xl px-8 py-5 text-[11px] font-black tracking-[0.3em] outline-none focus:border-premium-secondary transition-all placeholder:text-premium-text-muted/50"
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest text-premium-secondary hover:text-premium-primary transition-colors">
                    Apply
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-premium-primary text-white py-6 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-premium-secondary transition-all shadow-[0_20px_50px_rgba(0,0,0,0.25)] flex items-center justify-center gap-4 group active:scale-95"
                >
                  Proceed to Checkout
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </button>
                <p className="text-center text-[9px] text-premium-text-muted font-bold uppercase tracking-widest">Secure checkout with SSL encryption</p>
              </div>

              <div className="pt-4 flex items-center justify-center gap-10 opacity-40">
                <div className="flex flex-col items-center gap-2">
                   <ShieldCheck size={24} className="text-premium-primary" />
                   <span className="text-[8px] font-black uppercase tracking-widest">Secure</span>
                </div>
                <div className="w-px h-8 bg-premium-divider" />
                <div className="flex flex-col items-center gap-2">
                   <Truck size={24} className="text-premium-primary" />
                   <span className="text-[8px] font-black uppercase tracking-widest">Tracked</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
