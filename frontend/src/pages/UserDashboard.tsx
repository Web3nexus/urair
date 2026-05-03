import { cn } from '@/utils/cn'
import { useQuery } from '@tanstack/react-query'
import api from '@/api/client'
import { useState, useEffect } from 'react'
import { 
  MessageSquare, 
  ShoppingCart, 
  Star, 
  LayoutDashboard, 
  Settings, 
  ChevronRight, 
  LogOut, 
  Clock,
  Heart,
  MapPin,
  Search,
  Plus,
  Package,
  Trash2,
  Edit2,
  CheckCircle2,
  Camera,
  Shield,
  Bell,
  User as UserIcon
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useCMSStore } from '@/store/cmsStore'
import { Price } from '@/components/Price'

export default function UserDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user: authUser, logout } = useAuthStore()
  const { navLinks, site_logo, systemName } = useCMSStore()
  
  // Set active tab based on URL path
  const [activeTab, setActiveTab] = useState(() => {
    if (location.pathname === '/wishlist') return 'My Wishlist'
    return 'Overview'
  })

  useEffect(() => {
    if (location.pathname === '/wishlist') setActiveTab('My Wishlist')
    else if (location.pathname === '/account/orders') setActiveTab('Order History')
    else if (location.pathname === '/account') setActiveTab('Overview')
  }, [location.pathname])

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.get('/me').then(res => res.data),
    initialData: authUser
  })

  const { data: orders = [] } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => api.get('/my-orders').then(res => res.data)
  })

  const { data: tickets = [] } = useQuery({
    queryKey: ['my-tickets'],
    queryFn: () => api.get('/tickets').then(res => res.data)
  })

  const { data: addresses = [], refetch: refetchAddresses } = useQuery({
    queryKey: ['my-addresses'],
    queryFn: () => api.get('/user-addresses').then(res => res.data)
  })

  const [profileForm, setProfileForm] = useState({ 
    name: user?.name || '', 
    email: user?.email || '', 
    phone: user?.phone || '',
    avatar: user?.avatar || '',
    password: '',
    password_confirmation: ''
  })

  useEffect(() => {
    if (user) {
      setProfileForm(prev => ({ ...prev, name: user.name, email: user.email, phone: user.phone || '', avatar: user.avatar || '' }))
    }
  }, [user])

  const [showAddressModal, setShowAddressModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState<any>(null)
  const [addressForm, setAddressForm] = useState({
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'United Kingdom',
    is_default: false
  })

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [notify, setNotify] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showNotify = (message: string, type: 'success' | 'error' = 'success') => {
    setNotify({ message, type })
    setTimeout(() => setNotify(null), 3000)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const sidebarItems = [
    { id: 'Overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'Order History', label: 'Order History', icon: <ShoppingCart size={18} /> },
    { id: 'My Wishlist', label: 'My Wishlist', icon: <Heart size={18} /> },
    { id: 'Saved Addresses', label: 'Saved Addresses', icon: <MapPin size={18} /> },
    { id: 'Profile Settings', label: 'Profile Settings', icon: <Settings size={18} /> },
  ]

  const orderTabs = ['All Orders', 'Processing', 'Shipped', 'Completed']
  const [activeOrderTab, setActiveOrderTab] = useState('All Orders')

  const userInitials = user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#FDFBF7] font-sans text-sm text-premium-primary overflow-hidden">
      {/* Sidebar - Hidden on Mobile */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-premium-divider flex-col shadow-sm z-20">
        <div className="p-8 flex flex-col items-center text-center space-y-4 border-b border-premium-divider/50">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-premium-divider p-1 group-hover:border-premium-secondary transition-colors duration-500 bg-premium-bg flex items-center justify-center">
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
              ) : (
                <span className="text-3xl font-black text-premium-secondary">{userInitials}</span>
              )}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-premium-primary">{user?.name}</h2>
            <p className="text-[10px] font-bold text-premium-text-muted uppercase tracking-widest">{user?.email}</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-6 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id)
                if (item.id === 'My Wishlist') navigate('/wishlist')
                else navigate('/account')
              }}
              className={cn(
                "w-full flex items-center gap-4 px-5 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300",
                activeTab === item.id 
                  ? "bg-[#F5F1EB] text-premium-primary shadow-sm" 
                  : "text-premium-text-muted hover:bg-premium-bg hover:text-premium-primary"
              )}
            >
              <span className={cn("transition-colors", activeTab === item.id ? "text-premium-secondary" : "text-premium-text-muted/60")}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-premium-divider/50">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-5 py-4 w-full text-xs font-black uppercase tracking-widest text-premium-text-muted hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Mobile Dashboard Navigation - Horizontal Scroll */}
        <div className="lg:hidden bg-white border-b border-premium-divider px-6 py-4 overflow-x-auto no-scrollbar whitespace-nowrap">
          <div className="flex gap-4">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  if (item.id === 'My Wishlist') navigate('/wishlist')
                  else navigate('/account')
                }}
                className={cn(
                  "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === item.id 
                    ? "bg-premium-primary text-white shadow-lg" 
                    : "bg-premium-bg text-premium-text-muted hover:text-premium-primary"
                )}
              >
                {item.label}
              </button>
            ))}
            <button 
              onClick={handleLogout}
              className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-600"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Top Header Navigation - Using System Links */}
        <header className="hidden lg:flex h-20 bg-white/80 backdrop-blur-md border-b border-premium-divider flex items-center justify-between px-10 sticky top-0 z-10">
          <div className="flex items-center gap-12">
            <Link to="/" className="text-xl font-['Poppins'] font-black tracking-tighter text-premium-primary uppercase">
              {site_logo ? (
                <img src={site_logo} alt={systemName} className="h-6 object-contain" />
              ) : (
                <>UR<span className="text-premium-secondary">AIR</span></>
              )}
            </Link>
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className={cn(
                    "text-[10px] font-black uppercase tracking-[0.3em] transition-colors",
                    location.pathname === link.path ? "text-premium-secondary" : "text-premium-text-muted hover:text-premium-primary"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="p-2 text-premium-primary hover:scale-110 transition-transform">
              <Search size={20} />
            </button>
            <Link to="/cart" className="p-2 text-premium-primary relative group">
              <ShoppingCart size={20} />
              {/* Badge could be real from cart store if needed */}
            </Link>
            <div className="w-10 h-10 bg-premium-bg rounded-full flex items-center justify-center font-black text-xs text-premium-secondary border border-premium-divider">
              {userInitials}
            </div>
          </div>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-12 bg-premium-bg/30">
          <AnimatePresence mode="wait">
            {activeTab === 'Order History' && (
              <motion.div
                key="order-history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-6xl mx-auto space-y-12"
              >
                <div className="space-y-8">
                  <div>
                    <h1 className="text-4xl font-black tracking-tight text-premium-primary">Order History</h1>
                    <p className="text-premium-text-muted mt-2 font-medium">Manage your recent purchases and tracking information</p>
                  </div>

                  <div className="flex items-center gap-8 border-b border-premium-divider pb-4">
                    {orderTabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveOrderTab(tab)}
                        className={cn(
                          "text-[11px] font-black uppercase tracking-widest transition-all relative pb-4",
                          activeOrderTab === tab ? "text-premium-primary" : "text-premium-text-muted hover:text-premium-primary"
                        )}
                      >
                        {tab}
                        {activeOrderTab === tab && (
                          <motion.div layoutId="orderTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-premium-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {orders.length > 0 ? (
                    orders.map((order: any) => (
                      <div key={order.id} className="bg-white border border-premium-divider rounded-3xl p-8 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-black tracking-tight text-premium-primary uppercase">Order #{order.id}</h3>
                              <span className={cn(
                                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                              )}>
                                {order.status.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-xs text-premium-text-muted font-bold uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                          
                          <div className="flex flex-1 items-center gap-6 px-10">
                            {order.items?.slice(0, 1).map((item: any) => (
                              <div key={item.id} className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-premium-bg rounded-2xl overflow-hidden border border-premium-divider group-hover:border-premium-secondary transition-colors flex-shrink-0">
                                  <img src={item.product?.image || "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=200"} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-black text-premium-primary truncate">{item.product?.name || 'Asset Dispatch'}</p>
                                  <p className="text-[10px] text-premium-text-muted font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                                </div>
                              </div>
                            ))}
                            {order.items?.length > 1 && (
                               <div className="text-[10px] font-black text-premium-text-muted uppercase tracking-widest">+{order.items.length - 1} More Items</div>
                            )}
                          </div>
                          
                          <div className="text-right ml-auto md:ml-0">
                            <Price amount={order.total_price} className="text-xl font-black tracking-tighter text-premium-primary" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 bg-white border border-premium-divider rounded-[2rem] border-dashed">
                      <Package size={32} className="mx-auto text-premium-divider mb-4" />
                      <p className="text-premium-text-muted text-xs font-black uppercase tracking-[0.2em]">No order history detected in your profile</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'Overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-6xl mx-auto space-y-10"
              >
                {/* Compact Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-premium-divider rounded-3xl p-7 shadow-sm hover:shadow-lg transition-all group">
                    <div className="w-12 h-12 bg-premium-bg rounded-xl flex items-center justify-center text-premium-secondary mb-6 group-hover:scale-110 transition-transform">
                      <ShoppingCart size={20} />
                    </div>
                    <p className="text-4xl font-black tracking-tighter text-premium-primary mb-1">{orders.length}</p>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-premium-text-muted">Total Dispatches</p>
                  </div>
                  <div className="bg-white border border-premium-divider rounded-3xl p-7 shadow-sm hover:shadow-lg transition-all group">
                    <div className="w-12 h-12 bg-premium-bg rounded-xl flex items-center justify-center text-premium-secondary mb-6 group-hover:scale-110 transition-transform">
                      <MessageSquare size={20} />
                    </div>
                    <p className="text-4xl font-black tracking-tighter text-premium-primary mb-1">{tickets.length}</p>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-premium-text-muted">Active Support Threads</p>
                  </div>
                  <div className="bg-premium-primary border border-premium-primary rounded-3xl p-7 shadow-2xl group text-white relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6 z-10 relative">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-premium-secondary group-hover:scale-110 transition-transform">
                        <Star size={20} />
                      </div>
                      <div className={cn(
                        "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border shadow-lg backdrop-blur-md",
                        (() => {
                          const totalSpend = orders.reduce((acc: number, o: any) => acc + Number(o.total_price), 0)
                          if (totalSpend >= 5000) return 'bg-slate-200 text-slate-800 border-slate-300' // Platinum
                          if (totalSpend >= 2000) return 'bg-yellow-100 text-yellow-800 border-yellow-200' // Gold
                          if (totalSpend >= 500) return 'bg-gray-200 text-gray-800 border-gray-300' // Silver
                          return 'bg-orange-100 text-orange-800 border-orange-200' // Bronze
                        })()
                      )}>
                        {(() => {
                          const totalSpend = orders.reduce((acc: number, o: any) => acc + Number(o.total_price), 0)
                          if (totalSpend >= 5000) return 'Platinum Tier'
                          if (totalSpend >= 2000) return 'Gold Tier'
                          if (totalSpend >= 500) return 'Silver Tier'
                          return 'Bronze Tier'
                        })()}
                      </div>
                    </div>
                    <div className="z-10 relative">
                      <p className="text-4xl font-black tracking-tighter text-white mb-1">
                        {(() => {
                          const totalSpend = orders.reduce((acc: number, o: any) => acc + Number(o.total_price), 0)
                          return (totalSpend / 10).toFixed(1) + 'k'
                        })()}
                      </p>
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-premium-secondary">Elite Loyalty Points</p>
                    </div>
                    {/* Abstract background for premium card */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -mr-10 -mt-10" />
                  </div>
                </div>

                <div className="bg-white border border-premium-divider rounded-[2.5rem] p-12 shadow-sm overflow-hidden">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-premium-primary mb-10 px-4">Recent Account Activity</h3>
                  <div className="divide-y divide-premium-divider">
                    {orders.slice(0, 3).map((o: any) => (
                      <div key={o.id} className="flex items-center justify-between py-8 px-4 group hover:bg-premium-bg transition-all">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-2xl bg-premium-bg flex items-center justify-center text-premium-primary font-black text-xs group-hover:bg-premium-secondary group-hover:text-white transition-colors">
                            {o.id.toString().charAt(0)}
                          </div>
                          <div>
                            <p className="text-[13px] font-black text-premium-primary uppercase tracking-tight">Order #{o.id} Dispatched</p>
                            <p className="text-[10px] text-premium-text-muted font-bold uppercase tracking-widest">{new Date(o.created_at).toLocaleDateString()} • {o.status.replace('_', ' ')}</p>
                          </div>
                        </div>
                        <Price amount={o.total_price} className="text-sm font-black text-premium-primary" />
                      </div>
                    ))}
                    {orders.length === 0 && (
                        <p className="py-12 text-center text-premium-text-muted text-[10px] font-black uppercase tracking-widest">No recent activity found</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'My Wishlist' && (
              <motion.div key="wishlist" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto py-12">
                <div className="bg-white border border-premium-divider rounded-[3rem] p-20 text-center space-y-6">
                  <Heart size={48} className="mx-auto text-premium-secondary opacity-20" />
                  <h2 className="text-2xl font-black uppercase tracking-widest text-premium-primary">Wishlist Registry</h2>
                  <p className="text-premium-text-muted max-w-md mx-auto">Assets you mark for collection will appear here. Currently, your registry is empty.</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'Saved Addresses' && (
              <motion.div key="addresses" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto py-12 px-6">
                <div className="flex justify-between items-center mb-12">
                   <div>
                      <h2 className="text-3xl font-black uppercase tracking-tighter text-premium-primary">Delivery Coordinates</h2>
                      <p className="text-premium-text-muted text-xs font-bold uppercase tracking-widest mt-1">Manage your primary shipping destinations for rapid asset dispatch.</p>
                   </div>
                   <button 
                    onClick={() => { setEditingAddress(null); setAddressForm({ address_line_1: '', address_line_2: '', city: '', state: '', postal_code: '', country: 'United Kingdom', is_default: false }); setShowAddressModal(true) }}
                    className="flex items-center gap-3 bg-premium-primary text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-premium-secondary transition-all shadow-xl shadow-premium-primary/10"
                   >
                     <Plus size={16} /> Add New Address
                   </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {addresses.map((addr: any) => (
                    <div key={addr.id} className="bg-white border border-premium-divider rounded-[2rem] p-10 relative group hover:border-premium-secondary transition-all duration-500 shadow-sm">
                      {addr.is_default && (
                        <div className="absolute top-8 right-8 bg-premium-secondary/10 text-premium-secondary px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border border-premium-secondary/20">
                          Primary
                        </div>
                      )}
                      <div className="w-12 h-12 rounded-2xl bg-premium-bg flex items-center justify-center text-premium-secondary mb-8 group-hover:scale-110 transition-transform">
                        <MapPin size={20} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-black text-premium-primary uppercase tracking-tight leading-tight">{addr.address_line_1}</p>
                        {addr.address_line_2 && <p className="text-sm font-bold text-premium-text-muted uppercase tracking-wider">{addr.address_line_2}</p>}
                        <p className="text-sm font-bold text-premium-text-muted uppercase tracking-wider">{addr.city}, {addr.state} {addr.postal_code}</p>
                        <p className="text-sm font-black text-premium-primary uppercase tracking-widest pt-2">{addr.country}</p>
                      </div>
                      
                      <div className="flex items-center gap-6 mt-10 pt-10 border-t border-premium-divider/50">
                        <button 
                          onClick={() => { setEditingAddress(addr); setAddressForm({ ...addr }); setShowAddressModal(true) }}
                          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-premium-text-muted hover:text-premium-primary transition-colors"
                        >
                          <Edit2 size={14} /> Edit
                        </button>
                        <button 
                          onClick={() => {
                            if(confirm('Acknowledge deletion of these coordinates?')) {
                              api.delete(`/user-addresses/${addr.id}`).then(() => { refetchAddresses(); showNotify('Address removed'); });
                            }
                          }}
                          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  ))}

                  {addresses.length === 0 && (
                    <div className="col-span-full bg-white border border-premium-divider border-dashed rounded-[3rem] p-24 text-center">
                       <MapPin size={48} className="mx-auto text-premium-secondary/20 mb-6" />
                       <p className="text-premium-text-muted text-xs font-black uppercase tracking-[0.3em]">No saved coordinates found</p>
                    </div>
                  )}
                </div>

                {/* Address Modal */}
                <AnimatePresence>
                  {showAddressModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddressModal(false)} className="absolute inset-0 bg-premium-primary/40 backdrop-blur-sm" />
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                        animate={{ opacity: 1, scale: 1, y: 0 }} 
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                      >
                        <div className="px-10 py-8 border-b border-premium-divider bg-premium-bg flex justify-between items-center">
                          <h3 className="text-sm font-black uppercase tracking-widest text-premium-primary">{editingAddress ? 'Modify Coordinates' : 'New Delivery Point'}</h3>
                          <button onClick={() => setShowAddressModal(false)} className="text-premium-text-muted hover:text-premium-primary transition-colors">
                            <Plus size={24} className="rotate-45" />
                          </button>
                        </div>
                        <div className="p-10 space-y-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted px-1">Address Line 1</label>
                            <input 
                              value={addressForm.address_line_1} 
                              onChange={e => setAddressForm({...addressForm, address_line_1: e.target.value})}
                              className="w-full px-6 py-4 bg-premium-bg border border-premium-divider rounded-2xl outline-none focus:border-premium-secondary transition-all font-bold text-premium-primary uppercase text-xs" 
                              placeholder="STREET ADDRESS"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted px-1">City</label>
                              <input 
                                value={addressForm.city} 
                                onChange={e => setAddressForm({...addressForm, city: e.target.value})}
                                className="w-full px-6 py-4 bg-premium-bg border border-premium-divider rounded-2xl outline-none focus:border-premium-secondary transition-all font-bold text-premium-primary uppercase text-xs" 
                                placeholder="CITY"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted px-1">Postal Code</label>
                              <input 
                                value={addressForm.postal_code} 
                                onChange={e => setAddressForm({...addressForm, postal_code: e.target.value})}
                                className="w-full px-6 py-4 bg-premium-bg border border-premium-divider rounded-2xl outline-none focus:border-premium-secondary transition-all font-bold text-premium-primary uppercase text-xs" 
                                placeholder="ZIP / POSTAL"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted px-1">Country</label>
                            <input 
                              value={addressForm.country} 
                              onChange={e => setAddressForm({...addressForm, country: e.target.value})}
                              className="w-full px-6 py-4 bg-premium-bg border border-premium-divider rounded-2xl outline-none focus:border-premium-secondary transition-all font-bold text-premium-primary uppercase text-xs" 
                            />
                          </div>
                          <div className="flex items-center gap-4 pt-2">
                            <input 
                              type="checkbox" 
                              id="is_default"
                              checked={addressForm.is_default}
                              onChange={e => setAddressForm({...addressForm, is_default: e.target.checked})}
                              className="w-5 h-5 border-2 border-premium-divider rounded-md checked:bg-premium-secondary focus:ring-0 transition-all cursor-pointer" 
                            />
                            <label htmlFor="is_default" className="text-[10px] font-black uppercase tracking-widest text-premium-primary cursor-pointer select-none">Set as primary delivery point</label>
                          </div>
                        </div>
                        <div className="px-10 py-8 bg-premium-bg border-t border-premium-divider flex gap-4">
                          <button onClick={() => setShowAddressModal(false)} className="flex-1 px-8 py-4 border border-premium-divider rounded-2xl text-[10px] font-black uppercase tracking-widest text-premium-primary hover:bg-white transition-all">Cancel</button>
                          <button 
                            onClick={() => {
                              const req = editingAddress ? api.put(`/user-addresses/${editingAddress.id}`, addressForm) : api.post('/user-addresses', addressForm);
                              req.then(() => { refetchAddresses(); setShowAddressModal(false); showNotify(editingAddress ? 'Coordinates updated' : 'Delivery point registered'); });
                            }}
                            className="flex-1 px-8 py-4 bg-premium-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-premium-secondary transition-all shadow-xl shadow-premium-primary/10"
                          >
                            {editingAddress ? 'Update Coordinates' : 'Save Coordinates'}
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {activeTab === 'Profile Settings' && (
              <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto py-12 px-6">
                <div className="mb-12">
                   <h2 className="text-3xl font-black uppercase tracking-tighter text-premium-primary">Profile Configuration</h2>
                   <p className="text-premium-text-muted text-xs font-bold uppercase tracking-widest mt-1">Update your identity credentials and security parameters.</p>
                </div>

                <div className="space-y-8">
                  {/* Identity Section */}
                  <div className="bg-white border border-premium-divider rounded-[2.5rem] p-12 shadow-sm">
                    <div className="flex items-center gap-4 mb-10">
                      <div className="w-10 h-10 rounded-xl bg-premium-bg flex items-center justify-center text-premium-secondary">
                        <UserIcon size={18} />
                      </div>
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-premium-primary">Identity Details</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Avatar Upload */}
                      <div className="md:col-span-2 flex flex-col items-center mb-6">
                        <div className="relative group cursor-pointer" onClick={() => document.getElementById('avatar-upload')?.click()}>
                           <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-premium-bg shadow-xl group-hover:border-premium-secondary transition-all duration-500">
                             {profileForm.avatar || user?.avatar ? (
                               <img src={profileForm.avatar || user?.avatar} className="w-full h-full object-cover" alt="Profile" />
                             ) : (
                               <div className="w-full h-full bg-premium-bg flex items-center justify-center text-premium-secondary text-4xl font-black">
                                 {userInitials}
                               </div>
                             )}
                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="text-white" size={32} />
                             </div>
                           </div>
                           <input 
                              id="avatar-upload"
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setProfileForm({...profileForm, avatar: reader.result as string});
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                           />
                           <div className="mt-4 text-center">
                              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-premium-secondary">Update Operator Profile Image</p>
                           </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted px-1">Full Operator Name</label>
                        <input 
                          value={profileForm.name}
                          onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                          className="w-full px-6 py-4 bg-premium-bg border border-premium-divider rounded-2xl outline-none focus:border-premium-secondary transition-all font-bold text-premium-primary uppercase text-xs" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted px-1">Contact Email</label>
                        <input 
                          value={profileForm.email}
                          onChange={e => setProfileForm({...profileForm, email: e.target.value})}
                          className="w-full px-6 py-4 bg-premium-bg border border-premium-divider rounded-2xl outline-none focus:border-premium-secondary transition-all font-bold text-premium-primary uppercase text-xs" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted px-1">Mobile Uplink (Optional)</label>
                        <input 
                          value={profileForm.phone}
                          onChange={e => setProfileForm({...profileForm, phone: e.target.value})}
                          className="w-full px-6 py-4 bg-premium-bg border border-premium-divider rounded-2xl outline-none focus:border-premium-secondary transition-all font-bold text-premium-primary uppercase text-xs" 
                          placeholder="+44 000 000 000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Security Section */}
                  <div className="bg-white border border-premium-divider rounded-[2.5rem] p-12 shadow-sm">
                    <div className="flex items-center gap-4 mb-10">
                      <div className="w-10 h-10 rounded-xl bg-premium-bg flex items-center justify-center text-premium-secondary">
                        <Shield size={18} />
                      </div>
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-premium-primary">Security Protocols</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted px-1">New Access Credential</label>
                        <input 
                          type="password"
                          value={profileForm.password}
                          onChange={e => setProfileForm({...profileForm, password: e.target.value})}
                          className="w-full px-6 py-4 bg-premium-bg border border-premium-divider rounded-2xl outline-none focus:border-premium-secondary transition-all font-bold text-premium-primary uppercase text-xs" 
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted px-1">Confirm Credential</label>
                        <input 
                          type="password"
                          value={profileForm.password_confirmation}
                          onChange={e => setProfileForm({...profileForm, password_confirmation: e.target.value})}
                          className="w-full px-6 py-4 bg-premium-bg border border-premium-divider rounded-2xl outline-none focus:border-premium-secondary transition-all font-bold text-premium-primary uppercase text-xs" 
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    <p className="mt-6 text-[10px] text-premium-text-muted font-bold uppercase tracking-widest italic leading-relaxed">Leave access credentials blank if no update is required.</p>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button 
                      onClick={() => {
                        setIsUpdatingProfile(true);
                        api.put('/me', profileForm)
                          .then((res) => {
                             showNotify('Protocol updated successfully');
                             setProfileForm(prev => ({ ...prev, password: '', password_confirmation: '' }));
                             // Update local store if needed
                          })
                          .catch(() => showNotify('Protocol update failed', 'error'))
                          .finally(() => setIsUpdatingProfile(false));
                      }}
                      disabled={isUpdatingProfile}
                      className="px-12 py-5 bg-premium-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-premium-secondary transition-all shadow-2xl shadow-premium-primary/20 flex items-center gap-3 disabled:opacity-50"
                    >
                      {isUpdatingProfile ? 'Processing...' : 'Execute Configuration'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* Global Notifications */}
      <AnimatePresence>
        {notify && (
          <motion.div 
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 50 }}
            className={cn(
              "fixed bottom-10 right-10 px-8 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-4 border",
              notify.type === 'success' ? "bg-white border-green-100 text-green-600" : "bg-white border-red-100 text-red-600"
            )}
          >
            <CheckCircle2 size={20} />
            <p className="text-[10px] font-black uppercase tracking-widest">{notify.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  </div>
)
}
