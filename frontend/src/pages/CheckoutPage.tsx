import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { X, CheckCircle2, ShieldCheck, Truck, CreditCard, ChevronRight, MapPin, Apple } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { ordersApi } from '@/api/orders'
import api from '@/api/client'
import { cn } from '@/utils/cn'
import { motion, AnimatePresence } from 'framer-motion'
import { usePaystackPayment } from 'react-paystack'
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3'
import { useQuery } from '@tanstack/react-query'
import { Price } from '@/components/Price'
import { useCMSStore } from '@/store/cmsStore'

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const { currencyCode } = useCMSStore()
  const navigate = useNavigate()
  
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  })

  const [selectedGateway, setSelectedGateway] = useState<any>(null)
  const [gateways, setGateways] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [txRef, setTxRef] = useState('')
  const [saveForFuture, setSaveForFuture] = useState(false)

  const { data: addresses = [], refetch: refetchAddresses } = useQuery({
    queryKey: ['my-addresses'],
    queryFn: () => api.get('/user-addresses').then(res => res.data),
    enabled: !!user
  })

  const [useSavedAddress, setUseSavedAddress] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)

  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddr = addresses.find((a: any) => a.is_default) || addresses[0]
      setUseSavedAddress(true)
      setSelectedAddressId(defaultAddr.id)
      setShippingData({
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ').slice(1).join(' ') || '',
        address: defaultAddr.address_line_1,
        city: defaultAddr.city,
        postalCode: defaultAddr.postal_code,
        phone: user?.phone || ''
      })
    }
  }, [addresses, user])

  const handleAddressSelect = (addr: any) => {
    setSelectedAddressId(addr.id)
    setShippingData({
      ...shippingData,
      address: addr.address_line_1,
      city: addr.city,
      postalCode: addr.postal_code
    })
  }

  const subtotal = totalPrice()
  const shipping = 0 // Calculated at next step or free?
  const tax = subtotal * 0.08
  const total = subtotal + tax

  useEffect(() => {
    setTxRef(Date.now().toString())
    api.get('/payment-gateways/active').then(res => {
      setGateways(res.data)
      if (res.data.length > 0) {
        setSelectedGateway(res.data[0])
      }
    }).catch(() => console.error("Failed to load gateways"))
  }, [])

  // Paystack Config
  const paystackConfig = selectedGateway?.provider === 'paystack' ? {
    reference: txRef,
    email: user?.email || 'customer@urair.com',
    amount: total * 100,
    publicKey: selectedGateway.public_key,
    currency: currencyCode,
  } : null

  const initializePaystack = usePaystackPayment(paystackConfig as any)

  // Flutterwave Config
  const fwConfig = selectedGateway?.provider === 'flutterwave' ? {
    public_key: selectedGateway.public_key,
    tx_ref: txRef,
    amount: total,
    currency: currencyCode,
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: user?.email || 'customer@urair.com',
      phone_number: shippingData.phone,
      name: `${shippingData.firstName} ${shippingData.lastName}`,
    },
    customizations: {
      title: 'URAIR Storefront',
      description: 'Payment for items in cart',
      logo: 'https://urair.com/logo.png',
    },
  } : null

  const handleFlutterwavePayment = useFlutterwave(fwConfig as any)

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!shippingData.address) {
      setError('Please provide a shipping destination')
      return
    }
    if (!selectedGateway) {
      setError('Please select a payment method')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')
      
      if (saveForFuture && !useSavedAddress) {
        await api.post('/user-addresses', {
          address_line_1: shippingData.address,
          city: shippingData.city,
          postal_code: shippingData.postalCode,
          country: 'United Kingdom',
          is_default: addresses.length === 0
        })
      }

      const orderRes = await ordersApi.create({
        items: items.map(item => ({ product_id: item.productId, quantity: item.quantity })),
        // NOTE: total_price is intentionally omitted. The backend calculates it securely from the DB.
        shipping_address: `${shippingData.firstName} ${shippingData.lastName}, ${shippingData.address}, ${shippingData.city}, ${shippingData.postalCode}, ${shippingData.phone}`,
        payment_method: selectedGateway.provider,
        payment_reference: txRef, // Send the gateway reference so webhooks can look up this order
      })
      
      const order = orderRes.data

      if (selectedGateway.provider === 'manual') {
        setIsSuccess(true)
        clearCart()
      } else if (selectedGateway.provider === 'paystack' && initializePaystack) {
        initializePaystack({
          onSuccess: (_reference: any) => {
            // SECURITY: Do NOT trust the frontend success callback to mark as paid.
            // The backend Paystack webhook (/api/webhooks/paystack) handles this securely.
            // We just show a success message and let the webhook do the work.
            setIsSuccess(true)
            clearCart()
          },
          onClose: () => {
            setError('Payment cancelled.')
            setIsSubmitting(false)
          }
        })
      } else if (selectedGateway.provider === 'flutterwave' && handleFlutterwavePayment) {
        handleFlutterwavePayment({
          callback: (response: any) => {
             closePaymentModal()
             if (response.status === "successful") {
                // SECURITY: Do NOT trust the frontend success callback to mark as paid.
                // The backend Flutterwave webhook (/api/webhooks/flutterwave) handles this securely.
                setIsSuccess(true)
                clearCart()
             } else {
                setError('Payment failed or cancelled.')
                setIsSubmitting(false)
             }
          },
          onClose: () => {
            setError('Payment cancelled.')
            setIsSubmitting(false)
          },
        })
      }

    } catch (err: any) {
      setError(err.response?.data?.message || 'Transaction could not be established.')
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-10 px-6 bg-[#FDFBF7]">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-32 h-32 bg-white border border-premium-divider rounded-full flex items-center justify-center text-premium-secondary shadow-2xl"
        >
          <CheckCircle2 size={56} strokeWidth={1} />
        </motion.div>
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-black text-premium-primary uppercase tracking-tighter leading-none">Acquisition Confirmed</h1>
          <p className="text-premium-text-muted font-medium max-w-md mx-auto text-lg">Your order has been integrated into our logistics framework. A digital receipt has been dispatched.</p>
        </div>
        <Link
          to="/shop"
          className="bg-premium-primary text-white px-16 py-6 rounded-full text-[10px] tracking-[0.4em] uppercase font-black hover:bg-premium-secondary transition-all shadow-2xl"
        >
          Return to Catalog
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-[#FDFBF7] min-h-screen">
      {/* Checkout Header */}
      <header className="h-20 bg-white border-b border-premium-divider flex items-center justify-between px-10 sticky top-0 z-50">
        <Link to="/" className="text-2xl font-['Poppins'] font-black tracking-tighter text-premium-primary uppercase">
          UR<span className="text-premium-secondary">AIR</span>
        </Link>
        
        <div className="flex items-center gap-12">
          <Link to="/cart" className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-black">
               <CheckCircle2 size={16} />
             </div>
             <span className="text-[10px] font-black uppercase tracking-widest text-premium-primary">Cart</span>
          </Link>
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-premium-primary text-white flex items-center justify-center text-xs font-black">2</div>
             <span className="text-[10px] font-black uppercase tracking-widest text-premium-primary">Shipping</span>
          </div>
          <div className="flex items-center gap-4 opacity-30">
             <div className="w-8 h-8 rounded-full border border-premium-divider flex items-center justify-center text-xs font-black">3</div>
             <span className="text-[10px] font-black uppercase tracking-widest text-premium-primary">Payment</span>
          </div>
        </div>

        <button onClick={() => navigate('/cart')} className="p-2 text-premium-primary hover:scale-110 transition-transform">
          <X size={24} />
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid lg:grid-cols-12 gap-20">
          {/* Main Checkout Sections */}
          <div className="lg:col-span-7 space-y-16">
            
             {/* Shipping Section */}
            <section className="space-y-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-premium-primary uppercase tracking-tight">Shipping Address</h2>
                {addresses.length > 0 && (
                  <button 
                    onClick={() => setUseSavedAddress(!useSavedAddress)}
                    className="text-[10px] font-black uppercase tracking-widest text-premium-secondary hover:text-premium-primary transition-colors"
                  >
                    {useSavedAddress ? 'Use Custom Address' : 'Use Saved Address'}
                  </button>
                )}
              </div>

              {useSavedAddress && addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((addr: any) => (
                    <button
                      key={addr.id}
                      onClick={() => handleAddressSelect(addr)}
                      className={cn(
                        "text-left p-8 rounded-[2rem] border transition-all duration-300 relative",
                        selectedAddressId === addr.id 
                          ? "bg-white border-premium-secondary shadow-xl ring-1 ring-premium-secondary/20" 
                          : "bg-white border-premium-divider hover:border-premium-secondary/30 shadow-sm"
                      )}
                    >
                      {selectedAddressId === addr.id && (
                        <div className="absolute top-6 right-6 text-premium-secondary">
                          <CheckCircle2 size={16} />
                        </div>
                      )}
                      <p className="text-sm font-black text-premium-primary uppercase tracking-tight truncate">{addr.address_line_1}</p>
                      <p className="text-[10px] text-premium-text-muted font-bold uppercase tracking-widest mt-1">{addr.city}, {addr.postal_code}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-premium-divider rounded-[2.5rem] p-10 shadow-sm space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted px-2">First Name</label>
                      <input 
                        type="text" 
                        placeholder="John"
                        value={shippingData.firstName}
                        onChange={(e) => setShippingData({...shippingData, firstName: e.target.value})}
                        className="w-full bg-[#FDFBF7] border border-premium-divider rounded-2xl p-5 text-sm font-bold text-premium-primary outline-none focus:border-premium-secondary transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted px-2">Last Name</label>
                      <input 
                        type="text" 
                        placeholder="Doe"
                        value={shippingData.lastName}
                        onChange={(e) => setShippingData({...shippingData, lastName: e.target.value})}
                        className="w-full bg-[#FDFBF7] border border-premium-divider rounded-2xl p-5 text-sm font-bold text-premium-primary outline-none focus:border-premium-secondary transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted px-2">Street Address</label>
                    <input 
                      type="text" 
                      placeholder="123 Luxury Lane"
                      value={shippingData.address}
                      onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                      className="w-full bg-[#FDFBF7] border border-premium-divider rounded-2xl p-5 text-sm font-bold text-premium-primary outline-none focus:border-premium-secondary transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted px-2">City</label>
                      <input 
                        type="text" 
                        placeholder="New York"
                        value={shippingData.city}
                        onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                        className="w-full bg-[#FDFBF7] border border-premium-divider rounded-2xl p-5 text-sm font-bold text-premium-primary outline-none focus:border-premium-secondary transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted px-2">Postal Code</label>
                      <input 
                        type="text" 
                        placeholder="10001"
                        value={shippingData.postalCode}
                        onChange={(e) => setShippingData({...shippingData, postalCode: e.target.value})}
                        className="w-full bg-[#FDFBF7] border border-premium-divider rounded-2xl p-5 text-sm font-bold text-premium-primary outline-none focus:border-premium-secondary transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted px-2">Phone Number</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-premium-text-muted opacity-50">+44</span>
                      <input 
                        type="tel" 
                        placeholder="(555) 000-0000"
                        value={shippingData.phone}
                        onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                        className="w-full bg-[#FDFBF7] border border-premium-divider rounded-2xl p-5 pl-16 text-sm font-bold text-premium-primary outline-none focus:border-premium-secondary transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pt-4">
                    <input 
                      type="checkbox" 
                      id="saveForFuture"
                      checked={saveForFuture}
                      onChange={(e) => setSaveForFuture(e.target.checked)}
                      className="w-5 h-5 border-2 border-premium-divider rounded-md checked:bg-premium-secondary focus:ring-0 transition-all cursor-pointer" 
                    />
                    <label htmlFor="saveForFuture" className="text-[10px] font-black uppercase tracking-widest text-premium-primary cursor-pointer">Save these coordinates for future dispatch</label>
                  </div>
                </div>
              )}
            </section>

            {/* Payment Section */}
            <section className="space-y-10">
              <h2 className="text-2xl font-black text-premium-primary uppercase tracking-tight">Payment Method</h2>
              
              <div className="space-y-4">
                {gateways.length > 0 ? (
                  gateways.map((gw) => (
                    <button
                      key={gw.id}
                      onClick={() => setSelectedGateway(gw)}
                      className={cn(
                        "w-full flex items-center justify-between p-8 rounded-[2rem] border transition-all duration-300",
                        selectedGateway?.id === gw.id 
                          ? "bg-white border-premium-secondary shadow-xl ring-1 ring-premium-secondary/20" 
                          : "bg-white border-premium-divider hover:border-premium-secondary/30 shadow-sm"
                      )}
                    >
                      <div className="flex items-center gap-6">
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                          selectedGateway?.id === gw.id ? "border-premium-secondary" : "border-premium-divider"
                        )}>
                          {selectedGateway?.id === gw.id && <div className="w-3 h-3 bg-premium-secondary rounded-full" />}
                        </div>
                        <div className="text-left">
                           <p className="text-sm font-black text-premium-primary uppercase tracking-tight">{gw.provider === 'manual' ? 'Vault (Offline/Manual)' : gw.provider.toUpperCase()}</p>
                           <p className="text-[10px] text-premium-text-muted font-bold uppercase tracking-widest mt-1">
                             {gw.provider === 'manual' ? 'Payment processed on delivery' : 'Secure instant transaction'}
                           </p>
                        </div>
                      </div>
                      <div className="text-premium-primary opacity-20">
                        {gw.provider === 'paystack' && <CreditCard size={24} />}
                        {gw.provider === 'flutterwave' && <ChevronRight size={24} />}
                        {gw.provider === 'manual' && <ShieldCheck size={24} />}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-12 text-center bg-white border border-premium-divider rounded-[2rem]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted animate-pulse">Establishing Secure Gateways...</p>
                  </div>
                )}
                
                {/* Visual placeholders for common methods as in ref */}
                <div className="w-full flex items-center justify-between p-8 rounded-[2rem] border border-premium-divider bg-white opacity-40 grayscale cursor-not-allowed">
                  <div className="flex items-center gap-6">
                    <div className="w-6 h-6 rounded-full border-2 border-premium-divider" />
                    <p className="text-sm font-black text-premium-primary uppercase tracking-tight">Apple Pay</p>
                  </div>
                  <Apple size={24} />
                </div>
              </div>
            </section>
          </div>

          {/* Right Sidebar Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-premium-divider rounded-[3rem] p-12 space-y-12 shadow-2xl sticky top-32">
              <h2 className="text-3xl font-black text-premium-primary uppercase tracking-tight">Order Summary</h2>
              
              <div className="space-y-8 max-h-[40vh] overflow-y-auto pr-6 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-6 group">
                    <div className="w-24 h-24 bg-premium-bg rounded-2xl overflow-hidden flex-shrink-0 border border-premium-divider group-hover:border-premium-secondary transition-colors shadow-sm">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="flex-1 py-2">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-[11px] font-black text-premium-primary uppercase tracking-tight leading-tight">{item.name}</h3>
                        <Price amount={item.price} className="text-sm font-black text-premium-primary" />
                      </div>
                      <p className="text-[9px] text-premium-text-muted font-bold uppercase tracking-widest mt-1">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6 pt-10 border-t border-premium-divider">
                <div className="flex justify-between text-xs font-bold text-premium-text-muted uppercase tracking-widest">
                  <span>Subtotal</span>
                  <Price amount={subtotal} className="text-premium-primary font-black" />
                </div>
                <div className="flex justify-between text-xs font-bold text-premium-text-muted uppercase tracking-widest">
                  <span>Shipping</span>
                  <span className="text-premium-secondary font-black">Calculated at next step</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-premium-text-muted uppercase tracking-widest">
                  <span>Estimated Tax</span>
                  <Price amount={tax} className="text-premium-primary font-black" />
                </div>
                
                <div className="h-px bg-premium-divider/50 my-6" />
                
                <div className="flex justify-between items-end">
                  <span className="text-sm font-black text-premium-primary uppercase tracking-widest">Total</span>
                  <div className="text-right">
                    <Price amount={total} className="text-5xl font-black text-premium-primary tracking-tighter leading-none" />
                    <p className="text-[10px] font-bold text-premium-text-muted uppercase mt-1">{currencyCode}</p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-6 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                  {error}
                </div>
              )}

              <button 
                onClick={handleCheckout}
                disabled={isSubmitting || items.length === 0}
                className="w-full bg-premium-primary text-white py-6 rounded-[2rem] text-sm font-black uppercase tracking-widest hover:bg-premium-secondary transition-all shadow-2xl disabled:opacity-50"
              >
                {isSubmitting ? 'Processing Transaction...' : 'Complete Purchase'}
              </button>

              <div className="flex items-center justify-center gap-4 text-premium-text-muted opacity-40">
                 <ShieldCheck size={20} />
                 <p className="text-[9px] font-black uppercase tracking-widest">Secure SSL Encrypted Checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
