import { 
  LayoutDashboard, ShoppingCart, Users, Briefcase, Settings, TrendingUp, DollarSign, 
  Plus, Palette, LayoutGrid, Menu, Sliders, AlertCircle, X, LogOut, Package, 
  DownloadCloud, Mail, Bell, CreditCard, ChevronDown, ChevronRight, Search as SearchIcon, FolderTree,
  Globe, ShieldCheck, Shield, Upload, MessageSquare, Truck, User as UserIcon, Tag, Send,
  Loader2, CheckCircle2
} from 'lucide-react'
import { useState, Fragment, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useCMSStore } from '@/store/cmsStore'
import { cmsApi } from '@/api/cms'
import { useQuery } from '@tanstack/react-query'
import api from '@/api/client'
import { cn } from '@/utils/cn'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from '@/utils/image'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, BarChart, Bar, Cell
} from 'recharts'

const RevenueChart = ({ data }: { data: any[] }) => {
  const { currencySymbol } = useCMSStore()
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#A67C52" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#A67C52" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E1D8" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#5D5D5D', fontSize: 10, fontWeight: 700 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#5D5D5D', fontSize: 10, fontWeight: 700 }}
            tickFormatter={(value) => `${currencySymbol}${value}`}
            domain={[0, 'auto']}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#FFFFFF', 
              border: '1px solid #E5E1D8', 
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 900,
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="#A67C52" 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

function AdminProfileTab({ user, showNotify }: { user: any; showNotify: (msg: string, type?: 'success' | 'error') => void }) {
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    username: user?.username || '',
    password: '',
    password_confirmation: '',
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setForm(f => ({ ...f, name: user.name || '', email: user.email || '', username: user.username || '' }))
    }
  }, [user])

  const handleSave = async () => {
    setIsSaving(true)
    const payload: any = { name: form.name, email: form.email }
    if (form.username) payload.username = form.username
    if (form.password) { payload.password = form.password; payload.password_confirmation = form.password_confirmation }
    try {
      await import('@/api/client').then(m => m.default.put('/me', payload))
      showNotify('Profile updated successfully')
      setForm(f => ({ ...f, password: '', password_confirmation: '' }))
    } catch {
      showNotify('Update failed', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const inputClass = "w-full px-5 py-3.5 bg-premium-bg border border-premium-divider rounded-xl outline-none focus:border-premium-secondary transition-all text-sm font-medium text-premium-primary placeholder:text-premium-text-muted/50"
  const labelClass = "text-[10px] font-black uppercase tracking-widest text-premium-text-muted"

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-black tracking-tighter text-premium-primary uppercase">My Profile</h1>
        <p className="text-premium-text-muted text-sm mt-1">Manage your administrator account details and credentials.</p>
      </div>

      {/* Avatar & Name */}
      <div className="bg-white border border-premium-divider rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-premium-divider">
          <div className="w-20 h-20 rounded-2xl bg-premium-secondary/10 border-2 border-premium-secondary/30 flex items-center justify-center">
            <span className="text-3xl font-black text-premium-secondary uppercase">{user?.name?.[0] || 'A'}</span>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-premium-secondary">Administrator</p>
            <p className="text-xl font-black text-premium-primary mt-1">{user?.name}</p>
            <p className="text-[10px] text-premium-text-muted font-medium">{user?.email}</p>
          </div>
        </div>

        <h3 className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted mb-6">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className={labelClass}>Full Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="Admin Name" />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Email Address</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inputClass} placeholder="admin@urair.com" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className={labelClass}>Username (optional)</label>
            <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} className={inputClass} placeholder="@username" />
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white border border-premium-divider rounded-2xl p-8 shadow-sm">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted mb-6">Change Password</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className={labelClass}>New Password</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className={inputClass} placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Confirm Password</label>
            <input type="password" value={form.password_confirmation} onChange={e => setForm({ ...form, password_confirmation: e.target.value })} className={inputClass} placeholder="••••••••" />
          </div>
        </div>
        <p className="mt-4 text-[10px] text-premium-text-muted italic">Leave blank to keep your current password.</p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-10 py-4 bg-premium-primary text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-premium-secondary transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

function AdminSecurityTab({ showNotify }: { showNotify: (msg: string, type?: 'success' | 'error') => void }) {
  const [form, setForm] = useState({ password: '', password_confirmation: '' })
  const [isSaving, setIsSaving] = useState(false)
  const [twoFactorStatus, setTwoFactorStatus] = useState(false)
  const [setupData, setSetupData] = useState<any>(null)
  const [otpCode, setOtpCode] = useState('')
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([])
  const [loading2FA, setLoading2FA] = useState(false)
  
  useEffect(() => {
    import('@/api/client').then(m => {
      m.default.get('/2fa/status').then(res => setTwoFactorStatus(res.data.enabled)).catch(console.error)
    })
  }, [])

  const handleSetup2FA = async () => {
    setLoading2FA(true)
    try {
      const res = await import('@/api/client').then(m => m.default.post('/2fa/setup'))
      setSetupData(res.data)
    } catch {
      showNotify('Failed to initialize 2FA', 'error')
    } finally {
      setLoading2FA(false)
    }
  }

  const handleEnable2FA = async () => {
    if (!otpCode || otpCode.length !== 6) { showNotify('Enter a valid 6-digit code', 'error'); return }
    setLoading2FA(true)
    try {
      const res = await import('@/api/client').then(m => m.default.post('/2fa/enable', { code: otpCode }))
      setTwoFactorStatus(true)
      setRecoveryCodes(res.data.recovery_codes)
      setSetupData(null)
      setOtpCode('')
      showNotify('2FA has been successfully enabled')
    } catch (err: any) {
      showNotify(err.response?.data?.message || 'Invalid code', 'error')
    } finally {
      setLoading2FA(false)
    }
  }

  const handleDisable2FA = async () => {
    if (!otpCode || otpCode.length !== 6) { showNotify('Enter a valid 6-digit code', 'error'); return }
    setLoading2FA(true)
    try {
      await import('@/api/client').then(m => m.default.post('/2fa/disable', { code: otpCode }))
      setTwoFactorStatus(false)
      setOtpCode('')
      showNotify('2FA has been disabled')
    } catch (err: any) {
      showNotify(err.response?.data?.message || 'Invalid code', 'error')
    } finally {
      setLoading2FA(false)
    }
  }

  const handlePasswordUpdate = async () => {
    if (!form.password) return
    if (form.password !== form.password_confirmation) {
      showNotify('Passwords do not match', 'error'); return
    }
    setIsSaving(true)
    try {
      await import('@/api/client').then(m => m.default.put('/me', form))
      showNotify('Password updated successfully')
      setForm({ password: '', password_confirmation: '' })
    } catch {
      showNotify('Password update failed', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const inputClass = "w-full px-5 py-3.5 bg-premium-bg border border-premium-divider rounded-xl outline-none focus:border-premium-secondary transition-all text-sm font-medium text-premium-primary placeholder:text-premium-text-muted/50"
  const labelClass = "text-[10px] font-black uppercase tracking-widest text-premium-text-muted"

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-black tracking-tighter text-premium-primary uppercase">Security & 2FA</h1>
        <p className="text-premium-text-muted text-sm mt-1">Manage your administrator account security settings.</p>
      </div>

      {/* Change Password */}
      <div className="bg-white border border-premium-divider rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-premium-bg border border-premium-divider flex items-center justify-center text-premium-secondary"><Shield size={16} /></div>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-premium-primary">Change Password</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className={labelClass}>New Password</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className={inputClass} placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Confirm Password</label>
            <input type="password" value={form.password_confirmation} onChange={e => setForm({ ...form, password_confirmation: e.target.value })} className={inputClass} placeholder="••••••••" />
          </div>
        </div>
        <p className="mt-4 text-[10px] text-premium-text-muted italic">Leave blank to keep your current password.</p>
        <div className="flex justify-end mt-6">
          <button onClick={handlePasswordUpdate} disabled={isSaving || !form.password} className="px-10 py-4 bg-premium-primary text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-premium-secondary transition-all shadow-lg disabled:opacity-50">
            {isSaving ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>

      {/* 2FA */}
      <div className="bg-white border border-premium-divider rounded-2xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-premium-bg border border-premium-divider flex items-center justify-center text-premium-secondary"><ShieldCheck size={16} /></div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-premium-primary">Two-Factor Authentication</h3>
              <p className="text-[10px] text-premium-text-muted mt-0.5">Add a second layer of security to your admin account</p>
            </div>
          </div>
          {twoFactorStatus ? (
             <span className="text-[8px] bg-green-50 text-green-600 border border-green-200 px-3 py-1.5 rounded-full font-black uppercase tracking-widest">Active</span>
          ) : (
             <span className="text-[8px] bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-full font-black uppercase tracking-widest">Disabled</span>
          )}
        </div>

        {recoveryCodes.length > 0 && (
          <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-[10px] text-green-800 font-black uppercase tracking-widest mb-4">Save These Recovery Codes</p>
            <p className="text-xs text-green-700 mb-4">If you lose access to your authenticator device, you can use these codes to log in. Each code can only be used once.</p>
            <div className="grid grid-cols-2 gap-3">
              {recoveryCodes.map(c => (
                <code key={c} className="bg-white px-3 py-2 rounded text-center text-xs font-mono font-bold text-green-900 border border-green-200">{c}</code>
              ))}
            </div>
            <button onClick={() => setRecoveryCodes([])} className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest w-full">I have saved them</button>
          </div>
        )}

        {twoFactorStatus ? (
          <div className="p-6 bg-premium-bg rounded-xl border border-premium-divider space-y-4">
            <p className="text-[10px] text-premium-text-muted font-bold uppercase tracking-widest">To disable 2FA, enter a code from your authenticator app.</p>
            <input type="text" value={otpCode} onChange={e => setOtpCode(e.target.value)} placeholder="123456" maxLength={6} className={inputClass} />
            <button onClick={handleDisable2FA} disabled={loading2FA} className="px-6 py-3 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-600 transition-all shadow-lg w-full">
              {loading2FA ? 'Processing...' : 'Disable 2FA'}
            </button>
          </div>
        ) : setupData ? (
          <div className="p-6 bg-premium-bg rounded-xl border border-premium-divider space-y-6">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="bg-white p-4 rounded-xl border border-premium-divider shadow-sm shrink-0">
                <img src={`data:image/svg+xml;base64,${setupData.qr_svg}`} alt="QR Code" className="w-40 h-40" />
              </div>
              <div className="space-y-4">
                <p className="text-xs font-bold text-premium-primary leading-relaxed">1. Scan this QR code with your authenticator app (Google Authenticator, Authy, etc).</p>
                <p className="text-xs font-bold text-premium-primary leading-relaxed">2. Enter the 6-digit code generated by the app below.</p>
                <input type="text" value={otpCode} onChange={e => setOtpCode(e.target.value)} placeholder="123456" maxLength={6} className={inputClass} />
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setSetupData(null)} className="px-6 py-3 bg-transparent border border-premium-divider text-premium-primary rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex-1 hover:bg-white transition-all">Cancel</button>
              <button onClick={handleEnable2FA} disabled={loading2FA} className="px-6 py-3 bg-premium-primary text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-premium-secondary transition-all shadow-lg flex-1">
                {loading2FA ? 'Verifying...' : 'Verify & Enable'}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-premium-bg rounded-xl border border-premium-divider flex items-center justify-between">
            <p className="text-[10px] text-premium-text-muted font-bold uppercase tracking-widest max-w-sm">Protect your account with two-factor authentication via a TOTP app.</p>
            <button onClick={handleSetup2FA} disabled={loading2FA} className="px-6 py-3 bg-premium-primary text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-premium-secondary transition-all shadow-lg">
              {loading2FA ? 'Loading...' : 'Enable 2FA'}
            </button>
          </div>
        )}
      </div>

      {/* Session Info */}
      <div className="bg-white border border-premium-divider rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-premium-bg border border-premium-divider flex items-center justify-center text-premium-secondary"><Bell size={16} /></div>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-premium-primary">Session & Activity</h3>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Current Session', value: 'Active', detail: 'Admin Portal · Secure Gate' },
            { label: 'Last Login', value: 'Today', detail: 'Chrome · MacOS' },
            { label: 'Password Changed', value: 'Never', detail: '—' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-4 bg-premium-bg rounded-xl border border-premium-divider">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">{item.label}</p>
                <p className="text-xs font-bold text-premium-primary mt-0.5">{item.detail}</p>
              </div>
              <span className="text-[8px] font-black uppercase tracking-widest text-premium-secondary">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const logoInputRef = useRef<HTMLInputElement>(null)
  const faviconInputRef = useRef<HTMLInputElement>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'overview'
  const setActiveTab = (tab: string) => setSearchParams({ tab })
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [productForm, setProductForm] = useState({ 
    name: '', price: '', old_price: '', stock: '', description: '', category_id: '',
    meta_description: '', stock_status: 'in_stock', backorder_available_date: '', backorder_message: '', tags: '', images: '',
    promotion_badge: ''
  })
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [categoryForm, setCategoryForm] = useState({ name: '', parent_id: '' })
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [adminForm, setAdminForm] = useState({ name: '', email: '', password: '', role: 'admin' })

  const [showHomepageSectionModal, setShowHomepageSectionModal] = useState(false)
  const [editingSection, setEditingSection] = useState<any>(null)
  const [sectionForm, setSectionForm] = useState<{
    type: string, title: string, subtitle: string, content: any, sort_order: number, is_active: boolean, items: any[]
  }>({ 
    type: 'hero', title: '', subtitle: '', content: {}, sort_order: 1, is_active: true, items: [] 
  })
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    catalog: true,
    sales: true,
    storefront: true
  })
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null)
  const [itemToDelete, setItemToDelete] = useState<{ 
    type: string, 
    name: string, 
    id?: any,
    url?: string,
    onConfirm?: () => void 
  } | null>(null)
  const [promptConfig, setPromptConfig] = useState<{ title: string, placeholder: string, onConfirm: (val: string) => void } | null>(null)

  // Cropping State
  const [croppingImage, setCroppingImage] = useState<string | null>(null)
  const [croppingTarget, setCroppingTarget] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [isCropping, setIsCropping] = useState(false)

  // Real-time Notifications State
  const [showAdminProfileDropdown, setShowAdminProfileDropdown] = useState(false)
  const [showAdminNotifications, setShowAdminNotifications] = useState(false)
  const [adminNotifications, setAdminNotifications] = useState<any[]>([])
  const [adminUnreadCount, setAdminUnreadCount] = useState(0)

  // Fetch Admin Notifications
  const { data: notificationsData } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: () => api.get('/notifications').then(res => res.data),
    refetchInterval: 30000 // Poll every 30s
  })

  useEffect(() => {
    if (notificationsData) setAdminNotifications(notificationsData)
  }, [notificationsData])

  const { data: unreadCountData } = useQuery({
    queryKey: ['admin-unread-count'],
    queryFn: () => api.get('/notifications/unread-count').then(res => res.data),
    refetchInterval: 30000
  })

  useEffect(() => {
    if (unreadCountData) setAdminUnreadCount(unreadCountData.count)
  }, [unreadCountData])

  const markAdminAsRead = async (id: string) => {
    try {
      await api.post(`/notifications/${id}/read`)
      setAdminNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date() } : n))
      setAdminUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const showNotify = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }
  
  const cms = useCMSStore()

  // Data Fetching
  const { data: dashboardData } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/admin/stats').then(res => res.data)
  })

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.get('/me').then(res => res.data)
  })

  const recentOrders = dashboardData?.recent_orders || []
  const inventorySummary = dashboardData?.inventory_overview || []

  const { data: realProducts = [], refetch: refetchProducts } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => api.get('/products').then(res => res.data)
  })

  const { data: categories = [], refetch: refetchCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(res => res.data)
  })

  const { data: homepageSections = [], refetch: refetchSections } = useQuery({
    queryKey: ['admin-sections'],
    queryFn: () => api.get('/homepage').then(res => res.data)
  })

  const { data: pages = [], refetch: refetchPages } = useQuery({
    queryKey: ['admin-pages'],
    queryFn: () => api.get('/pages').then(res => res.data),
    enabled: activeTab === 'pages'
  })

  const { data: settings = {}, refetch: refetchSettings } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => api.get('/settings').then(res => res.data)
  })

  const { data: faqs = [], refetch: refetchFaqs } = useQuery({
    queryKey: ['admin-faqs'],
    queryFn: () => api.get('/faqs').then(res => res.data)
  })

  const { data: orders = [], refetch: refetchOrders } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => api.get('/orders').then(res => res.data),
    enabled: activeTab === 'orders' || activeTab === 'overview'
  })

  const { data: customers = [], refetch: refetchCustomers } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: () => api.get('/users?role=customer').then(res => res.data),
    enabled: activeTab === 'customers'
  })

  const { data: allUsers = [], refetch: refetchAllUsers } = useQuery({
    queryKey: ['admin-all-users'],
    queryFn: () => api.get('/users?role=admin').then(res => res.data),
    enabled: activeTab === 'admins'
  })

  const { data: adminReviews = [], refetch: refetchReviews } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: () => api.get('/admin/reviews').then(res => res.data),
    enabled: activeTab === 'reviews'
  })

  const { data: subscribers = [], refetch: refetchSubscribers } = useQuery({
    queryKey: ['admin-subscribers'],
    queryFn: () => api.get('/admin/newsletter-subscribers').then(res => res.data),
    enabled: activeTab === 'newsletter'
  })

  const { data: layoutData, refetch: refetchNavigations } = useQuery({
    queryKey: ['admin-layout'],
    queryFn: () => api.get('/layout').then(res => res.data),
    enabled: activeTab === 'navigation'
  })
  const liveNavItems: { id: number; name: string; path: string; sort_order: number }[] = layoutData?.navigation || []

  const { data: curations = [], refetch: refetchCurations } = useQuery({
    queryKey: ['admin-curations'],
    queryFn: () => api.get('/curations').then(res => res.data),
    enabled: activeTab === 'curations'
  })

  const { data: coupons = [], refetch: refetchCoupons } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: () => api.get('/coupons').then(res => res.data),
    enabled: activeTab === 'coupons'
  })

  const [showCouponModal, setShowCouponModal] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<any>(null)
  const [couponForm, setCouponForm] = useState({ 
    code: '', type: 'percent', value: '', min_spend: '0', expires_at: '', usage_limit: '', is_active: true 
  })

  const { data: paymentGateways = [], refetch: refetchGateways } = useQuery({
    queryKey: ['admin-gateways'],
    queryFn: () => api.get('/payment-gateways').then(res => res.data),
    enabled: activeTab === 'gateways'
  })

  const { data: tickets = [], refetch: refetchTickets } = useQuery({
    queryKey: ['admin-tickets'],
    queryFn: () => api.get('/tickets').then(res => res.data),
    enabled: activeTab === 'tickets'
  })

  const { data: riders = [] } = useQuery({
    queryKey: ['admin-riders'],
    queryFn: () => api.get('/users?role=delivery_rider').then(res => res.data),
    enabled: activeTab === 'orders'
  })

  // Nav/Page/Curation modal state
  const [showNavModal, setShowNavModal] = useState(false)
  const [editingNav, setEditingNav] = useState<any>(null)
  const [navLinks, setNavLinks] = useState<{ name: string; path: string }[]>([])
  const [navSaved, setNavSaved] = useState(false)

  const [showFooterModal, setShowFooterModal] = useState(false)
  const [footerSectionsData, setFooterSectionsData] = useState<{ title: string; links: { name: string; path: string }[] }[]>([])

  const [showPageModal, setShowPageModal] = useState(false)
  const [editingPage, setEditingPage] = useState<any>(null)
  const [pageForm, setPageForm] = useState({ title: '', content: '', meta_description: '', is_published: true })

  const [showCurationModal, setShowCurationModal] = useState(false)
  const [editingCuration, setEditingCuration] = useState<any>(null)
  const [curationForm, setCurationForm] = useState({ name: '', description: '', image: '', product_ids: [] as number[] })

  const toggleMenu = (key: string) => {
    setExpandedMenus(prev => ({ ...prev, [key]: !prev[key] }))
  }


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showNotify('Image must be less than 2MB', 'error')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        showNotify('Opening cropper...', 'success')
        setCroppingImage(reader.result as string)
        setCroppingTarget(key)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCropComplete = async () => {
    if (!croppingImage || !croppedAreaPixels || !croppingTarget) return
    
    setIsCropping(true)
    try {
      const croppedImage = await getCroppedImg(croppingImage, croppedAreaPixels, rotation)
      await api.post('/settings', { [croppingTarget]: croppedImage })
      refetchSettings()
      showNotify(`${croppingTarget.replace('site_', '')} updated successfully`)
      setCroppingImage(null)
      setCroppingTarget(null)
      setRotation(0)
      setZoom(1)
    } catch (e) {
      showNotify('Failed to crop image', 'error')
    } finally {
      setIsCropping(false)
    }
  }

  const menuGroups = [
    {
      title: 'Main',
      items: [
        { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} /> }
      ]
    },
    {
      title: 'Catalog',
      key: 'catalog',
      items: [
        { id: 'products', label: 'Products', icon: <Briefcase size={16} /> },
        { id: 'categories', label: 'Categories', icon: <FolderTree size={16} /> }
      ]
    },
    {
      title: 'Sales',
      key: 'sales',
      items: [
        { id: 'orders', label: 'Orders', icon: <ShoppingCart size={16} /> },
        { id: 'customers', label: 'Customers', icon: <Users size={16} /> }
      ]
    },
    {
      title: 'Marketing',
      key: 'marketing',
      items: [
        { id: 'coupons', label: 'Coupons & Promos', icon: <Tag size={16} /> },
        { id: 'newsletter', label: 'Newsletter', icon: <Mail size={16} /> },
        { id: 'campaigns', label: 'Email Campaigns', icon: <TrendingUp size={16} /> },
        { id: 'reviews', label: 'Reviews', icon: <AlertCircle size={16} /> }
      ]
    },
    {
      title: 'Storefront',
      key: 'storefront',
      items: [
        { id: 'homepage', label: 'Homepage layout', icon: <LayoutGrid size={16} /> },
        { id: 'navigation', label: 'Navigation', icon: <Menu size={16} /> },
        { id: 'pages', label: 'Pages & FAQs', icon: <Palette size={16} /> },
        { id: 'curations', label: 'Curations', icon: <Sliders size={16} /> }
      ]
    },
    {
      title: 'System',
      key: 'system',
      items: [
        { id: 'admin-profile', label: 'My Profile', icon: <UserIcon size={16} /> },
        { id: 'admin-security', label: 'Security & 2FA', icon: <ShieldCheck size={16} /> },
        { id: 'settings', label: 'CMS Settings', icon: <Settings size={16} /> },
        { id: 'emails', label: 'Email Templates', icon: <Mail size={16} /> },
        { id: 'newsletter', label: 'Newsletter', icon: <Send size={16} /> },
        { id: 'identity', label: 'Site Identity & SEO', icon: <Globe size={16} /> },
        { id: 'admins', label: 'Admin Users', icon: <Users size={16} /> },
        { id: 'gateways', label: 'Payment Gateways', icon: <CreditCard size={16} /> },
        { id: 'tickets', label: 'Support Tickets', icon: <MessageSquare size={16} /> },
        { id: 'smtp', label: 'SMTP & Notifications', icon: <Bell size={16} /> }
      ]
    }
  ]

  return (
    <div className="flex h-screen bg-premium-bg font-sans text-sm text-premium-primary">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-premium-divider flex flex-col shadow-sm">
        <div className="h-16 flex items-center px-6 border-b border-premium-divider">
          <Link to="/" className="flex items-center gap-2">
            {settings.site_logo ? (
              <img src={settings.site_logo} alt="Logo" className="h-6 object-contain" />
            ) : (
              <span className="text-xl font-black tracking-tighter text-premium-primary uppercase">
                UR<span className="text-premium-secondary">AIR</span>
              </span>
            )}
            <span className="text-[10px] font-black tracking-widest text-premium-text-muted ml-2 bg-premium-bg px-2 py-0.5 rounded border border-premium-divider uppercase">Admin</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {group.key ? (
                <button 
                  onClick={() => toggleMenu(group.key!)}
                  className="w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-black text-premium-text-muted uppercase tracking-[0.2em] hover:text-premium-primary transition-colors"
                >
                  {group.title}
                  {expandedMenus[group.key] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
              ) : (
                <div className="px-2 py-1.5 text-[10px] font-black text-premium-text-muted uppercase tracking-[0.2em]">
                  {group.title}
                </div>
              )}
              
              {(!group.key || expandedMenus[group.key]) && (
                <div className="space-y-0.5 mt-1">
                  {group.items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors font-medium",
                        activeTab === item.id 
                          ? "bg-premium-secondary/10 text-premium-secondary" 
                          : "text-premium-text-muted hover:bg-premium-divider/20 hover:text-premium-primary"
                      )}
                    >
                      <span className={activeTab === item.id ? "text-premium-secondary" : "text-premium-text-muted/60"}>
                        {item.icon}
                      </span>
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-premium-divider">
          <button 
            onClick={() => { logout(); navigate('/securegate/login'); }}
            className="flex items-center gap-3 px-3 py-2 w-full text-left text-sm font-medium text-premium-text-muted hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-premium-divider flex items-center justify-between px-8">
          <div className="flex items-center bg-premium-bg border border-premium-divider/50 rounded-md px-3 py-1.5 w-96">
            <SearchIcon size={16} className="text-premium-text-muted mr-2" />
            <input type="text" placeholder="Search orders, products, customers..." className="bg-transparent border-none outline-none text-sm w-full text-premium-primary placeholder:text-premium-text-muted/50" />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowAdminNotifications(!showAdminNotifications)}
                className="p-2 text-premium-text-muted hover:text-premium-primary relative transition-colors"
              >
                <Bell size={20} />
                {adminUnreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                )}
              </button>

              <AnimatePresence>
                {showAdminNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-80 bg-white border border-premium-divider shadow-2xl rounded-2xl overflow-hidden z-[100]"
                  >
                    <div className="px-6 py-4 border-b border-premium-divider flex items-center justify-between bg-premium-bg">
                      <span className="text-[10px] font-black uppercase tracking-widest text-premium-primary">Admin Notifications</span>
                      {adminUnreadCount > 0 && (
                        <span className="text-[8px] bg-red-500 px-2 py-0.5 rounded-full text-white font-black">{adminUnreadCount} NEW</span>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {adminNotifications.length > 0 ? (
                        adminNotifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            onClick={() => {
                              if (!notif.read_at) markAdminAsRead(notif.id);
                              if (notif.data.action_url) navigate(notif.data.action_url);
                              setShowAdminNotifications(false);
                            }}
                            className={cn(
                              "px-6 py-4 hover:bg-premium-bg cursor-pointer border-b border-premium-divider transition-colors relative",
                              !notif.read_at && "bg-red-50/30"
                            )}
                          >
                            {!notif.read_at && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1 bg-red-500 rounded-full" />}
                            <p className="text-xs font-bold text-premium-primary">{notif.data.title}</p>
                            <p className="text-[10px] text-premium-text-muted mt-1 leading-relaxed">{notif.data.message}</p>
                            <p className="text-[8px] text-stone mt-2 uppercase font-bold">{new Date(notif.created_at).toLocaleDateString()}</p>
                          </div>
                        ))
                      ) : (
                        <div className="px-6 py-12 text-center">
                          <Bell size={24} className="mx-auto mb-3 text-premium-divider" />
                          <p className="text-[10px] text-premium-text-muted font-bold uppercase tracking-widest">No alerts today</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button 
                onClick={() => setShowAdminProfileDropdown(!showAdminProfileDropdown)}
                className="w-8 h-8 bg-premium-secondary rounded-full text-white flex items-center justify-center font-bold text-sm shadow-sm hover:scale-110 transition-all uppercase"
              >
                {user?.name?.[0] || 'A'}
              </button>
              
              <AnimatePresence>
                {showAdminProfileDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-64 bg-white border border-premium-divider shadow-2xl rounded-2xl overflow-hidden z-[100] p-2"
                  >
                    <div className="px-4 py-4 border-b border-premium-divider mb-2 bg-premium-bg rounded-xl">
                      <p className="text-[10px] font-black uppercase tracking-widest text-premium-secondary">Administrator</p>
                      <p className="text-sm font-black text-premium-primary truncate">{user?.name}</p>
                      <p className="text-[10px] text-premium-text-muted truncate">{user?.email}</p>
                    </div>
                    
                    <button onClick={() => { setActiveTab('settings'); setShowAdminProfileDropdown(false); }} className="flex items-center gap-3 w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest text-premium-primary hover:bg-premium-bg rounded-xl transition-all group">
                      <UserIcon size={16} className="text-premium-secondary group-hover:scale-110 transition-transform" />
                      Profile
                    </button>
                    
                    <button onClick={() => { setActiveTab('admin-security'); setShowAdminProfileDropdown(false); }} className="flex items-center gap-3 w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest text-premium-primary hover:bg-premium-bg rounded-xl transition-all group">
                      <Shield size={16} className="text-premium-secondary group-hover:scale-110 transition-transform" />
                      Security & 2FA
                    </button>

                    <div className="mt-2 pt-2 border-t border-premium-divider">
                      <button 
                        onClick={() => { logout(); navigate('/securegate/login'); }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 rounded-xl transition-all group"
                      >
                        <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-7xl mx-auto">
               <div className="grid lg:grid-cols-3 gap-8">
                  {/* Performance Indicators */}
                  <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {dashboardData?.overview?.map((stat: any, idx: number) => (
                      <div key={idx} className="bg-white p-8 rounded-[2rem] border border-premium-divider shadow-sm hover:border-premium-secondary transition-all group">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-premium-text-muted text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                            <p className="text-4xl font-black text-premium-primary mt-3 tracking-tighter">{stat.value}</p>
                          </div>
                          <div className="p-4 bg-premium-bg border border-premium-divider rounded-2xl text-premium-secondary group-hover:scale-110 transition-transform">
                            {stat.icon === 'DollarSign' && <DollarSign size={24} />}
                            {stat.icon === 'ShoppingCart' && <ShoppingCart size={24} />}
                            {stat.icon === 'Users' && <Users size={24} />}
                            {stat.icon === 'TrendingUp' && <TrendingUp size={24} />}
                          </div>
                        </div>
                        <div className="mt-6 flex items-center text-[10px] font-black uppercase tracking-widest">
                          <span className={cn(
                            "px-3 py-1 rounded-full",
                            stat.trend?.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                          )}>{stat.trend || '0%'}</span>
                          <span className="text-premium-text-muted ml-3">vs period</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Revenue Growth Chart */}
                  <div className="lg:col-span-3 bg-white p-10 rounded-[2.5rem] border border-premium-divider shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-premium-primary">Revenue Velocity</h3>
                        <p className="text-[10px] text-premium-text-muted font-bold uppercase tracking-widest mt-1">Net performance over the last 6 months</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-premium-secondary" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-premium-primary">Revenue</span>
                        </div>
                      </div>
                    </div>
                    <RevenueChart data={dashboardData?.sales_chart || []} />
                  </div>

                  {/* Staff & Logistics */}
                  {(user?.role === 'admin' || user?.role === 'developer') && (
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {dashboardData?.logistics?.map((stat: any, idx: number) => (
                        <div key={idx} className="bg-premium-bg/50 p-6 rounded-2xl border border-premium-divider/50 flex items-center gap-5">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-premium-secondary shadow-sm">
                            {stat.icon === 'Truck' && <Truck size={20} />}
                            {stat.icon === 'Package' && <Package size={20} />}
                            {stat.icon === 'Briefcase' && <Briefcase size={20} />}
                            {stat.icon === 'AlertCircle' && <AlertCircle size={20} />}
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">{stat.label}</p>
                            <p className="text-xl font-black text-premium-primary mt-1">{stat.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Left Column: Analytics & Orders */}
                  <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2.5rem] border border-premium-divider shadow-sm p-10">
                       <h3 className="text-xs font-black uppercase tracking-[0.3em] text-premium-primary mb-10">Category Revenue Index</h3>
                       <div className="space-y-8">
                          {dashboardData?.category_index?.map((cat: any, idx: number) => {
                             const maxRevenue = Math.max(...(dashboardData?.category_index?.map((c: any) => Number(c.revenue)) || [1000]));
                             const percentage = (Number(cat.revenue) / maxRevenue) * 100;
                             return (
                               <div key={idx} className="space-y-3">
                                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                                     <span className="text-premium-primary">{cat.name}</span>
                                     <span className="text-premium-secondary">{cms.currencySymbol}{Number(cat.revenue).toLocaleString()}</span>
                                  </div>
                                  <div className="h-2 w-full bg-premium-bg rounded-full overflow-hidden">
                                     <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        className="h-full bg-premium-secondary"
                                     />
                                  </div>
                               </div>
                             )
                          })}
                          {(!dashboardData?.category_index || dashboardData.category_index.length === 0) && (
                            <p className="text-center text-[10px] text-premium-text-muted font-bold uppercase tracking-widest py-10 italic">No category data available</p>
                          )}
                       </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-premium-divider shadow-sm p-10">
                       <h3 className="text-xs font-black uppercase tracking-[0.3em] text-premium-primary mb-10">Recent Operations</h3>
                       <div className="divide-y divide-premium-divider">
                         {recentOrders.length > 0 ? recentOrders.slice(0, 5).map((o: any) => (
                           <div key={o.id} className="flex items-center justify-between py-6 group">
                             <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-premium-bg flex items-center justify-center text-premium-primary font-black text-xs">
                                   {o.user?.name?.charAt(0).toUpperCase() || 'G'}
                                </div>
                                <div>
                                  <p className="text-[13px] font-black text-premium-primary uppercase tracking-tight">Order #{o.id}</p>
                                  <p className="text-[10px] text-premium-text-muted font-bold uppercase tracking-widest">{o.user?.name || 'Guest'} • {new Date(o.created_at).toLocaleDateString()}</p>
                                </div>
                             </div>
                             <div className="text-right">
                               <p className="text-sm font-black text-premium-primary">{cms.currencySymbol}{Number(o.total_price).toFixed(2)}</p>
                               <span className={cn(
                                 "text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest mt-1 inline-block",
                                 o.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
                                 o.status === 'sent_for_delivery' ? 'bg-blue-50 text-blue-700' :
                                 'bg-amber-50 text-amber-700'
                               )}>{o.status?.replace('_', ' ') || 'Pending'}</span>
                             </div>
                           </div>
                         )) : (
                           <p className="py-10 text-center text-premium-text-muted text-xs font-black uppercase tracking-widest">No recent activity</p>
                         )}
                       </div>
                    </div>
                  </div>

                  {/* Right Column: Leaderboard & Inventory */}
                  <div className="space-y-8">
                    <div className="bg-premium-primary rounded-[2.5rem] shadow-2xl p-10 text-white">
                       <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-premium-secondary mb-10">Performance Leaders</h3>
                       <div className="space-y-8">
                          {dashboardData?.top_products?.map((p: any, idx: number) => (
                             <div key={idx} className="flex items-center gap-5">
                                <span className="text-3xl font-black text-white/10 italic">#0{idx + 1}</span>
                                <div>
                                   <p className="text-[12px] font-black uppercase tracking-tight">{p.name}</p>
                                   <p className="text-[10px] text-premium-secondary font-black uppercase tracking-widest mt-1">{p.total_sold} Dispatches</p>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-premium-divider shadow-sm p-10">
                       <h3 className="text-xs font-black uppercase tracking-[0.3em] text-premium-primary mb-10">Inventory Alerts</h3>
                       <div className="space-y-5">
                         {inventorySummary.slice(0, 5).map((p: any) => (
                           <div key={p.id} className="flex items-center justify-between border-b border-premium-divider/30 pb-5 last:border-0 last:pb-0">
                             <div>
                               <p className="text-[12px] font-black text-premium-primary uppercase tracking-tight truncate max-w-[140px]">{p.name}</p>
                               <p className="text-[10px] text-premium-text-muted font-black uppercase tracking-widest mt-1">{p.stock} Remaining</p>
                             </div>
                             <span className={cn(
                               "text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest",
                               p.stock === 0 ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                             )}>{p.stock === 0 ? 'Empty' : 'Low'}</span>
                           </div>
                         ))}
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Product Slide-over Form */}
              {showProductForm && (
                <div className="fixed inset-0 z-50 flex">
                  <div className="fixed inset-0 bg-black/40" onClick={() => { setShowProductForm(false); setEditingProduct(null); setProductForm({ name: '', price: '', old_price: '', promotion_badge: '', stock: '', description: '', category_id: '', meta_description: '', stock_status: 'in_stock', backorder_available_date: '', backorder_message: '', tags: '', images: '' }) }} />
                  <div className="relative ml-auto w-full max-w-lg bg-white h-full shadow-2xl flex flex-col">
                    <div className="flex items-center justify-between px-8 py-6 border-b border-premium-divider">
                      <h2 className="text-lg font-black uppercase tracking-tight text-premium-primary">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                      <button onClick={() => { setShowProductForm(false); setEditingProduct(null); setProductForm({ name: '', price: '', old_price: '', promotion_badge: '', stock: '', description: '', category_id: '', meta_description: '', stock_status: 'in_stock', backorder_available_date: '', backorder_message: '', tags: '', images: '' }) }} className="text-premium-text-muted hover:text-premium-primary"><X size={20} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Product Name *</label>
                        <input value={productForm.name} onChange={e => setProductForm(p => ({ ...p, name: e.target.value }))} className="w-full px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary" placeholder="e.g. URAIR Pro Jacket" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Description</label>
                        <textarea value={productForm.description} onChange={e => setProductForm(p => ({ ...p, description: e.target.value }))} rows={4} className="w-full px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary resize-none" placeholder="Product description..." />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Price ({cms.currencySymbol}) *</label>
                          <input type="number" min="0" step="0.01" value={productForm.price} onChange={e => setProductForm(p => ({ ...p, price: e.target.value }))} className="w-full px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary" placeholder="0.00" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Original Price ({cms.currencySymbol}) <span className="text-premium-text-muted lowercase font-medium">(strikethrough)</span></label>
                          <input type="number" min="0" step="0.01" value={productForm.old_price} onChange={e => setProductForm(p => ({ ...p, old_price: e.target.value }))} className="w-full px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary" placeholder="0.00" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Promotion Badge</label>
                          <input value={productForm.promotion_badge} onChange={e => setProductForm(p => ({ ...p, promotion_badge: e.target.value }))} className="w-full px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary" placeholder="e.g. SALE, 50% OFF" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Stock Qty *</label>
                          <input type="number" min="0" value={productForm.stock} onChange={e => setProductForm(p => ({ ...p, stock: e.target.value }))} className="w-full px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary" placeholder="0" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Short SEO Description</label>
                        <input value={productForm.meta_description} onChange={e => setProductForm(p => ({ ...p, meta_description: e.target.value }))} className="w-full px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary" placeholder="Max 160 characters..." maxLength={160} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Tags (comma separated)</label>
                        <input value={productForm.tags} onChange={e => setProductForm(p => ({ ...p, tags: e.target.value }))} className="w-full px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary" placeholder="tech, luxury, gear" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Image URLs (comma separated)</label>
                        <input value={productForm.images} onChange={e => setProductForm(p => ({ ...p, images: e.target.value }))} className="w-full px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary" placeholder="https://..., https://..." />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Stock Status</label>
                          <select value={productForm.stock_status} onChange={e => setProductForm(p => ({ ...p, stock_status: e.target.value }))} className="w-full px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary bg-white">
                            <option value="in_stock">In Stock</option>
                            <option value="out_of_stock">Out of Stock</option>
                            <option value="backorder">Backorder</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Category</label>
                          <select value={productForm.category_id} onChange={e => setProductForm(p => ({ ...p, category_id: e.target.value }))} className="w-full px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary bg-white">
                            <option value="">— Select Category —</option>
                            {categories.map((c: any) => (
                              <optgroup key={c.id} label={c.name}>
                                <option value={c.id}>{c.name}</option>
                                {(c.children || []).map((child: any) => (
                                  <option key={child.id} value={child.id}>-- {child.name}</option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                        </div>
                      </div>
                      {productForm.stock_status === 'backorder' && (
                        <div className="grid grid-cols-2 gap-4 bg-amber-50 p-4 rounded-md border border-amber-200">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-amber-800">Available Date</label>
                            <input type="date" value={productForm.backorder_available_date} onChange={e => setProductForm(p => ({ ...p, backorder_available_date: e.target.value }))} className="w-full px-4 py-3 border border-amber-200 rounded-md text-sm font-medium text-amber-900 outline-none focus:border-amber-400" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-amber-800">Message</label>
                            <input value={productForm.backorder_message} onChange={e => setProductForm(p => ({ ...p, backorder_message: e.target.value }))} className="w-full px-4 py-3 border border-amber-200 rounded-md text-sm font-medium text-amber-900 outline-none focus:border-amber-400" placeholder="Ships in 2 weeks..." />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="px-8 py-6 border-t border-premium-divider flex gap-4">
                      <button onClick={() => { setShowProductForm(false); setEditingProduct(null) }} className="flex-1 px-4 py-3 border border-premium-divider rounded-md text-xs font-black uppercase tracking-widest text-premium-primary hover:bg-premium-bg">Cancel</button>
                      <button onClick={() => {
                        const payload = { 
                          name: productForm.name, 
                          price: parseFloat(productForm.price) || 0, 
                          old_price: productForm.old_price ? parseFloat(productForm.old_price) : null,
                          promotion_badge: productForm.promotion_badge || null,
                          stock: parseInt(productForm.stock) || 0, 
                          description: productForm.description, 
                          category_id: productForm.category_id || null,
                          meta_description: productForm.meta_description,
                          stock_status: productForm.stock_status,
                          backorder_available_date: productForm.backorder_available_date || null,
                          backorder_message: productForm.backorder_message,
                          tags: productForm.tags ? (typeof productForm.tags === 'string' ? productForm.tags.split(',').map(t => t.trim()) : productForm.tags) : [],
                          images: productForm.images ? (typeof productForm.images === 'string' ? productForm.images.split(',').map(i => i.trim()) : productForm.images) : []
                        };
                        const req = editingProduct ? api.put(`/products/${editingProduct.id}`, payload) : api.post('/products', payload);
                        req.then(() => { refetchProducts(); setShowProductForm(false); setEditingProduct(null); setProductForm({ name: '', price: '', old_price: '', promotion_badge: '', stock: '', description: '', category_id: '', meta_description: '', stock_status: 'in_stock', backorder_available_date: '', backorder_message: '', tags: '', images: '' }) });
                      }} className="flex-1 bg-premium-primary text-white px-4 py-3 rounded-md text-xs font-black uppercase tracking-widest hover:bg-premium-secondary shadow-sm">{editingProduct ? 'Save Changes' : 'Add Product'}</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-black tracking-tighter text-premium-primary uppercase">Products</h1>
                  <p className="text-premium-text-muted text-sm mt-1">Manage your catalog, pricing, stock, and details.</p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="px-4 py-2 border border-premium-divider rounded-md text-xs font-bold uppercase tracking-widest text-premium-primary hover:bg-premium-bg transition-colors flex items-center gap-2 cursor-pointer">
                    <Package size={14} /> Import CSV
                    <input type="file" accept=".csv" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0]; if (!file) return;
                      const form = new FormData(); form.append('file', file);
                      api.post('/products/import', form).then(() => refetchProducts());
                    }} />
                  </label>
                  <button onClick={() => {
                      api.get('/products/export', { responseType: 'blob' }).then(res => {
                          const url = window.URL.createObjectURL(new Blob([res.data]));
                          const link = document.createElement('a');
                          link.href = url;
                          link.setAttribute('download', 'products_export.csv');
                          document.body.appendChild(link);
                          link.click();
                      });
                  }} className="px-4 py-2 border border-premium-divider rounded-md text-xs font-bold uppercase tracking-widest text-premium-primary hover:bg-premium-bg transition-colors flex items-center gap-2 cursor-pointer">
                    <DownloadCloud size={14} /> Export CSV
                  </button>
                  <button onClick={() => { setEditingProduct(null); setProductForm({ name: '', price: '', old_price: '', promotion_badge: '', stock: '', description: '', category_id: '', meta_description: '', stock_status: 'in_stock', backorder_available_date: '', backorder_message: '', tags: '', images: '' }); setShowProductForm(true) }} className="bg-premium-primary text-white px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest hover:bg-premium-secondary transition-colors flex items-center gap-2 shadow-sm">
                    <Plus size={16} /> Add Product
                  </button>
                </div>
              </div>

              <div className="bg-white border border-premium-divider rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-premium-bg border-b border-premium-divider text-premium-text-muted">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Product</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Category</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Price</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Stock</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-premium-divider">
                    {realProducts.map((p: any) => (
                      <tr key={p.id} className="hover:bg-premium-bg transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-md border border-premium-divider bg-premium-bg overflow-hidden flex-shrink-0">
                                {p.images?.[0] ? <img src={p.images[0]} className="w-full h-full object-cover" alt="" /> : <Package className="m-auto mt-3 text-premium-text-muted/50" size={20}/>}
                             </div>
                             <div>
                                <p className="font-bold text-premium-primary">{p.name}</p>
                                <p className="text-xs text-premium-text-muted font-medium">{p.slug}</p>
                             </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-premium-bg border border-premium-divider/50 text-premium-primary">
                            {p.category?.name || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-premium-primary">{cms.currencySymbol}{p.price}</td>
                        <td className="px-6 py-4 text-premium-text-muted font-medium">{p.stock}</td>
                        <td className="px-6 py-4 text-right space-x-4">
                           <button onClick={() => { setEditingProduct(p); setProductForm({ name: p.name, price: String(p.price), old_price: String(p.old_price || ''), promotion_badge: p.promotion_badge || '', stock: String(p.stock), description: p.description || '', category_id: String(p.category_id || ''), meta_description: p.meta_description || '', stock_status: p.stock_status || 'in_stock', backorder_available_date: p.backorder_available_date || '', backorder_message: p.backorder_message || '', tags: Array.isArray(p.tags) ? p.tags.join(', ') : '', images: Array.isArray(p.images) ? p.images.join(', ') : '' }); setShowProductForm(true) }} className="text-premium-secondary hover:text-premium-primary font-bold text-xs tracking-wider uppercase transition-colors">Edit</button>
                           <button onClick={() => setItemToDelete({ 
                              type: 'Product', 
                              name: p.name,
                              onConfirm: () => api.delete(`/products/${p.id}`).then(() => { refetchProducts(); showNotify('Product deleted'); setItemToDelete(null); })
                            })} className="text-red-500 hover:text-red-700 font-bold text-xs tracking-wider uppercase transition-colors">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {showCategoryModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <div className="fixed inset-0 bg-black/40" onClick={() => { setShowCategoryModal(false); setEditingCategory(null); setCategoryForm({ name: '', parent_id: '' }) }} />
                  <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-premium-divider bg-premium-bg">
                      <h2 className="text-sm font-black uppercase tracking-tight text-premium-primary">{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
                      <button onClick={() => { setShowCategoryModal(false); setEditingCategory(null); setCategoryForm({ name: '', parent_id: '' }) }} className="text-premium-text-muted hover:text-premium-primary"><X size={18} /></button>
                    </div>
                    <div className="px-6 py-6 space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Category Name *</label>
                        <input value={categoryForm.name} onChange={e => setCategoryForm(prev => ({ ...prev, name: e.target.value }))} autoFocus className="w-full px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary" placeholder="e.g. Smartwatches" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Parent Category (Optional)</label>
                        <select value={categoryForm.parent_id} onChange={e => setCategoryForm(prev => ({ ...prev, parent_id: e.target.value }))} className="w-full px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary bg-white">
                          <option value="">— None (Top Level) —</option>
                          {categories.map((c: any) => (
                             (!editingCategory || c.id !== editingCategory.id) && <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="px-6 py-4 border-t border-premium-divider flex gap-3 bg-gray-50/50">
                      <button onClick={() => { setShowCategoryModal(false); setEditingCategory(null); setCategoryForm({ name: '', parent_id: '' }) }} className="flex-1 px-4 py-2.5 border border-premium-divider rounded-md text-[10px] font-black uppercase tracking-widest text-premium-primary hover:bg-premium-bg">Cancel</button>
                      <button onClick={() => {
                        const payload = { name: categoryForm.name, parent_id: categoryForm.parent_id || null };
                        const req = editingCategory ? api.put(`/categories/${editingCategory.id}`, payload) : api.post('/categories', payload);
                        req.then(() => { refetchCategories(); setShowCategoryModal(false); setEditingCategory(null); setCategoryForm({ name: '', parent_id: '' }) });
                      }} disabled={!categoryForm.name.trim()} className="flex-1 bg-premium-primary text-white px-4 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-premium-secondary shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">{editingCategory ? 'Save' : 'Create'}</button>
                    </div>
                  </div>
                </div>
              )}



              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-black tracking-tighter text-premium-primary uppercase">Categories</h1>
                  <p className="text-premium-text-muted text-sm mt-1">Manage product categories to organize your catalog.</p>
                </div>
                <button onClick={() => { setEditingCategory(null); setCategoryForm({ name: '', parent_id: '' }); setShowCategoryModal(true) }} className="bg-premium-primary text-white px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest hover:bg-premium-secondary transition-colors flex items-center gap-2 shadow-sm">
                  <Plus size={16} /> Add Category
                </button>
              </div>
              <div className="bg-white border border-premium-divider rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-premium-bg border-b border-premium-divider text-premium-text-muted">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Name</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Slug</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-premium-divider">
                    {categories.map((c: any) => (
                      <Fragment key={c.id}>
                        <tr className="hover:bg-premium-bg transition-colors">
                          <td className="px-6 py-4 font-bold text-premium-primary">{c.name}</td>
                          <td className="px-6 py-4 text-xs text-premium-text-muted">{c.slug}</td>
                          <td className="px-6 py-4 text-right space-x-4">
                             <button onClick={() => { setEditingCategory(c); setCategoryForm({ name: c.name, parent_id: '' }); setShowCategoryModal(true); }} className="text-premium-secondary hover:text-premium-primary font-bold text-xs tracking-wider uppercase transition-colors">Edit</button>
                             <button onClick={() => setItemToDelete({ 
                               type: 'Category', 
                               name: c.name,
                               onConfirm: () => api.delete(`/categories/${c.id}`).then(() => { refetchCategories(); showNotify('Category deleted'); setItemToDelete(null); })
                             })} className="text-red-500 hover:text-red-700 font-bold text-xs tracking-wider uppercase transition-colors">Delete</button>
                          </td>
                        </tr>
                        {(c.children || []).map((child: any) => (
                          <tr key={child.id} className="hover:bg-premium-bg transition-colors bg-premium-bg/30">
                            <td className="px-6 py-4 font-medium text-premium-text-muted flex items-center gap-2">
                              <span className="w-4 h-px bg-premium-divider/80 inline-block ml-4" />
                              {child.name}
                            </td>
                            <td className="px-6 py-4 text-xs text-premium-text-muted">{child.slug}</td>
                            <td className="px-6 py-4 text-right space-x-4">
                               <button onClick={() => { setEditingCategory(child); setCategoryForm({ name: child.name, parent_id: String(c.id) }); setShowCategoryModal(true); }} className="text-premium-secondary hover:text-premium-primary font-bold text-xs tracking-wider uppercase transition-colors">Edit</button>
                               <button onClick={() => setItemToDelete({ 
                                  type: 'Category', 
                                  name: child.name,
                                  onConfirm: () => api.delete(`/categories/${child.id}`).then(() => { refetchCategories(); showNotify('Category deleted'); setItemToDelete(null); })
                                })} className="text-red-500 hover:text-red-700 font-bold text-xs tracking-wider uppercase transition-colors">Delete</button>
                            </td>
                          </tr>
                        ))}
                      </Fragment>
                    ))}
                    {categories.length === 0 && (
                      <tr><td colSpan={3} className="px-6 py-12 text-center text-premium-text-muted font-medium">No categories added yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-black tracking-tighter text-premium-primary uppercase">Orders</h1>
                  <p className="text-premium-text-muted text-sm mt-1">View and manage all customer orders.</p>
                </div>
              </div>
              <div className="bg-white border border-premium-divider rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-premium-bg border-b border-premium-divider text-premium-text-muted">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Order ID</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Customer</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Total</th>
                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Rider</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Date</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-premium-divider">
                    {orders.map((o: any) => (
                      <tr key={o.id} className="hover:bg-premium-bg transition-colors">
                        <td className="px-6 py-4 font-bold text-premium-primary">#{o.id}</td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-premium-primary">{o.user?.name || 'Guest'}</p>
                          <p className="text-xs text-premium-text-muted">{o.user?.email}</p>
                        </td>
                        <td className="px-6 py-4 font-bold text-premium-primary">{cms.currencySymbol}{Number(o.total_price).toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "text-[10px] px-2 py-1 rounded font-black uppercase tracking-widest",
                            o.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
                            o.status === 'sent_for_delivery' ? 'bg-blue-50 text-blue-700' :
                            o.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                            'bg-amber-50 text-amber-700'
                          )}>{o.status.replace('_', ' ')}</span>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={o.rider_id || ''}
                            onChange={(e) => api.put(`/orders/${o.id}`, { rider_id: e.target.value }).then(() => refetchOrders())}
                            className="text-[10px] border border-premium-divider rounded px-2 py-1 text-premium-primary font-black uppercase bg-white cursor-pointer outline-none focus:border-premium-secondary"
                          >
                            <option value="">No Rider</option>
                            {riders.map((r: any) => (
                              <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-premium-text-muted font-medium">
                          {new Date(o.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <select
                            value={o.status}
                            onChange={(e) => api.put(`/orders/${o.id}`, { status: e.target.value }).then(() => refetchOrders())}
                            className="text-xs border border-premium-divider rounded px-2 py-1 text-premium-primary font-bold bg-white cursor-pointer outline-none focus:border-premium-secondary"
                          >
                            <option value="pending">Pending</option>
                            <option value="received">Received</option>
                            <option value="packed">Packed</option>
                            <option value="sent_for_delivery">Sent for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="refunded">Refunded</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr><td colSpan={7} className="px-6 py-12 text-center text-premium-text-muted font-medium">No orders placed yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h1 className="text-2xl font-black tracking-tighter text-premium-primary uppercase">Customers</h1>
                <p className="text-premium-text-muted text-sm mt-1">All registered accounts on the platform.</p>
              </div>
              <div className="bg-white border border-premium-divider rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-premium-bg border-b border-premium-divider text-premium-text-muted">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Name</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Email</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Role</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Joined</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-premium-divider">
                    {customers.map((u: any) => (
                      <tr key={u.id} className="hover:bg-premium-bg transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-premium-secondary/10 text-premium-secondary rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-bold text-premium-primary">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-premium-text-muted font-medium">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "text-[10px] px-2 py-1 rounded font-black uppercase tracking-widest",
                            u.role === 'admin' ? 'bg-premium-secondary/10 text-premium-secondary' : 'bg-premium-bg border border-premium-divider/50 text-premium-primary'
                          )}>{u.role || 'customer'}</span>
                        </td>
                        <td className="px-6 py-4 text-premium-text-muted font-medium">
                          {new Date(u.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                         <td className="px-6 py-4 text-right flex items-center justify-end gap-3">
                           <select 
                             value={u.role || 'customer'}
                             onChange={(e) => api.put(`/users/${u.id}`, { role: e.target.value }).then(() => refetchCustomers())}
                             className="text-[10px] border border-premium-divider rounded px-2 py-1 text-premium-primary font-black uppercase bg-white cursor-pointer"
                           >
                             <option value="customer">Customer</option>
                             <option value="admin">Admin</option>
                             <option value="finance">Finance</option>
                             <option value="stock_agent">Stock Agent</option>
                             <option value="delivery_rider">Rider</option>
                             <option value="developer">Developer</option>
                           </select>
                           <button onClick={() => setItemToDelete({ id: u.id, type: 'Customer', url: `/users/${u.id}`, name: u.name })} className="text-red-500 hover:text-red-700 font-bold text-xs tracking-wider uppercase transition-colors">Remove</button>
                         </td>
                      </tr>
                    ))}
                    {customers.length === 0 && (
                      <tr><td colSpan={5} className="px-6 py-12 text-center text-premium-text-muted font-medium">No registered customers yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'homepage' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-black tracking-tighter text-premium-primary uppercase">Homepage Layout</h1>
                  <p className="text-premium-text-muted text-sm mt-1">Design your storefront using dynamic, reorderable sections.</p>
                </div>
                <button 
                  onClick={() => {
                    setEditingSection(null);
                    setSectionForm({ type: 'hero', title: '', subtitle: '', content: {}, sort_order: homepageSections.length + 1, is_active: true, items: [] });
                    setShowHomepageSectionModal(true);
                  }}
                  className="premium-button"
                >
                  <Plus size={16} /> Add Section
                </button>
              </div>

              <div className="space-y-4">
                {homepageSections.map((section: any) => (
                  <div key={section.id} className="bg-white border border-premium-divider rounded-lg shadow-sm p-6 group">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-premium-bg border border-premium-divider rounded-xl text-premium-secondary">
                          <LayoutGrid size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-black uppercase tracking-widest text-premium-primary">{section.type.replace('_', ' ')}</h3>
                            {!section.is_active && <span className="text-[8px] font-black uppercase tracking-widest bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Hidden</span>}
                          </div>
                          <p className="text-xs text-premium-text-muted font-medium mt-1">{section.title || 'No Title'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            setEditingSection(section);
                            setSectionForm({ 
                              ...section, 
                              content: section.content || {},
                              items: (section.items || []).map((i: any) => ({
                                product_id: i.product_id,
                                title: i.title,
                                subtitle: i.subtitle,
                                link: i.link,
                                image: i.image
                              }))
                            });
                            setShowHomepageSectionModal(true);
                          }}
                          className="px-4 py-2 border border-premium-divider text-[10px] font-black uppercase tracking-widest text-premium-primary hover:bg-premium-bg rounded-md transition-all"
                        >
                          Edit Section
                        </button>
                        <button 
                          onClick={() => setItemToDelete({ 
                            type: 'Homepage Section', 
                            name: section.type,
                            onConfirm: () => api.delete(`/homepage/sections/${section.id}`).then(() => { refetchSections(); showNotify('Section removed'); setItemToDelete(null); })
                          })}
                          className="px-4 py-2 border border-red-100 text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 rounded-md transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {homepageSections.length === 0 && (
                  <div className="bg-white border border-premium-divider border-dashed rounded-lg p-20 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-premium-bg border border-premium-divider rounded-full flex items-center justify-center mb-6 text-premium-text-muted/30">
                      <LayoutGrid size={32} />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-premium-primary">Storefront Empty</h3>
                    <p className="text-premium-text-muted text-xs max-w-xs mt-2 leading-relaxed">Your landing page is currently empty. Start building by adding your first section.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'coupons' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {showCouponModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <div className="fixed inset-0 bg-black/40" onClick={() => setShowCouponModal(false)} />
                  <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-premium-divider bg-premium-bg">
                      <h2 className="text-sm font-black uppercase tracking-tight text-premium-primary">{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</h2>
                      <button onClick={() => setShowCouponModal(false)} className="text-premium-text-muted hover:text-premium-primary"><X size={18} /></button>
                    </div>
                    <div className="px-6 py-6 space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Coupon Code *</label>
                        <input value={couponForm.code} onChange={e => setCouponForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} className="w-full px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-black text-premium-primary outline-none focus:border-premium-secondary" placeholder="e.g. SUMMER50" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Discount Type</label>
                          <select value={couponForm.type} onChange={e => setCouponForm(p => ({ ...p, type: e.target.value }))} className="w-full px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary bg-white">
                            <option value="percent">Percentage (%)</option>
                            <option value="fixed">Fixed Amount ({cms.currencySymbol})</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Value *</label>
                          <input type="number" value={couponForm.value} onChange={e => setCouponForm(p => ({ ...p, value: e.target.value }))} className="w-full px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary" placeholder="0" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Min. Spend ({cms.currencySymbol})</label>
                          <input type="number" value={couponForm.min_spend} onChange={e => setCouponForm(p => ({ ...p, min_spend: e.target.value }))} className="w-full px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary" placeholder="0" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Usage Limit</label>
                          <input type="number" value={couponForm.usage_limit} onChange={e => setCouponForm(p => ({ ...p, usage_limit: e.target.value }))} className="w-full px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary" placeholder="Unlimited" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Expiry Date</label>
                        <input type="datetime-local" value={couponForm.expires_at} onChange={e => setCouponForm(p => ({ ...p, expires_at: e.target.value }))} className="w-full px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary" />
                      </div>
                    </div>
                    <div className="px-6 py-4 border-t border-premium-divider flex gap-3 bg-gray-50/50">
                      <button onClick={() => setShowCouponModal(false)} className="flex-1 px-4 py-2.5 border border-premium-divider rounded-md text-[10px] font-black uppercase tracking-widest text-premium-primary hover:bg-premium-bg">Cancel</button>
                      <button onClick={() => {
                        const payload = { ...couponForm, value: parseFloat(couponForm.value), min_spend: parseFloat(couponForm.min_spend), usage_limit: couponForm.usage_limit ? parseInt(couponForm.usage_limit) : null };
                        const req = editingCoupon ? api.put(`/coupons/${editingCoupon.id}`, payload) : api.post('/coupons', payload);
                        req.then(() => { refetchCoupons(); setShowCouponModal(false); showNotify(editingCoupon ? 'Coupon updated' : 'Coupon created'); });
                      }} className="flex-1 bg-premium-primary text-white px-4 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-premium-secondary shadow-sm">
                        {editingCoupon ? 'Save Changes' : 'Create Coupon'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-black tracking-tighter text-premium-primary uppercase">Promotions</h1>
                  <p className="text-premium-text-muted text-sm mt-1">Manage discount codes and promotional campaigns.</p>
                </div>
                <button onClick={() => { setEditingCoupon(null); setCouponForm({ code: '', type: 'percent', value: '', min_spend: '0', expires_at: '', usage_limit: '', is_active: true }); setShowCouponModal(true) }} className="bg-premium-primary text-white px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest hover:bg-premium-secondary transition-colors flex items-center gap-2 shadow-sm">
                  <Plus size={16} /> Create Coupon
                </button>
              </div>

              <div className="bg-white border border-premium-divider rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-premium-bg border-b border-premium-divider text-premium-text-muted">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Coupon Code</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Type</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Value</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Usage</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-premium-divider">
                    {coupons.map((c: any) => (
                      <tr key={c.id} className="hover:bg-premium-bg transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-black text-premium-primary tracking-wider">{c.code}</span>
                          {new Date(c.expires_at) < new Date() && <span className="ml-2 text-[8px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-black uppercase">Expired</span>}
                        </td>
                        <td className="px-6 py-4 text-premium-text-muted font-bold uppercase text-[10px] tracking-widest">{c.type}</td>
                        <td className="px-6 py-4 font-black text-premium-primary">{c.type === 'percent' ? `${c.value}%` : `${cms.currencySymbol}${c.value}`}</td>
                        <td className="px-6 py-4 text-premium-text-muted font-medium">{c.used_count} / {c.usage_limit || '∞'}</td>
                        <td className="px-6 py-4 text-right space-x-4">
                           <button onClick={() => { setEditingCoupon(c); setCouponForm({ code: c.code, type: c.type, value: String(c.value), min_spend: String(c.min_spend), expires_at: c.expires_at ? c.expires_at.slice(0, 16) : '', usage_limit: String(c.usage_limit || ''), is_active: !!c.is_active }); setShowCouponModal(true) }} className="text-premium-secondary hover:text-premium-primary font-bold text-xs tracking-wider uppercase">Edit</button>
                           <button onClick={() => setItemToDelete({ 
                              type: 'Coupon', 
                              name: c.code,
                              onConfirm: () => api.delete(`/coupons/${c.id}`).then(() => { refetchCoupons(); showNotify('Coupon deleted'); setItemToDelete(null); })
                            })} className="text-red-500 hover:text-red-700 font-bold text-xs tracking-wider uppercase">Delete</button>
                        </td>
                      </tr>
                    ))}
                    {coupons.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-20 text-center text-premium-text-muted text-xs font-black uppercase tracking-widest">No active promotions found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h1 className="text-2xl font-black tracking-tighter text-premium-primary uppercase">CMS Settings</h1>
                <p className="text-premium-text-muted text-sm mt-1">Configure global store variables and announcements.</p>
              </div>

              <div className="bg-white border border-premium-divider rounded-lg shadow-sm p-6 space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Store Identity Name</label>
                    <input value={cms.systemName} onChange={(e) => cms.updateSettings({ systemName: e.target.value })} className="w-full px-4 py-3 border border-premium-divider/50 rounded-md focus:border-premium-secondary outline-none transition-colors sm:text-sm font-medium text-premium-primary" />
                 </div>
                 <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Announcement Bar Text</label>
                     <input value={cms.announcementText} onChange={(e) => cms.updateSettings({ announcementText: e.target.value })} className="w-full px-4 py-3 border border-premium-divider/50 rounded-md focus:border-premium-secondary outline-none transition-colors sm:text-sm font-medium text-premium-primary" />
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <input type="checkbox" id="showAnn" checked={cms.showAnnouncement} onChange={(e) => cms.updateSettings({ showAnnouncement: e.target.checked })} className="h-4 w-4 text-premium-secondary focus:ring-premium-secondary border-premium-divider rounded" />
                    <label htmlFor="showAnn" className="text-xs font-bold uppercase tracking-wider text-premium-primary">Enable Announcement Bar</label>
                  </div>

                  <div className="pt-8 border-t border-premium-divider/50 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-premium-primary">Footer Partner Logos</h3>
                    <p className="text-[10px] text-premium-text-muted font-bold uppercase tracking-widest">Upload and manage logos displayed in the footer.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(cms.paymentLogos || []).map((logo, idx) => (
                        <div key={logo.id} className="flex items-center justify-between p-4 bg-premium-bg rounded-xl border border-premium-divider/50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg border border-premium-divider bg-white p-1 overflow-hidden">
                              <img src={logo.image} alt={logo.name} className="w-full h-full object-contain grayscale" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-premium-primary">{logo.name}</p>
                              <button 
                                onClick={() => {
                                  const updated = cms.paymentLogos.filter(l => l.id !== logo.id)
                                  cms.updateSettings({ paymentLogos: updated })
                                }}
                                className="text-[9px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 mt-1"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              checked={logo.active} 
                              onChange={(e) => {
                                const updated = cms.paymentLogos.map(l => l.id === logo.id ? { ...l, active: e.target.checked } : l)
                                cms.updateSettings({ paymentLogos: updated })
                              }}
                              className="h-4 w-4 text-premium-secondary focus:ring-premium-secondary border-premium-divider rounded"
                            />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-premium-text-muted">Active</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-premium-bg rounded-xl border border-premium-divider/50 space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-premium-primary">Add New Logo</p>
                      <div className="flex gap-4">
                        <div className="flex-1 space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-premium-text-muted">Logo Name</label>
                          <input 
                            id="newLogoName"
                            className="w-full px-3 py-2 border border-premium-divider/50 rounded-md text-xs font-medium text-premium-primary outline-none focus:border-premium-secondary" 
                            placeholder="e.g. Visa" 
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-premium-text-muted">Logo File</label>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => {
                              const nameInput = document.getElementById('newLogoName') as HTMLInputElement
                              const file = e.target.files?.[0]
                              if (file && nameInput.value) {
                                if (file.size > 2 * 1024 * 1024) {
                                  showNotify('Image must be less than 2MB', 'error')
                                  return
                                }
                                const reader = new FileReader()
                                reader.onloadend = () => {
                                  const newLogo = {
                                    id: Date.now().toString(),
                                    name: nameInput.value,
                                    image: reader.result as string,
                                    active: true
                                  }
                                  cms.updateSettings({ paymentLogos: [...(cms.paymentLogos || []), newLogo] })
                                  nameInput.value = ''
                                  e.target.value = ''
                                }
                                reader.readAsDataURL(file)
                              } else if (!nameInput.value) {
                                showNotify('Please enter a name first', 'error')
                                e.target.value = ''
                              }
                            }}
                            className="w-full px-3 py-1.5 border border-premium-divider/50 rounded-md text-xs font-medium text-premium-primary outline-none focus:border-premium-secondary bg-white" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Currency Configuration */}
                  <div className="bg-white border border-premium-divider rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-premium-bg rounded-lg text-premium-secondary">
                        <DollarSign size={20} />
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-premium-primary">Currency Configuration</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted px-1">Currency Symbol</label>
                        <input 
                          value={cms.currencySymbol}
                          onChange={(e) => cms.updateSettings({ currencySymbol: e.target.value })}
                          className="w-full px-4 py-3 bg-premium-bg border border-premium-divider rounded-xl outline-none focus:border-premium-secondary transition-all font-bold text-premium-primary" 
                          placeholder="e.g. ₦ or €"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted px-1">Currency Code</label>
                        <input 
                          value={cms.currencyCode}
                          onChange={(e) => cms.updateSettings({ currencyCode: e.target.value })}
                          className="w-full px-4 py-3 bg-premium-bg border border-premium-divider rounded-xl outline-none focus:border-premium-secondary transition-all font-bold text-premium-primary" 
                          placeholder="e.g. NGN or EUR"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end border-t border-premium-divider/50">
                    <button onClick={() => {
                      const dataToSave: any = {}
                      // Map store state to backend keys
                      Object.entries(cms).forEach(([key, value]) => {
                        if (typeof value !== 'function') {
                          // Skip navLinks and footerSections as they are handled by layoutApi
                          if (key === 'navLinks' || key === 'footerSections') return
                          
                          if (key === 'paymentLogos') {
                            dataToSave.payment_logos = value
                          } else {
                            dataToSave[key] = value
                          }
                        }
                      })
                      
                      cmsApi.updateSettings(dataToSave).then(() => {
                        showNotify('Settings Saved')
                        refetchSettings()
                      }).catch(() => showNotify('Failed to save settings', 'error'))
                    }} className="bg-premium-primary text-white px-6 py-3 rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-premium-secondary transition-colors shadow-sm">
                      Save Settings
                    </button>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'admins' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {showAdminModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <div className="fixed inset-0 bg-black/40" onClick={() => setShowAdminModal(false)} />
                  <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-premium-divider bg-premium-bg">
                      <h2 className="text-sm font-black uppercase tracking-tight text-premium-primary">Add Administrator</h2>
                      <button onClick={() => setShowAdminModal(false)} className="text-premium-text-muted hover:text-premium-primary"><X size={18} /></button>
                    </div>
                    <div className="px-6 py-6 space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Full Name</label>
                        <input value={adminForm.name} onChange={e => setAdminForm(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary" placeholder="e.g. John Doe" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Email Address</label>
                        <input type="email" value={adminForm.email} onChange={e => setAdminForm(prev => ({ ...prev, email: e.target.value }))} className="w-full px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary" placeholder="admin@urair.com" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Password</label>
                        <input type="password" value={adminForm.password} onChange={e => setAdminForm(prev => ({ ...prev, password: e.target.value }))} className="w-full px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary" placeholder="••••••••" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">System Role</label>
                        <select value={adminForm.role} onChange={e => setAdminForm(prev => ({ ...prev, role: e.target.value }))} className="w-full px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary bg-white">
                          <option value="admin">Full Admin</option>
                          <option value="staff">Staff</option>
                        </select>
                      </div>
                    </div>
                    <div className="px-6 py-4 border-t border-premium-divider flex gap-3 bg-gray-50/50">
                      <button onClick={() => setShowAdminModal(false)} className="flex-1 px-4 py-2.5 border border-premium-divider rounded-md text-[10px] font-black uppercase tracking-widest text-premium-primary hover:bg-premium-bg">Cancel</button>
                      <button onClick={() => {
                        api.post('/users', adminForm).then(() => { refetchAllUsers(); setShowAdminModal(false); setAdminForm({ name: '', email: '', password: '', role: 'admin' }) });
                      }} disabled={!adminForm.email || !adminForm.password} className="flex-1 bg-premium-primary text-white px-4 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-premium-secondary shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">Create Admin</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-black tracking-tighter text-premium-primary uppercase">Admin Users</h1>
                  <p className="text-premium-text-muted text-sm mt-1">Manage system administrators separately from regular customers.</p>
                </div>
                <button onClick={() => setShowAdminModal(true)} className="bg-premium-primary text-white px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest hover:bg-premium-secondary transition-colors flex items-center gap-2 shadow-sm">
                  <Plus size={16} /> Add Administrator
                </button>
              </div>
              <div className="bg-white border border-premium-divider rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-premium-bg border-b border-premium-divider text-premium-text-muted">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Name</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Email</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Role</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Joined</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-premium-divider">
                    {allUsers.map((u: any) => (
                      <tr key={u.id} className="hover:bg-premium-bg transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-premium-secondary/10 text-premium-secondary rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">{u.name?.charAt(0).toUpperCase()}</div>
                            <span className="font-bold text-premium-primary">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-premium-text-muted font-medium">{u.email}</td>
                        <td className="px-6 py-4"><span className="text-[10px] px-2 py-1 rounded font-black uppercase tracking-widest bg-premium-secondary/10 text-premium-secondary">Admin</span></td>
                        <td className="px-6 py-4 text-premium-text-muted font-medium">{new Date(u.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                        <td className="px-6 py-4 text-right"><button onClick={() => setItemToDelete({ id: u.id, type: 'Admin', url: `/users/${u.id}`, name: u.name })} className="text-red-500 hover:text-red-700 font-bold text-xs tracking-wider uppercase">Revoke</button></td>
                      </tr>
                    ))}
                    {allUsers.length === 0 && (
                      <tr><td colSpan={5} className="px-6 py-12 text-center text-premium-text-muted font-medium">No admin users found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'newsletter' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h1 className="text-2xl font-black tracking-tighter text-premium-primary uppercase">Newsletter</h1>
                <p className="text-premium-text-muted text-sm mt-1">Manage your subscriber list and popup configuration.</p>
              </div>
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border border-premium-divider rounded-lg shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-premium-divider flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-premium-primary">Subscribers</h3>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-premium-bg border border-premium-divider/50 px-2 py-1 rounded text-premium-text-muted">{subscribers.length} total</span>
                  </div>
                  <table className="w-full text-left text-sm">
                    <thead className="bg-premium-bg border-b border-premium-divider">
                      <tr>
                        <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Email</th>
                        <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Joined</th>
                        <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-premium-text-muted text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-premium-divider">
                      {subscribers.map((s: any) => (
                        <tr key={s.id} className="hover:bg-premium-bg">
                          <td className="px-6 py-3 font-medium text-premium-primary">{s.email}</td>
                          <td className="px-6 py-3 text-premium-text-muted">{new Date(s.created_at).toLocaleDateString('en-GB')}</td>
                          <td className="px-6 py-3 text-right">
                             <button onClick={() => setItemToDelete({ 
                                type: 'Subscriber', 
                                name: s.email,
                                onConfirm: () => api.delete(`/admin/newsletter-subscribers/${s.id}`).then(() => { refetchSubscribers(); showNotify('Subscriber removed'); setItemToDelete(null); })
                              })} className="text-red-500 hover:text-red-700 font-bold text-xs uppercase">Remove</button>
                          </td>
                        </tr>
                      ))}
                      {subscribers.length === 0 && (
                        <tr><td colSpan={3} className="px-6 py-12 text-center text-premium-text-muted font-medium">No subscribers yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="bg-white border border-premium-divider rounded-lg shadow-sm p-6 space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-premium-primary">Popup Content</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Headline</label>
                      <input type="text" id="newsletter_popup_title" defaultValue={settings.newsletter_popup_title} className="w-full px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Subtitle</label>
                      <textarea id="newsletter_popup_subtitle" defaultValue={settings.newsletter_popup_subtitle} className="w-full px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary h-24" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Image URL</label>
                      <div className="flex gap-2">
                        <input type="text" id="newsletter_popup_image" defaultValue={settings.newsletter_popup_image} className="flex-1 px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary" />
                        <label className="px-4 py-3 bg-premium-secondary text-white rounded-md text-[10px] font-black uppercase tracking-widest cursor-pointer">
                           Upload
                           <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                             const file = e.target.files?.[0];
                             if (file) {
                               const reader = new FileReader();
                               reader.onload = (ev) => {
                                 (document.getElementById('newsletter_popup_image') as HTMLInputElement).value = ev.target?.result as string;
                               };
                               reader.readAsDataURL(file);
                             }
                           }} />
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Button Text</label>
                      <input type="text" id="newsletter_popup_button_text" defaultValue={settings.newsletter_popup_button_text} className="w-full px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary" />
                    </div>
                    <button 
                      onClick={() => {
                        const data = {
                          newsletter_popup_title: (document.getElementById('newsletter_popup_title') as HTMLInputElement).value,
                          newsletter_popup_subtitle: (document.getElementById('newsletter_popup_subtitle') as HTMLTextAreaElement).value,
                          newsletter_popup_image: (document.getElementById('newsletter_popup_image') as HTMLInputElement).value,
                          newsletter_popup_button_text: (document.getElementById('newsletter_popup_button_text') as HTMLInputElement).value,
                        };
                        api.post('/settings', data).then(() => { refetchSettings(); showNotify('Popup settings saved!'); }).catch(err => showNotify(err.response?.data?.message || 'Failed to save newsletter settings', 'error'));
                      }}
                      className="w-full bg-premium-primary text-white py-3 rounded-md text-xs font-black uppercase tracking-widest hover:bg-premium-secondary transition-colors"
                    >
                      Save Configuration
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'campaigns' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-black tracking-tighter text-premium-primary uppercase">Email Campaigns</h1>
                  <p className="text-premium-text-muted text-sm mt-1">Create and send promotional emails to your subscribers.</p>
                </div>
                <button className="bg-premium-primary text-white px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest hover:bg-premium-secondary transition-colors flex items-center gap-2 shadow-sm">
                  <Plus size={16} /> New Campaign
                </button>
              </div>
              <div className="bg-white border border-premium-divider rounded-lg shadow-sm p-12 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-premium-bg border border-premium-divider/50 text-premium-primary rounded-full flex items-center justify-center mb-6"><Mail size={32} /></div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-premium-primary">Email Marketing Engine</h3>
                <p className="text-premium-text-muted text-sm max-w-md mt-3 leading-relaxed font-medium">Connect an SMTP provider in Settings to start creating and sending email campaigns to your subscriber list.</p>
                <button onClick={() => setActiveTab('smtp')} className="mt-6 px-6 py-3 border border-premium-secondary text-premium-secondary rounded-md text-xs font-black uppercase tracking-widest hover:bg-premium-secondary hover:text-white transition-colors">Configure SMTP First</button>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h1 className="text-2xl font-black tracking-tighter text-premium-primary uppercase">Reviews</h1>
                <p className="text-premium-text-muted text-sm mt-1">Moderate product reviews submitted by customers.</p>
              </div>
              <div className="bg-white border border-premium-divider rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-premium-bg border-b border-premium-divider text-premium-text-muted">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Product</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Reviewer</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Rating</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Content</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-premium-divider">
                    {adminReviews.map((r: any) => (
                      <tr key={r.id} className="hover:bg-premium-bg transition-colors">
                        <td className="px-6 py-4 font-bold text-premium-primary text-xs">{r.product?.name || 'Unknown'}</td>
                        <td className="px-6 py-4 text-xs">
                           <p className="font-bold text-premium-primary">{r.author_name}</p>
                           <p className="text-premium-text-muted">{r.author_email || 'No email'}</p>
                        </td>
                        <td className="px-6 py-4 font-bold text-premium-accent">{r.rating}/5</td>
                        <td className="px-6 py-4 max-w-xs text-xs text-premium-text-muted">
                           <p className="font-bold text-premium-primary truncate">{r.title}</p>
                           <p className="truncate">{r.body}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "text-[10px] px-2 py-1 rounded font-black uppercase tracking-widest",
                            r.status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                            r.status === 'rejected' ? 'bg-red-50 text-red-700' :
                            'bg-amber-50 text-amber-700'
                          )}>{r.status}</span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-3">
                           {r.status !== 'approved' && (
                             <button onClick={() => api.put(`/admin/reviews/${r.id}`, { status: 'approved' }).then(() => refetchReviews())} className="text-emerald-600 hover:text-emerald-800 font-bold text-xs tracking-wider uppercase transition-colors">Approve</button>
                           )}
                           {r.status !== 'rejected' && (
                             <button onClick={() => api.put(`/admin/reviews/${r.id}`, { status: 'rejected' }).then(() => refetchReviews())} className="text-red-500 hover:text-red-700 font-bold text-xs tracking-wider uppercase transition-colors">Reject</button>
                           )}
                           <button onClick={() => setItemToDelete({ 
                                type: 'Review', 
                                name: `Review by ${r.author_name}`,
                                onConfirm: () => api.delete(`/admin/reviews/${r.id}`).then(() => { refetchReviews(); showNotify('Review deleted'); setItemToDelete(null); })
                              })} className="text-premium-text-muted hover:text-red-500 font-bold text-xs tracking-wider uppercase transition-colors">Delete</button>
                        </td>
                      </tr>
                    ))}
                    {adminReviews.length === 0 && (
                      <tr><td colSpan={6} className="px-6 py-12 text-center text-premium-text-muted font-medium">No reviews have been submitted yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'identity' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-black tracking-tighter text-premium-primary uppercase">Site Identity & SEO</h1>
                  <p className="text-premium-text-muted text-sm mt-1">Manage global branding, metadata, and security settings.</p>
                </div>
              </div>

              <div className="bg-white border border-premium-divider rounded-2xl shadow-sm p-8 space-y-12">
                <section>
                  <h3 className="text-sm font-black uppercase tracking-widest text-premium-primary mb-6 border-b border-premium-divider pb-2">Branding Assets</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Site Logo</label>
                      <div className="h-32 bg-premium-bg border-2 border-dashed border-premium-divider rounded-xl flex items-center justify-center overflow-hidden group cursor-pointer" onClick={() => logoInputRef.current?.click()}>
                        {settings.site_logo ? (
                           <img src={settings.site_logo} alt="Logo" className="max-h-16 object-contain" />
                        ) : (
                           <div className="text-center text-premium-text-muted group-hover:text-premium-secondary transition-colors">
                             <Upload size={24} className="mx-auto mb-2" />
                             <span className="text-[10px] font-bold uppercase tracking-widest">Upload Logo</span>
                           </div>
                        )}
                        <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'site_logo')} />
                      </div>
                      <p className="text-[9px] text-premium-text-muted uppercase tracking-widest">Recommended: Horizontal PNG/SVG, max 2MB</p>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Favicon</label>
                      <div className="h-32 bg-premium-bg border-2 border-dashed border-premium-divider rounded-xl flex items-center justify-center overflow-hidden group cursor-pointer" onClick={() => faviconInputRef.current?.click()}>
                        {settings.site_favicon ? (
                           <img src={settings.site_favicon} alt="Favicon" className="max-h-16 w-16 object-contain" />
                        ) : (
                           <div className="text-center text-premium-text-muted group-hover:text-premium-secondary transition-colors">
                             <Upload size={24} className="mx-auto mb-2" />
                             <span className="text-[10px] font-bold uppercase tracking-widest">Upload Favicon</span>
                           </div>
                        )}
                        <input type="file" ref={faviconInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'site_favicon')} />
                      </div>
                      <p className="text-[9px] text-premium-text-muted uppercase tracking-widest">Recommended: Square PNG/ICO, 128x128px</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-black uppercase tracking-widest text-premium-primary mb-6 border-b border-premium-divider pb-2">Search Engine Optimization</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">SEO Title</label>
                      <input id="seo_title" defaultValue={settings.seo_title || ''} className="w-full mt-2 px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary" placeholder="e.g. URAIR | Premium Tech Lifestyle" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Meta Description</label>
                      <textarea id="seo_description" defaultValue={settings.seo_description || ''} className="w-full mt-2 px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary h-24 resize-none" placeholder="A brief description of your storefront for search engines..."></textarea>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Keywords</label>
                      <input id="seo_keywords" defaultValue={settings.seo_keywords || ''} className="w-full mt-2 px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary" placeholder="tech, luxury, hardware, lifestyle (comma separated)" />
                    </div>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-6 border-b border-premium-divider pb-2">
                    <ShieldCheck size={20} className="text-premium-secondary" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-premium-primary">Cloudflare Turnstile (Anti-Bot)</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Site Key</label>
                      <input id="turnstile_site_key" defaultValue={settings.turnstile_site_key || ''} className="w-full mt-2 px-4 py-3 bg-premium-bg border border-premium-divider/50 rounded-md text-sm font-mono text-premium-primary outline-none focus:border-premium-secondary" placeholder="0x4A..." />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Secret Key</label>
                      <input id="turnstile_secret_key" type="password" defaultValue={settings.turnstile_secret_key || ''} className="w-full mt-2 px-4 py-3 bg-premium-bg border border-premium-divider/50 rounded-md text-sm font-mono text-premium-primary outline-none focus:border-premium-secondary" placeholder="0x4A..." />
                    </div>
                  </div>
                  <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest mt-4 flex items-center gap-2">
                    <AlertCircle size={14} /> If configured, forms will require bot verification.
                  </p>
                <section>
                  <div className="flex items-center gap-3 mb-6 border-b border-premium-divider pb-2">
                    <MessageSquare size={20} className="text-premium-secondary" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-premium-primary">Live Chat Support</h3>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">WhatsApp Support Number</label>
                    <input id="whatsapp_number" defaultValue={settings.whatsapp_number || ''} className="w-full mt-2 px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary" placeholder="e.g. +2348012345678" />
                    <p className="text-[9px] text-premium-text-muted mt-2 font-medium">Include country code. This will enable the floating WhatsApp widget on the storefront.</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between bg-premium-bg border border-premium-divider/50 rounded-md px-4 py-3">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-premium-primary">Buy on WhatsApp</label>
                      <p className="text-[9px] text-premium-text-muted mt-1 font-medium">Show a green "Buy on WhatsApp" button on product pages</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input id="whatsapp_buy_enabled" type="checkbox" defaultChecked={settings.whatsapp_buy_enabled === '1' || settings.whatsapp_buy_enabled === true} className="sr-only peer" />
                      <div className="w-11 h-6 bg-premium-divider peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#25D366]"></div>
                    </label>
                  </div>
                </section>
              </section>

                <div className="pt-4 flex justify-end">
                  <button onClick={() => {
                    const data = {
                      seo_title: (document.getElementById('seo_title') as HTMLInputElement).value,
                      seo_description: (document.getElementById('seo_description') as HTMLInputElement).value,
                      seo_keywords: (document.getElementById('seo_keywords') as HTMLInputElement).value,
                      turnstile_site_key: (document.getElementById('turnstile_site_key') as HTMLInputElement).value,
                      turnstile_secret_key: (document.getElementById('turnstile_secret_key') as HTMLInputElement).value,
                      whatsapp_number: (document.getElementById('whatsapp_number') as HTMLInputElement).value,
                      whatsapp_buy_enabled: (document.getElementById('whatsapp_buy_enabled') as HTMLInputElement).checked ? '1' : '0',
                    }
                    api.post('/settings', data).then(() => {
                      refetchSettings()
                      showNotify('Identity & SEO configuration saved')
                    })
                  }} className="px-10 py-3 bg-premium-primary text-white rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-premium-secondary shadow-lg transition-all">Save Configuration</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'admin-profile' && (
            <AdminProfileTab user={user} showNotify={showNotify} />
          )}

          {activeTab === 'admin-security' && (
            <AdminSecurityTab showNotify={showNotify} />
          )}

          {activeTab === 'smtp' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-black tracking-tighter text-premium-primary uppercase">SMTP & Notifications</h1>
                  <p className="text-premium-text-muted text-sm mt-1">Configure your email server to send notifications and campaigns.</p>
                </div>
              </div>
              
              <div className="bg-white border border-premium-divider rounded-lg shadow-sm overflow-hidden">
                <div className="px-8 py-8 space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">SMTP Host</label>
                      <input type="text" defaultValue={settings.smtp_host} id="smtp_host" className="w-full px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary" placeholder="smtp.mailtrap.io" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">SMTP Port</label>
                      <input type="text" defaultValue={settings.smtp_port} id="smtp_port" className="w-full px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary" placeholder="587" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Username</label>
                      <input type="text" defaultValue={settings.smtp_username} id="smtp_username" className="w-full px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary" placeholder="User ID" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Password</label>
                      <input type="password" defaultValue={settings.smtp_password} id="smtp_password" className="w-full px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary" placeholder="••••••••" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Encryption</label>
                      <select defaultValue={settings.smtp_encryption || 'tls'} id="smtp_encryption" className="w-full px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary bg-white">
                        <option value="none">None</option>
                        <option value="tls">TLS</option>
                        <option value="ssl">SSL</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">From Email</label>
                      <input type="email" defaultValue={settings.mail_from_address} id="mail_from_address" className="w-full px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary" placeholder="noreply@urair.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">From Name</label>
                      <input type="text" defaultValue={settings.mail_from_name} id="mail_from_name" className="w-full px-4 py-3 border border-premium-divider/50 rounded-md text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary" placeholder="URAIR Store" />
                    </div>
                  </div>
                </div>

                <div className="px-8 py-6 bg-premium-bg border-t border-premium-divider flex items-center justify-between">
                   <button onClick={() => {
                     const data = {
                       smtp_host: (document.getElementById('smtp_host') as HTMLInputElement).value,
                       smtp_port: (document.getElementById('smtp_port') as HTMLInputElement).value,
                       smtp_username: (document.getElementById('smtp_username') as HTMLInputElement).value,
                       smtp_password: (document.getElementById('smtp_password') as HTMLInputElement).value,
                       smtp_encryption: (document.getElementById('smtp_encryption') as HTMLSelectElement).value,
                       mail_from_address: (document.getElementById('mail_from_address') as HTMLInputElement).value,
                       mail_from_name: (document.getElementById('mail_from_name') as HTMLInputElement).value,
                     };
                     api.post('/settings/test-smtp', data)
                      .then(res => showNotify(res.data.message))
                      .catch(err => showNotify(err.response?.data?.message || 'Connection failed', 'error'));
                   }} className="px-6 py-3 border border-premium-secondary text-premium-secondary rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-premium-secondary hover:text-white transition-all">Test Connection</button>
                   
                   <button onClick={() => {
                      const data = {
                       smtp_host: (document.getElementById('smtp_host') as HTMLInputElement).value,
                       smtp_port: (document.getElementById('smtp_port') as HTMLInputElement).value,
                       smtp_username: (document.getElementById('smtp_username') as HTMLInputElement).value,
                       smtp_password: (document.getElementById('smtp_password') as HTMLInputElement).value,
                       smtp_encryption: (document.getElementById('smtp_encryption') as HTMLSelectElement).value,
                       mail_from_address: (document.getElementById('mail_from_address') as HTMLInputElement).value,
                       mail_from_name: (document.getElementById('mail_from_name') as HTMLInputElement).value,
                     };
                     api.post('/settings', data).then(() => { refetchSettings(); showNotify('SMTP settings saved!'); });
                   }} className="px-10 py-3 bg-premium-primary text-white rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-premium-secondary shadow-lg transition-all">Save Changes</button>
                </div>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 flex gap-4">
                 <div className="text-amber-500"><Bell size={24}/></div>
                 <div>
                    <h4 className="text-sm font-bold text-amber-900 uppercase tracking-tight">Security Note</h4>
                    <p className="text-xs text-amber-800 font-medium mt-1 leading-relaxed">Ensure you use App Passwords if your provider (like Gmail or Outlook) has 2FA enabled. For production, we recommend professional services like SendGrid or Postmark.</p>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'emails' && (
            <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h1 className="text-2xl font-black tracking-tighter text-premium-primary uppercase">Email Templates</h1>
                  <p className="text-premium-text-muted text-sm mt-1">Manage transactional email content and subjects.</p>
                </div>
                <button 
                  onClick={() => {
                    const data = {
                      email_registration_subject: (document.getElementById('email_registration_subject') as HTMLInputElement).value,
                      email_registration_body: (document.getElementById('email_registration_body') as HTMLTextAreaElement).value,
                      email_order_confirmed_subject: (document.getElementById('email_order_confirmed_subject') as HTMLInputElement).value,
                      email_order_confirmed_body: (document.getElementById('email_order_confirmed_body') as HTMLTextAreaElement).value,
                      email_order_status_subject: (document.getElementById('email_order_status_subject') as HTMLInputElement).value,
                      email_order_status_body: (document.getElementById('email_order_status_body') as HTMLTextAreaElement).value,
                    };
                    api.post('/settings', data).then(() => { refetchSettings(); showNotify('Templates saved!'); }).catch(() => showNotify('Failed to save templates', 'error'));
                  }}
                  className="px-10 py-3 bg-premium-secondary text-white rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-premium-secondary-hover shadow-lg shadow-premium-secondary/20 transition-all"
                >
                  Save All Templates
                </button>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {/* Registration Template */}
                <div className="bg-white border border-premium-divider rounded-2xl p-8 shadow-sm space-y-6">
                  <h3 className="text-sm font-black text-premium-primary uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 bg-premium-secondary rounded-full" />
                    User Registration Email
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-premium-text-muted uppercase tracking-widest">Subject Line</label>
                      <input id="email_registration_subject" defaultValue={settings.email_registration_subject} className="w-full px-5 py-4 bg-premium-bg border border-premium-divider/50 rounded-xl text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-premium-text-muted uppercase tracking-widest">HTML Body (Variables: {"{{name}}"})</label>
                      <textarea id="email_registration_body" defaultValue={settings.email_registration_body} className="w-full px-5 py-4 bg-premium-bg border border-premium-divider/50 rounded-xl text-sm font-mono text-premium-primary outline-none focus:border-premium-secondary h-48" />
                    </div>
                  </div>
                </div>

                {/* Order Confirmation Template */}
                <div className="bg-white border border-premium-divider rounded-2xl p-8 shadow-sm space-y-6">
                  <h3 className="text-sm font-black text-premium-primary uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 bg-premium-secondary rounded-full" />
                    Order Confirmation Email
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-premium-text-muted uppercase tracking-widest">Subject Line</label>
                      <input id="email_order_confirmed_subject" defaultValue={settings.email_order_confirmed_subject} className="w-full px-5 py-4 bg-premium-bg border border-premium-divider/50 rounded-xl text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-premium-text-muted uppercase tracking-widest">HTML Body (Variables: {"{{name}}, {{order_id}}, {{total}}"})</label>
                      <textarea id="email_order_confirmed_body" defaultValue={settings.email_order_confirmed_body} className="w-full px-5 py-4 bg-premium-bg border border-premium-divider/50 rounded-xl text-sm font-mono text-premium-primary outline-none focus:border-premium-secondary h-48" />
                    </div>
                  </div>
                </div>

                {/* Order Status Update Template */}
                <div className="bg-white border border-premium-divider rounded-2xl p-8 shadow-sm space-y-6">
                  <h3 className="text-sm font-black text-premium-primary uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 bg-premium-secondary rounded-full" />
                    Order Status Update Email
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-premium-text-muted uppercase tracking-widest">Subject Line</label>
                      <input id="email_order_status_subject" defaultValue={settings.email_order_status_subject} className="w-full px-5 py-4 bg-premium-bg border border-premium-divider/50 rounded-xl text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-premium-text-muted uppercase tracking-widest">HTML Body (Variables: {"{{name}}, {{order_id}}, {{status}}"})</label>
                      <textarea id="email_order_status_body" defaultValue={settings.email_order_status_body} className="w-full px-5 py-4 bg-premium-bg border border-premium-divider/50 rounded-xl text-sm font-mono text-premium-primary outline-none focus:border-premium-secondary h-48" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'gateways' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <h1 className="text-2xl font-black tracking-tighter text-premium-primary uppercase">Payment Gateways</h1>
              <p className="text-premium-text-muted text-sm mt-1 mb-8">Configure your payment providers. Toggle 'Active' to display them on the checkout page.</p>

              <div className="grid lg:grid-cols-2 gap-8">
                {paymentGateways.map((gw: any) => (
                  <div key={gw.id} className="bg-white border border-premium-divider rounded-2xl shadow-sm p-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-premium-divider pb-4">
                      <h3 className="text-sm font-black uppercase tracking-widest text-premium-primary">{gw.provider}</h3>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={gw.is_active}
                          onChange={(e) => {
                            api.put(`/payment-gateways/${gw.id}`, { is_active: e.target.checked })
                              .then(() => { refetchGateways(); showNotify(`${gw.provider} status updated`); })
                              .catch(() => showNotify('Failed to update status', 'error'));
                          }}
                          className="w-5 h-5 accent-premium-secondary rounded"
                        />
                        <span className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Active</span>
                      </label>
                    </div>

                    {gw.provider !== 'manual' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Public Key</label>
                          <input
                            id={`pk-${gw.id}`}
                            defaultValue={gw.public_key || ''}
                            className="w-full px-5 py-4 bg-premium-bg border border-premium-divider/50 rounded-xl text-sm font-mono text-premium-primary outline-none focus:border-premium-secondary"
                            placeholder="pk_test_..."
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Secret Key</label>
                          <input
                            id={`sk-${gw.id}`}
                            defaultValue={gw.secret_key || ''}
                            type="password"
                            className="w-full px-5 py-4 bg-premium-bg border border-premium-divider/50 rounded-xl text-sm font-mono text-premium-primary outline-none focus:border-premium-secondary"
                            placeholder="sk_test_..."
                          />
                        </div>
                        <div className="pt-2">
                          <button
                            onClick={() => {
                              const pk = (document.getElementById(`pk-${gw.id}`) as HTMLInputElement).value;
                              const sk = (document.getElementById(`sk-${gw.id}`) as HTMLInputElement).value;
                              api.put(`/payment-gateways/${gw.id}`, { public_key: pk, secret_key: sk })
                                .then(() => { refetchGateways(); showNotify(`${gw.provider} keys saved`); })
                                .catch(() => showNotify('Failed to save keys', 'error'));
                            }}
                            className="w-full px-6 py-4 bg-premium-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-premium-secondary shadow-lg transition-all"
                          >
                            Save API Keys
                          </button>
                        </div>
                      </div>
                    )}
                    {gw.provider === 'manual' && (
                      <div className="py-8 text-center bg-premium-bg border border-premium-divider/50 rounded-xl">
                        <ShieldCheck size={32} className="mx-auto text-premium-text-muted mb-4" />
                        <p className="text-xs font-bold text-premium-text-muted uppercase tracking-widest">No API Keys Required</p>
                        <p className="text-[10px] text-premium-text-muted mt-2">Manual payments (e.g. Cash on Delivery) only require activation.</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tickets' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <h1 className="text-2xl font-black tracking-tighter text-premium-primary uppercase">Support Tickets</h1>
              <p className="text-premium-text-muted text-sm mt-1 mb-8">Manage customer queries and provide high-fidelity support.</p>

              <div className="grid gap-6">
                {tickets.length > 0 ? tickets.map((ticket: any) => (
                  <div key={ticket.id} className="bg-white border border-premium-divider rounded-2xl p-8 flex items-center justify-between shadow-sm hover:border-premium-secondary transition-all">
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${
                          ticket.status === 'open' ? 'bg-blue-50 text-blue-600' :
                          ticket.status === 'answered' ? 'bg-amber-50 text-amber-600' :
                          'bg-green-50 text-green-600'
                        }`}>
                          {ticket.status}
                        </span>
                        <h3 className="text-sm font-black text-premium-primary uppercase tracking-tight">{ticket.subject}</h3>
                      </div>
                      <p className="text-xs text-premium-text-muted">From: <span className="font-bold text-premium-primary uppercase">{ticket.user?.name}</span> • {new Date(ticket.created_at).toLocaleDateString()}</p>
                    </div>
                    <button 
                      onClick={() => {
                        window.location.href = `/admin/tickets/${ticket.id}`
                      }}
                      className="px-6 py-3 border border-premium-divider rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-premium-bg transition-all"
                    >
                      View Conversation
                    </button>
                  </div>
                )) : (
                  <div className="py-20 text-center bg-white border border-premium-divider rounded-2xl">
                    <MessageSquare size={48} className="mx-auto text-premium-divider mb-4" />
                    <p className="text-premium-text-muted font-bold uppercase tracking-widest text-xs">No active tickets</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── NAVIGATION ─── */}
          {activeTab === 'navigation' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-black tracking-tighter text-premium-primary uppercase">Storefront Navigation</h1>
                  <p className="text-premium-text-muted text-sm mt-1">Edit the main header navigation links displayed on your storefront.</p>
                </div>
                <button
                  onClick={() => {
                    const fresh = liveNavItems.map(i => ({ name: i.name, path: i.path }));
                    setNavLinks(fresh.length ? fresh : [{ name: '', path: '/' }]);
                    setShowNavModal(true);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-premium-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-premium-secondary shadow-lg transition-all"
                >
                  <Plus size={14} /> Edit Links
                </button>
              </div>

              {/* Live preview of current nav */}
              <div className="bg-white border border-premium-divider rounded-2xl shadow-sm overflow-hidden">
                <div className="px-8 py-5 border-b border-premium-divider bg-premium-bg flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Current Live Navigation</p>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{liveNavItems.length} links</span>
                </div>
                <div className="px-8 py-6">
                  {liveNavItems.length === 0 ? (
                    <p className="text-sm text-premium-text-muted italic">No navigation items found. Click 'Edit Links' to add some.</p>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {liveNavItems.map((item, idx) => (
                        <div key={idx} className="bg-premium-bg border border-premium-divider/50 rounded-xl px-5 py-3 flex items-center gap-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">{idx + 1}</span>
                          <div>
                            <p className="text-sm font-black text-premium-primary">{item.name}</p>
                            <p className="text-[10px] text-premium-text-muted font-mono">{item.path}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-2xl px-8 py-5">
                <p className="text-xs font-bold text-amber-700">💡 Changes take effect immediately on the live storefront after saving.</p>
              </div>

              {/* ─── FOOTER PREVIEW ─── */}
              <div className="flex justify-between items-center mt-12 pt-12 border-t border-premium-divider">
                <div>
                  <h2 className="text-xl font-black tracking-tighter text-premium-primary uppercase">Footer Navigation</h2>
                  <p className="text-premium-text-muted text-sm mt-1">Manage the columns and links displayed in your website's footer.</p>
                </div>
                <button
                  onClick={() => {
                    setFooterSectionsData(cms.footerSections?.length ? JSON.parse(JSON.stringify(cms.footerSections)) : [
                      { title: 'Ecosystem', links: [] },
                      { title: 'Support', links: [] },
                      { title: 'Vault', links: [] }
                    ]);
                    setShowFooterModal(true);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-premium-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-premium-secondary shadow-lg transition-all"
                >
                  <Plus size={14} /> Edit Footer Links
                </button>
              </div>

              <div className="bg-obsidian border border-mist/20 rounded-2xl shadow-sm p-8 mt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {cms.footerSections?.map((section, sidx) => (
                    <div key={sidx} className="space-y-4">
                      <h4 className="text-white text-[10px] tracking-[0.2em] uppercase font-bold">{section.title}</h4>
                      <ul className="space-y-3">
                        {section.links.map((link, lidx) => (
                          <li key={lidx} className="text-stone text-xs font-light">{link.name}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  {(!cms.footerSections || cms.footerSections.length === 0) && <p className="text-mist italic text-sm">No footer columns configured.</p>}
                </div>
              </div>
            </div>
          )}

          {/* ─── PAGES ─── */}
          {activeTab === 'pages' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-black tracking-tighter text-premium-primary uppercase">Pages & FAQs</h1>
                  <p className="text-premium-text-muted text-sm mt-1">Manage your static content pages.</p>
                </div>
                <button onClick={() => { setEditingPage(null); setPageForm({ title: '', content: '', meta_description: '', is_published: true }); setShowPageModal(true); }} className="flex items-center gap-2 px-6 py-3 bg-premium-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-premium-secondary shadow-lg transition-all">
                  <Plus size={14} /> New Page
                </button>
              </div>
              <div className="bg-white border border-premium-divider rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-premium-bg border-b border-premium-divider">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Title</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Slug</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-premium-text-muted text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-premium-divider">
                    {pages.map((pg: any) => (
                      <tr key={pg.id} className="hover:bg-premium-bg transition-colors">
                        <td className="px-6 py-4 font-bold text-premium-primary">{pg.title}</td>
                        <td className="px-6 py-4 text-xs text-premium-text-muted font-mono">/pages/{pg.slug}</td>
                        <td className="px-6 py-4">
                          <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", pg.is_published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>
                            {pg.is_published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-4">
                          <button onClick={() => { setEditingPage(pg); setPageForm({ title: pg.title, content: pg.content || '', meta_description: pg.meta_description || '', is_published: pg.is_published }); setShowPageModal(true); }} className="text-premium-secondary hover:text-premium-primary font-bold text-xs tracking-wider uppercase transition-colors">Edit</button>
                          <button onClick={() => setItemToDelete({ type: 'Page', name: pg.title, onConfirm: () => api.delete(`/pages/${pg.id}`).then(() => { refetchPages(); showNotify('Page deleted'); setItemToDelete(null); }) })} className="text-red-500 hover:text-red-700 font-bold text-xs tracking-wider uppercase transition-colors">Delete</button>
                        </td>
                      </tr>
                    ))}
                    {pages.length === 0 && <tr><td colSpan={4} className="px-6 py-16 text-center text-premium-text-muted font-medium">No pages created yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── CURATIONS ─── */}
          {activeTab === 'curations' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-black tracking-tighter text-premium-primary uppercase">Curations</h1>
                  <p className="text-premium-text-muted text-sm mt-1">Create handpicked product collections for featured placement.</p>
                </div>
                <button onClick={() => { setEditingCuration(null); setCurationForm({ name: '', description: '', image: '', product_ids: [] }); setShowCurationModal(true); }} className="flex items-center gap-2 px-6 py-3 bg-premium-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-premium-secondary shadow-lg transition-all">
                  <Plus size={14} /> New Curation
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {curations.map((cur: any) => (
                  <div key={cur.id} className="bg-white border border-premium-divider rounded-3xl shadow-sm overflow-hidden group hover:shadow-xl transition-all">
                    {cur.image && <div className="h-48 overflow-hidden"><img src={cur.image} alt={cur.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>}
                    {!cur.image && <div className="h-48 bg-premium-bg flex items-center justify-center"><Sliders size={40} className="text-premium-text-muted/40" /></div>}
                    <div className="p-6">
                      <h3 className="font-black uppercase tracking-tight text-premium-primary">{cur.name}</h3>
                      {cur.description && <p className="text-xs text-premium-text-muted mt-1 leading-relaxed line-clamp-2">{cur.description}</p>}
                      <p className="text-[10px] font-black text-premium-secondary uppercase tracking-widest mt-3">{cur.products?.length || 0} Products</p>
                      <div className="flex gap-3 mt-5 pt-5 border-t border-premium-divider">
                        <button onClick={() => { setEditingCuration(cur); setCurationForm({ name: cur.name, description: cur.description || '', image: cur.image || '', product_ids: (cur.products || []).map((p: any) => p.id) }); setShowCurationModal(true); }} className="flex-1 py-2 text-[10px] font-black uppercase tracking-widest text-premium-secondary border border-premium-divider rounded-xl hover:bg-premium-bg transition-all">Edit</button>
                        <button onClick={() => setItemToDelete({ type: 'Curation', name: cur.name, onConfirm: () => api.delete(`/curations/${cur.id}`).then(() => { refetchCurations(); showNotify('Curation deleted'); setItemToDelete(null); }) })} className="flex-1 py-2 text-[10px] font-black uppercase tracking-widest text-red-500 border border-red-100 rounded-xl hover:bg-red-50 transition-all">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
                {curations.length === 0 && (
                  <div className="col-span-3 bg-white border border-premium-divider rounded-2xl p-16 text-center">
                    <Sliders size={32} className="mx-auto text-premium-text-muted mb-4" />
                    <p className="text-premium-text-muted font-medium text-sm">No curations yet. Create your first handpicked collection.</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Homepage Section Modal */}
      {showHomepageSectionModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowHomepageSectionModal(false)} />
          <div className="relative w-full max-w-4xl bg-white rounded-[30px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-premium-divider">
            <div className="flex items-center justify-between px-10 py-8 border-b border-premium-divider bg-premium-bg">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-premium-primary">
                  {editingSection ? 'Edit Section' : 'Add New Section'}
                </h2>
                <p className="text-xs text-premium-text-muted font-medium mt-1 uppercase tracking-widest">{sectionForm.type.replace('_', ' ')} Configuration</p>
              </div>
              <button onClick={() => setShowHomepageSectionModal(false)} className="w-10 h-10 flex items-center justify-center bg-white border border-premium-divider rounded-full text-premium-text-muted hover:text-premium-primary shadow-sm"><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 space-y-10">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Section Type</label>
                    <select 
                      value={sectionForm.type}
                      onChange={e => setSectionForm(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-5 py-4 bg-premium-bg border border-premium-divider/50 rounded-xl text-sm font-bold text-premium-primary outline-none focus:border-premium-secondary"
                    >
                      <option value="hero">Hero Section</option>
                      <option value="product_grid">Product Grid</option>
                      <option value="banner">Banner</option>
                      <option value="category_grid">Category Grid</option>
                      <option value="brand_carousel">Brand Carousel</option>
                      <option value="testimonials">Testimonials</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Section Title</label>
                    <input 
                      type="text"
                      value={sectionForm.title}
                      onChange={e => setSectionForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-5 py-4 bg-premium-bg border border-premium-divider/50 rounded-xl text-sm font-bold text-premium-primary outline-none focus:border-premium-secondary"
                      placeholder="e.g. Featured Collection"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Sort Order</label>
                    <input 
                      type="number"
                      value={sectionForm.sort_order}
                      onChange={e => setSectionForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) }))}
                      className="w-full px-5 py-4 bg-premium-bg border border-premium-divider/50 rounded-xl text-sm font-bold text-premium-primary outline-none focus:border-premium-secondary"
                    />
                  </div>
                  <div className="flex items-center gap-3 h-[72px]">
                    <input 
                      type="checkbox"
                      checked={sectionForm.is_active}
                      onChange={e => setSectionForm(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="w-5 h-5 accent-premium-secondary rounded"
                    />
                    <label className="text-[10px] font-black uppercase tracking-widest text-premium-primary">Active on Storefront</label>
                  </div>
                </div>
              </div>

              {/* Type Specific Fields */}
              <div className="pt-10 border-t border-premium-divider">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-premium-secondary mb-6">Content Configuration</h4>
                
                {sectionForm.type === 'brand_carousel' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-premium-text-muted font-medium italic">Add brand logo images for the scrolling carousel. Use image URLs or upload files.</p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            const brands = (sectionForm.content as any).brands || [];
                            setSectionForm(prev => ({ ...prev, content: { ...prev.content, brands: [...brands, ''] } }));
                          }}
                          className="text-[10px] font-black uppercase tracking-widest text-premium-secondary hover:text-premium-primary"
                        >
                          + Add Logo URL
                        </button>
                        <label className="text-[10px] font-black uppercase tracking-widest text-premium-secondary hover:text-premium-primary cursor-pointer">
                          + Upload Logo
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                const brands = (sectionForm.content as any).brands || [];
                                setSectionForm(prev => ({ ...prev, content: { ...prev.content, brands: [...brands, ev.target?.result as string] } }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }} />
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {((sectionForm.content as any).brands || []).map((brand: string, idx: number) => (
                        <div key={idx} className="relative bg-premium-bg border border-premium-divider rounded-2xl p-4 space-y-3 group">
                          <button
                            onClick={() => {
                              const brands = [...(sectionForm.content as any).brands];
                              brands.splice(idx, 1);
                              setSectionForm(prev => ({ ...prev, content: { ...prev.content, brands } }));
                            }}
                            className="absolute top-3 right-3 text-red-400 hover:text-red-600 transition-colors"
                          >
                            <X size={14} />
                          </button>
                          {brand && brand.startsWith('data:') ? (
                            <img src={brand} alt="logo" className="h-12 object-contain mx-auto" />
                          ) : brand ? (
                            <img src={brand} alt="logo" className="h-12 object-contain mx-auto" onError={(e) => (e.currentTarget.style.display = 'none')} />
                          ) : null}
                          <input
                            value={brand}
                            onChange={e => {
                              const brands = [...(sectionForm.content as any).brands];
                              brands[idx] = e.target.value;
                              setSectionForm(prev => ({ ...prev, content: { ...prev.content, brands } }));
                            }}
                            placeholder="https://... or upload above"
                            className="w-full px-3 py-2 border border-premium-divider/50 rounded-lg text-[10px] font-mono text-premium-primary outline-none focus:border-premium-secondary"
                          />
                        </div>
                      ))}
                      {(!(sectionForm.content as any).brands || (sectionForm.content as any).brands.length === 0) && (
                        <div className="col-span-3 py-12 text-center text-premium-text-muted">
                          <p className="text-sm font-medium">No logos added yet. Click '+ Add Logo URL' or '+ Upload Logo' above.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {sectionForm.type === 'hero' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-premium-text-muted font-medium italic">Configure animated slides for the hero section.</p>
                      <button
                        onClick={() => {
                          const slides = (sectionForm.content as any).slides || [];
                          setSectionForm(prev => ({ ...prev, content: { ...prev.content, slides: [...slides, { layout: 'split', headline: 'New Slide', titleSize: 'text-5xl', subtitle: '', image: '', bg_color: '#f2f0f1' }] } }));
                        }}
                        className="text-[10px] font-black uppercase tracking-widest text-premium-secondary hover:text-premium-primary border border-premium-secondary px-4 py-2 rounded-xl"
                      >
                        + Add Slide
                      </button>
                    </div>

                    <div className="space-y-8">
                      {((sectionForm.content as any).slides || []).map((slide: any, idx: number) => (
                        <div key={idx} className="p-6 border border-premium-divider rounded-2xl space-y-6 bg-white relative">
                          <div className="absolute top-4 right-4 flex gap-2">
                             <button onClick={() => {
                               const slides = [...(sectionForm.content as any).slides];
                               slides.splice(idx, 1);
                               setSectionForm(prev => ({ ...prev, content: { ...prev.content, slides } }));
                             }} className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                               <X size={14} />
                             </button>
                          </div>
                          
                          <div className="flex items-center gap-4">
                             <span className="w-8 h-8 rounded-full bg-premium-bg flex items-center justify-center text-xs font-black text-premium-primary">{idx + 1}</span>
                             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-premium-primary">Slide Configuration</h4>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                               <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Layout Mode</label>
                                 <select 
                                   value={slide.layout || 'split'}
                                   onChange={e => {
                                     const slides = [...(sectionForm.content as any).slides];
                                     slides[idx] = { ...slides[idx], layout: e.target.value };
                                     setSectionForm(prev => ({ ...prev, content: { ...prev.content, slides } }));
                                   }}
                                   className="w-full px-4 py-3 bg-premium-bg border border-premium-divider/50 rounded-xl text-xs font-bold outline-none"
                                 >
                                    <option value="split">Split (Text Left, Image Right)</option>
                                    <option value="full">Full Image (Text Overlay)</option>
                                 </select>
                               </div>

                               <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Headline</label>
                                 <input 
                                   value={slide.headline || ''}
                                   onChange={e => {
                                     const slides = [...(sectionForm.content as any).slides];
                                     slides[idx] = { ...slides[idx], headline: e.target.value };
                                     setSectionForm(prev => ({ ...prev, content: { ...prev.content, slides } }));
                                   }}
                                   className="w-full px-4 py-3 bg-premium-bg border border-premium-divider/50 rounded-xl text-xs font-bold outline-none"
                                   placeholder="Slide Headline"
                                 />
                               </div>
                               
                               <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Headline Size (Tailwind Class)</label>
                                 <input 
                                   value={slide.titleSize || 'text-5xl'}
                                   onChange={e => {
                                     const slides = [...(sectionForm.content as any).slides];
                                     slides[idx] = { ...slides[idx], titleSize: e.target.value };
                                     setSectionForm(prev => ({ ...prev, content: { ...prev.content, slides } }));
                                   }}
                                   className="w-full px-4 py-3 bg-premium-bg border border-premium-divider/50 rounded-xl text-xs font-bold outline-none"
                                   placeholder="e.g. text-5xl, text-7xl, text-[100px]"
                                 />
                               </div>

                               <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Subtitle</label>
                                 <textarea 
                                   value={slide.subtitle || ''}
                                   onChange={e => {
                                     const slides = [...(sectionForm.content as any).slides];
                                     slides[idx] = { ...slides[idx], subtitle: e.target.value };
                                     setSectionForm(prev => ({ ...prev, content: { ...prev.content, slides } }));
                                   }}
                                   className="w-full px-4 py-3 bg-premium-bg border border-premium-divider/50 rounded-xl text-xs font-bold outline-none min-h-[80px]"
                                   placeholder="Slide description..."
                                 />
                               </div>
                            </div>
                            <div className="space-y-4">
                               <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Background/Overlay Color</label>
                                 <div className="flex gap-4 items-center">
                                   <input 
                                     type="color"
                                     value={slide.bg_color || '#f2f0f1'}
                                     onChange={e => {
                                       const slides = [...(sectionForm.content as any).slides];
                                       slides[idx] = { ...slides[idx], bg_color: e.target.value };
                                       setSectionForm(prev => ({ ...prev, content: { ...prev.content, slides } }));
                                     }}
                                     className="w-10 h-10 border border-premium-divider rounded-lg cursor-pointer"
                                   />
                                   <input 
                                     type="text"
                                     value={slide.bg_color || '#f2f0f1'}
                                     onChange={e => {
                                       const slides = [...(sectionForm.content as any).slides];
                                       slides[idx] = { ...slides[idx], bg_color: e.target.value };
                                       setSectionForm(prev => ({ ...prev, content: { ...prev.content, slides } }));
                                     }}
                                     className="flex-1 px-4 py-2 bg-premium-bg border border-premium-divider/50 rounded-md text-xs font-bold"
                                   />
                                 </div>
                               </div>

                               <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Image</label>
                                 <div className="flex gap-2">
                                   <input 
                                     type="text"
                                     value={slide.image || ''}
                                     onChange={e => {
                                       const slides = [...(sectionForm.content as any).slides];
                                       slides[idx] = { ...slides[idx], image: e.target.value };
                                       setSectionForm(prev => ({ ...prev, content: { ...prev.content, slides } }));
                                     }}
                                     className="flex-1 px-4 py-3 bg-premium-bg border border-premium-divider/50 rounded-xl text-xs font-bold outline-none"
                                     placeholder="Image URL"
                                   />
                                   <label className="px-4 py-3 bg-premium-secondary text-white rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:opacity-90 flex items-center justify-center">
                                     Upload
                                     <input 
                                       type="file" 
                                       accept="image/*" 
                                       className="hidden" 
                                       onChange={(e) => {
                                         const file = e.target.files?.[0];
                                         if (file) {
                                           const reader = new FileReader();
                                           reader.onload = (ev) => {
                                             const slides = [...(sectionForm.content as any).slides];
                                             slides[idx] = { ...slides[idx], image: ev.target?.result as string };
                                             setSectionForm(prev => ({ ...prev, content: { ...prev.content, slides } }));
                                           };
                                           reader.readAsDataURL(file);
                                         }
                                       }}
                                     />
                                   </label>
                                 </div>
                               </div>

                               <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Slide Duration (Seconds)</label>
                                 <input 
                                   type="number"
                                   min="1"
                                   step="1"
                                   value={slide.duration || 6}
                                   onChange={e => {
                                     const slides = [...(sectionForm.content as any).slides];
                                     slides[idx] = { ...slides[idx], duration: Number(e.target.value) };
                                     setSectionForm(prev => ({ ...prev, content: { ...prev.content, slides } }));
                                   }}
                                   className="w-full px-4 py-3 bg-premium-bg border border-premium-divider/50 rounded-xl text-xs font-bold outline-none"
                                   placeholder="6"
                                 />
                               </div>


                               {slide.image && (
                                 <div className="h-32 bg-premium-bg rounded-xl overflow-hidden border border-premium-divider">
                                   <img src={slide.image} alt="preview" className="w-full h-full object-cover" />
                                 </div>
                               )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {(!(sectionForm.content as any).slides || (sectionForm.content as any).slides.length === 0) && (
                        <div className="py-12 text-center border-2 border-dashed border-premium-divider rounded-2xl bg-premium-bg">
                           <p className="text-sm font-black text-premium-text-muted uppercase tracking-widest">No slides configured</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {(sectionForm.type === 'product_grid' || sectionForm.type === 'category_grid') && (
                  <div className="space-y-6">
                    <div className="space-y-4 p-6 bg-premium-bg rounded-2xl border border-premium-divider/50">
                      <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Display Mode</label>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => setSectionForm(prev => ({ ...prev, content: { ...prev.content, selection_mode: 'manual' } }))}
                          className={cn(
                            "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all",
                            (sectionForm.content as any).selection_mode !== 'category' ? "bg-premium-primary text-white border-premium-primary shadow-lg" : "bg-white text-premium-primary border-premium-divider"
                          )}
                        >Manual Selection</button>
                        <button 
                          onClick={() => setSectionForm(prev => ({ ...prev, content: { ...prev.content, selection_mode: 'category' } }))}
                          className={cn(
                            "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all",
                            (sectionForm.content as any).selection_mode === 'category' ? "bg-premium-primary text-white border-premium-primary shadow-lg" : "bg-white text-premium-primary border-premium-divider"
                          )}
                        >By Category</button>
                      </div>
                      
                      {(sectionForm.content as any).selection_mode === 'category' && (
                        <div className="space-y-2 mt-4 animate-in fade-in slide-in-from-top-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Select Category</label>
                          <select 
                            value={(sectionForm.content as any).category_id || ''}
                            onChange={e => setSectionForm(prev => ({ ...prev, content: { ...prev.content, category_id: e.target.value } }))}
                            className="w-full px-5 py-4 bg-white border border-premium-divider/50 rounded-xl text-sm font-bold text-premium-primary outline-none focus:border-premium-secondary"
                          >
                            <option value="">— Select Category —</option>
                            {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        </div>
                      )}
                    </div>

                    {(sectionForm.content as any).selection_mode !== 'category' && (
                      <>
                        <div className="flex items-center justify-between">
                           <p className="text-xs text-premium-text-muted font-medium italic">Link {sectionForm.type === 'product_grid' ? 'products' : 'categories'} to display in this grid.</p>
                           <button 
                             onClick={() => {
                               if (sectionForm.type === 'product_grid') {
                                 setPromptConfig({
                                   title: 'Link Product',
                                   placeholder: 'Enter Product ID',
                                   onConfirm: (id) => {
                                     const pid = parseInt(id);
                                     if (!isNaN(pid) && !sectionForm.items.find((i: any) => i.product_id === pid)) {
                                       setSectionForm(prev => ({ ...prev, items: [...prev.items, { product_id: pid }] as any }));
                                     }
                                   }
                                 })
                               } else {
                                  // For category grid manual
                                  setSectionForm(prev => ({ ...prev, items: [...prev.items, { title: 'New Category', subtitle: '', image: '', text_color: '#000000' }] as any }));
                               }
                             }}
                             className="text-[10px] font-black uppercase tracking-widest text-premium-secondary hover:text-premium-primary"
                           >
                             + Add Item
                           </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {sectionForm.items.map((item: any, idx: number) => {
                            const product = realProducts.find((p: any) => p.id === item.product_id);
                            return (
                              <div key={idx} className="bg-premium-bg border border-premium-divider rounded-2xl p-6 space-y-4 shadow-sm group relative">
                                <button 
                                   onClick={() => {
                                     const newItems = [...sectionForm.items];
                                     newItems.splice(idx, 1);
                                     setSectionForm(prev => ({ ...prev, items: newItems }));
                                   }}
                                   className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors"
                                 >
                                   <X size={16} />
                                 </button>

                                {sectionForm.type === 'product_grid' ? (
                                  <span className="text-xs font-black text-premium-primary">{product?.name || `Product #${item.product_id}`}</span>
                                ) : (
                                  <div className="space-y-4">
                                     <div className="space-y-2">
                                       <label className="text-[8px] font-black uppercase tracking-[0.2em] text-premium-text-muted">Display Text</label>
                                       <input 
                                         value={item.title || ''} 
                                         onChange={e => {
                                           const newItems = [...sectionForm.items];
                                           newItems[idx].title = e.target.value;
                                           setSectionForm(prev => ({ ...prev, items: newItems }));
                                         }}
                                         className="w-full px-4 py-2 border border-premium-divider/50 rounded-lg text-xs font-bold text-premium-primary outline-none focus:border-premium-secondary"
                                       />
                                     </div>
                                     <div className="grid grid-cols-2 gap-4">
                                       <div className="space-y-2">
                                         <label className="text-[8px] font-black uppercase tracking-[0.2em] text-premium-text-muted">Text Color</label>
                                         <div className="flex gap-2 items-center">
                                            <input type="color" value={item.text_color || '#000000'} onChange={e => {
                                              const newItems = [...sectionForm.items];
                                              newItems[idx].text_color = e.target.value;
                                              setSectionForm(prev => ({ ...prev, items: newItems }));
                                            }} className="w-8 h-8 rounded-full border-none p-0 overflow-hidden" />
                                            <input value={item.text_color || '#000000'} onChange={e => {
                                              const newItems = [...sectionForm.items];
                                              newItems[idx].text_color = e.target.value;
                                              setSectionForm(prev => ({ ...prev, items: newItems }));
                                            }} className="flex-1 text-[10px] font-bold outline-none" />
                                         </div>
                                       </div>
                                       <div className="space-y-2">
                                          <label className="text-[8px] font-black uppercase tracking-[0.2em] text-premium-text-muted">Image URL</label>
                                          <input 
                                            value={item.image || ''} 
                                            onChange={e => {
                                              const newItems = [...sectionForm.items];
                                              newItems[idx].image = e.target.value;
                                              setSectionForm(prev => ({ ...prev, items: newItems }));
                                            }}
                                            className="w-full px-4 py-2 border border-premium-divider/50 rounded-lg text-xs font-bold text-premium-primary outline-none focus:border-premium-secondary"
                                          />
                                       </div>
                                     </div>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {sectionForm.type === 'banner' && (
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Promotion Text (Headline)</label>
                        <input 
                          type="text"
                          value={sectionForm.subtitle}
                          onChange={e => setSectionForm(prev => ({ ...prev, subtitle: e.target.value }))}
                          className="w-full px-5 py-4 bg-premium-bg border border-premium-divider/50 rounded-xl text-sm font-bold text-premium-primary outline-none focus:border-premium-secondary"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Background Image URL</label>
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            value={(sectionForm.content as any)?.bg_image || ''}
                            onChange={e => setSectionForm(prev => ({ ...prev, content: { ...prev.content, bg_image: e.target.value } }))}
                            className="flex-1 px-5 py-4 bg-premium-bg border border-premium-divider/50 rounded-xl text-sm font-bold text-premium-primary outline-none focus:border-premium-secondary"
                            placeholder="https://..."
                          />
                          <label className="px-6 py-4 bg-premium-secondary text-white rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:opacity-90 transition-opacity">
                            Upload
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                    setSectionForm(prev => ({ ...prev, content: { ...prev.content, bg_image: ev.target?.result as string } }));
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Background Color</label>
                        <div className="flex gap-4 items-center">
                          <input 
                            type="color"
                            value={(sectionForm.content as any)?.bg_color || '#ffffff'}
                            onChange={e => setSectionForm(prev => ({ ...prev, content: { ...prev.content, bg_color: e.target.value } }))}
                            className="w-12 h-12 border border-premium-divider rounded-lg overflow-hidden cursor-pointer"
                          />
                          <input 
                            type="text"
                            value={(sectionForm.content as any)?.bg_color || '#ffffff'}
                            onChange={e => setSectionForm(prev => ({ ...prev, content: { ...prev.content, bg_color: e.target.value } }))}
                            className="flex-1 px-4 py-2 bg-premium-bg border border-premium-divider/50 rounded-md text-xs font-bold text-premium-primary outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {sectionForm.type === 'testimonials' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <p className="text-xs text-premium-text-muted font-medium italic">Manage customer feedback and success stories.</p>
                       <button 
                         onClick={() => {
                           const testimonials = (sectionForm.content as any).testimonials || [];
                           setSectionForm(prev => ({ ...prev, content: { ...prev.content, testimonials: [...testimonials, { author: 'New Customer', role: '', quote: '', image: '' }] } }));
                         }}
                         className="text-[10px] font-black uppercase tracking-widest text-premium-secondary hover:text-premium-primary"
                       >
                         + Add Testimonial
                       </button>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      {((sectionForm.content as any).testimonials || []).map((t: any, idx: number) => (
                        <div key={idx} className="bg-premium-bg border border-premium-divider rounded-3xl p-8 space-y-6 shadow-sm relative animate-in fade-in zoom-in-95">
                           <button 
                             onClick={() => {
                               const testimonials = [...(sectionForm.content as any).testimonials];
                               testimonials.splice(idx, 1);
                               setSectionForm(prev => ({ ...prev, content: { ...prev.content, testimonials } }));
                             }}
                             className="absolute top-6 right-6 text-red-500 hover:text-red-700 transition-colors"
                           >
                             <X size={20} />
                           </button>
                           
                           <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                 <div className="space-y-2">
                                   <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Author Name</label>
                                   <input value={t.author} onChange={e => {
                                     const testimonials = [...(sectionForm.content as any).testimonials];
                                     testimonials[idx].author = e.target.value;
                                     setSectionForm(prev => ({ ...prev, content: { ...prev.content, testimonials } }));
                                   }} className="w-full px-5 py-4 bg-white border border-premium-divider/50 rounded-xl text-sm font-bold text-premium-primary outline-none focus:border-premium-secondary" />
                                 </div>
                                 <div className="space-y-2">
                                   <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Author Role / Company</label>
                                   <input value={t.role} onChange={e => {
                                     const testimonials = [...(sectionForm.content as any).testimonials];
                                     testimonials[idx].role = e.target.value;
                                     setSectionForm(prev => ({ ...prev, content: { ...prev.content, testimonials } }));
                                   }} className="w-full px-5 py-4 bg-white border border-premium-divider/50 rounded-xl text-sm font-bold text-premium-primary outline-none focus:border-premium-secondary" />
                                 </div>
                              </div>
                              <div className="space-y-4">
                                 <div className="space-y-2">
                                   <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Author Image URL</label>
                                   <input value={t.image} onChange={e => {
                                     const testimonials = [...(sectionForm.content as any).testimonials];
                                     testimonials[idx].image = e.target.value;
                                     setSectionForm(prev => ({ ...prev, content: { ...prev.content, testimonials } }));
                                   }} className="w-full px-5 py-4 bg-white border border-premium-divider/50 rounded-xl text-sm font-bold text-premium-primary outline-none focus:border-premium-secondary" />
                                 </div>
                                 <div className="space-y-2">
                                   <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Quote / Feedback</label>
                                   <textarea value={t.quote} onChange={e => {
                                     const testimonials = [...(sectionForm.content as any).testimonials];
                                     testimonials[idx].quote = e.target.value;
                                     setSectionForm(prev => ({ ...prev, content: { ...prev.content, testimonials } }));
                                   }} className="w-full px-5 py-4 bg-white border border-premium-divider/50 rounded-xl text-sm font-bold text-premium-primary outline-none focus:border-premium-secondary h-20" />
                                 </div>
                              </div>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="px-10 py-8 bg-premium-bg border-t border-premium-divider flex items-center justify-end gap-4">
              <button 
                onClick={() => setShowHomepageSectionModal(false)}
                className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-premium-text-muted hover:text-premium-primary transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  try {
                    if (editingSection) {
                      await api.put(`/homepage/sections/${editingSection.id}`, sectionForm);
                    } else {
                      await api.post('/homepage/sections', sectionForm);
                    }
                    refetchSections();
                    setShowHomepageSectionModal(false);
                    showNotify('Layout updated successfully');
                  } catch (err: any) {
                    showNotify(err.response?.data?.message || 'Failed to save section. Image might be too large.', 'error');
                  }
                }}
                className="px-12 py-4 bg-premium-primary text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-premium-secondary shadow-xl transition-all"
              >
                {editingSection ? 'Update Layout' : 'Publish Section'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={cn(
              "fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 border",
              notification.type === 'error' ? "bg-red-50 border-red-100 text-red-600" : "bg-obsidian border-mist/20 text-white"
            )}
          >
            {notification.type === 'error' ? <AlertCircle size={18} /> : <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />}
            <span className="text-[10px] font-black uppercase tracking-widest">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Item Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setItemToDelete(null)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-premium-divider"
          >
            <div className="p-10 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-premium-primary">Delete {itemToDelete.type}?</h3>
              <p className="text-xs text-premium-text-muted mt-3 leading-relaxed font-medium">Are you sure you want to remove <span className="text-premium-primary font-bold">{itemToDelete.name}</span>? This action cannot be undone.</p>
            </div>
            <div className="flex border-t border-premium-divider">
              <button 
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-6 text-[10px] font-black uppercase tracking-widest text-premium-text-muted hover:bg-premium-bg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={itemToDelete.onConfirm}
                className="flex-1 py-6 text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors border-l border-premium-divider"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Input Prompt Modal */}
      {promptConfig && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPromptConfig(null)} />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-premium-divider p-10"
          >
            <h3 className="text-lg font-black uppercase tracking-tight text-premium-primary mb-6">{promptConfig.title}</h3>
            <input 
              autoFocus
              id="promptInput"
              type="text"
              placeholder={promptConfig.placeholder}
              className="w-full px-5 py-4 bg-premium-bg border border-premium-divider/50 rounded-xl text-sm font-bold text-premium-primary outline-none focus:border-premium-secondary mb-8"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  promptConfig.onConfirm((e.target as HTMLInputElement).value);
                  setPromptConfig(null);
                }
              }}
            />
            <div className="flex gap-4">
              <button 
                onClick={() => setPromptConfig(null)}
                className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-premium-text-muted hover:bg-premium-bg transition-colors rounded-xl border border-premium-divider"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  const val = (document.getElementById('promptInput') as HTMLInputElement).value;
                  promptConfig.onConfirm(val);
                  setPromptConfig(null);
                }}
                className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-white bg-premium-primary hover:bg-premium-secondary transition-colors rounded-xl shadow-lg"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ─── FOOTER MODAL ─── */}
      {showFooterModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowFooterModal(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-4xl bg-white rounded-[30px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-premium-divider">
            <div className="flex items-center justify-between px-10 py-7 border-b border-premium-divider bg-premium-bg">
              <h2 className="text-xl font-black uppercase tracking-tight text-premium-primary">Edit Footer Columns & Links</h2>
              <button onClick={() => setShowFooterModal(false)} className="w-10 h-10 flex items-center justify-center bg-white border border-premium-divider rounded-full text-premium-text-muted hover:text-premium-primary"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-premium-bg/50">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Footer Columns</label>
                <button onClick={() => setFooterSectionsData(p => [...p, { title: 'New Column', links: [] }])} className="text-[10px] font-black uppercase tracking-widest text-premium-secondary hover:text-premium-primary">+ Add Column</button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {footerSectionsData.map((section, sidx) => (
                  <div key={sidx} className="bg-white border border-premium-divider rounded-2xl p-6 shadow-sm relative">
                    <button onClick={() => { const cols = [...footerSectionsData]; cols.splice(sidx, 1); setFooterSectionsData(cols); }} className="absolute top-6 right-6 text-red-400 hover:text-red-600 transition-colors"><X size={16} /></button>
                    <div className="space-y-4">
                      <div className="space-y-1 pr-8">
                        <label className="text-[9px] font-black uppercase tracking-widest text-premium-text-muted">Column Title</label>
                        <input value={section.title} onChange={e => { const cols = [...footerSectionsData]; cols[sidx].title = e.target.value; setFooterSectionsData(cols); }} className="w-full px-4 py-2 border border-premium-divider/50 rounded-lg text-sm font-bold text-premium-primary outline-none focus:border-premium-secondary" placeholder="e.g. ECOSYSTEM" />
                      </div>
                      
                      <div className="pt-4 border-t border-premium-divider/50 space-y-3">
                        <div className="flex items-center justify-between">
                           <label className="text-[9px] font-black uppercase tracking-widest text-premium-text-muted">Links in Column</label>
                           <button onClick={() => { const cols = [...footerSectionsData]; cols[sidx].links.push({ name: '', path: '/' }); setFooterSectionsData(cols); }} className="text-[9px] font-black uppercase tracking-widest text-premium-secondary hover:text-premium-primary">+ Add Link</button>
                        </div>
                        {section.links.map((link, lidx) => (
                          <div key={lidx} className="flex gap-2 items-center bg-premium-bg p-3 rounded-xl border border-premium-divider/50">
                             <div className="flex-1 space-y-2">
                               <input value={link.name} onChange={e => { const cols = [...footerSectionsData]; cols[sidx].links[lidx].name = e.target.value; setFooterSectionsData(cols); }} className="w-full px-3 py-1.5 border border-premium-divider/50 rounded bg-white text-xs font-bold text-premium-primary outline-none" placeholder="Name (e.g. About URAIR)" />
                               <input value={link.path} onChange={e => { const cols = [...footerSectionsData]; cols[sidx].links[lidx].path = e.target.value; setFooterSectionsData(cols); }} className="w-full px-3 py-1.5 border border-premium-divider/50 rounded bg-white text-xs text-premium-text-muted outline-none font-mono" placeholder="Path (e.g. /p/about)" />
                             </div>
                             <button onClick={() => { const cols = [...footerSectionsData]; cols[sidx].links.splice(lidx, 1); setFooterSectionsData(cols); }} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><X size={14} /></button>
                          </div>
                        ))}
                        {section.links.length === 0 && <p className="text-[10px] text-premium-text-muted italic">No links added.</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-10 py-6 bg-premium-bg border-t border-premium-divider flex justify-end gap-4">
              <button onClick={() => setShowFooterModal(false)} className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-premium-text-muted hover:text-premium-primary">Cancel</button>
              <button onClick={() => {
                cmsApi.updateSettings({ ...cms, footerSections: footerSectionsData })
                  .then(() => {
                     cms.updateSettings({ footerSections: footerSectionsData });
                     setShowFooterModal(false);
                     showNotify('Footer links saved successfully!');
                  })
                  .catch(() => showNotify('Failed to save footer links.', 'error'))
              }} className="px-12 py-4 bg-premium-primary text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-premium-secondary shadow-xl transition-all">
                Save Footer
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ─── NAVIGATION MODAL ─── */}
      {showNavModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowNavModal(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-2xl bg-white rounded-[30px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-premium-divider">
            <div className="flex items-center justify-between px-10 py-7 border-b border-premium-divider bg-premium-bg">
              <h2 className="text-xl font-black uppercase tracking-tight text-premium-primary">Edit Navigation Links</h2>
              <button onClick={() => setShowNavModal(false)} className="w-10 h-10 flex items-center justify-center bg-white border border-premium-divider rounded-full text-premium-text-muted hover:text-premium-primary"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-10 space-y-6">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Menu Items</label>
                <button onClick={() => setNavLinks(p => [...p, { name: '', path: '/' }])} className="text-[10px] font-black uppercase tracking-widest text-premium-secondary hover:text-premium-primary">+ Add Link</button>
              </div>
              <div className="space-y-4">
                {navLinks.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="flex-1 grid grid-cols-2 gap-4 bg-premium-bg border border-premium-divider/50 rounded-2xl p-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-premium-text-muted">Link Name</label>
                        <input value={item.name} onChange={e => { const links = [...navLinks]; links[idx].name = e.target.value; setNavLinks(links); }} className="w-full px-4 py-3 border border-premium-divider/50 rounded-xl text-sm font-bold text-premium-primary outline-none focus:border-premium-secondary" placeholder="e.g. SHOP" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-premium-text-muted">URL Path</label>
                        <input value={item.path} onChange={e => { const links = [...navLinks]; links[idx].path = e.target.value; setNavLinks(links); }} className="w-full px-4 py-3 border border-premium-divider/50 rounded-xl text-sm font-bold text-premium-primary outline-none focus:border-premium-secondary" placeholder="e.g. /shop" />
                      </div>
                    </div>
                    <button onClick={() => { const links = [...navLinks]; links.splice(idx, 1); setNavLinks(links); }} className="mt-6 p-3 text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"><X size={16} /></button>
                  </div>
                ))}
                {navLinks.length === 0 && <p className="text-xs text-premium-text-muted font-medium italic text-center py-8">No links yet. Click '+ Add Link' above.</p>}
              </div>
            </div>
            <div className="px-10 py-6 bg-premium-bg border-t border-premium-divider flex justify-end gap-4">
              <button onClick={() => setShowNavModal(false)} className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-premium-text-muted hover:text-premium-primary">Cancel</button>
              <button onClick={async () => {
                try {
                  await api.post('/layout/navigation', navLinks);
                  refetchNavigations(); setShowNavModal(false); showNotify('Navigation updated successfully!');
                } catch { showNotify('Failed to save navigation.', 'error'); }
              }} className="px-12 py-4 bg-premium-primary text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-premium-secondary shadow-xl transition-all">
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ─── PAGE MODAL ─── */}
      {showPageModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPageModal(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-4xl bg-white rounded-[30px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-premium-divider">
            <div className="flex items-center justify-between px-10 py-7 border-b border-premium-divider bg-premium-bg">
              <h2 className="text-xl font-black uppercase tracking-tight text-premium-primary">{editingPage ? 'Edit Page' : 'New Page'}</h2>
              <button onClick={() => setShowPageModal(false)} className="w-10 h-10 flex items-center justify-center bg-white border border-premium-divider rounded-full text-premium-text-muted hover:text-premium-primary"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-10 space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Page Title</label>
                  <input value={pageForm.title} onChange={e => setPageForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. About Us" className="w-full px-5 py-4 bg-premium-bg border border-premium-divider/50 rounded-xl text-sm font-bold text-premium-primary outline-none focus:border-premium-secondary" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Meta Description (SEO)</label>
                  <input value={pageForm.meta_description} onChange={e => setPageForm(p => ({ ...p, meta_description: e.target.value }))} placeholder="Short description for search engines..." className="w-full px-5 py-4 bg-premium-bg border border-premium-divider/50 rounded-xl text-sm font-bold text-premium-primary outline-none focus:border-premium-secondary" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Page Content (HTML or Plain Text)</label>
                <textarea value={pageForm.content} onChange={e => setPageForm(p => ({ ...p, content: e.target.value }))} rows={14} placeholder="Write your page content here. You can use HTML tags for formatting." className="w-full px-5 py-4 bg-premium-bg border border-premium-divider/50 rounded-xl text-sm font-medium text-premium-primary outline-none focus:border-premium-secondary font-mono leading-relaxed" />
              </div>
              <div className="flex items-center gap-4 p-5 bg-premium-bg rounded-2xl border border-premium-divider/50">
                <input type="checkbox" id="pagePublished" checked={pageForm.is_published} onChange={e => setPageForm(p => ({ ...p, is_published: e.target.checked }))} className="w-5 h-5 accent-premium-secondary rounded" />
                <label htmlFor="pagePublished" className="text-sm font-bold text-premium-primary cursor-pointer">Publish immediately <span className="text-premium-text-muted font-medium text-xs">(uncheck to save as draft)</span></label>
              </div>
            </div>
            <div className="px-10 py-6 bg-premium-bg border-t border-premium-divider flex justify-end gap-4">
              <button onClick={() => setShowPageModal(false)} className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-premium-text-muted hover:text-premium-primary">Cancel</button>
              <button onClick={async () => {
                try {
                  if (editingPage) {
                    await api.put(`/pages/${editingPage.id}`, pageForm);
                  } else {
                    await api.post('/pages', pageForm);
                  }
                  refetchPages(); setShowPageModal(false); showNotify('Page saved!');
                } catch { showNotify('Failed to save page.', 'error'); }
              }} className="px-12 py-4 bg-premium-primary text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-premium-secondary shadow-xl transition-all">
                {editingPage ? 'Update Page' : 'Publish Page'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ─── CURATION MODAL ─── */}
      {showCurationModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCurationModal(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-3xl bg-white rounded-[30px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-premium-divider">
            <div className="flex items-center justify-between px-10 py-7 border-b border-premium-divider bg-premium-bg">
              <h2 className="text-xl font-black uppercase tracking-tight text-premium-primary">{editingCuration ? 'Edit Curation' : 'New Curation'}</h2>
              <button onClick={() => setShowCurationModal(false)} className="w-10 h-10 flex items-center justify-center bg-white border border-premium-divider rounded-full text-premium-text-muted hover:text-premium-primary"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-10 space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Curation Name</label>
                  <input value={curationForm.name} onChange={e => setCurationForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Summer Essentials" className="w-full px-5 py-4 bg-premium-bg border border-premium-divider/50 rounded-xl text-sm font-bold text-premium-primary outline-none focus:border-premium-secondary" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Description</label>
                  <input value={curationForm.description} onChange={e => setCurationForm(p => ({ ...p, description: e.target.value }))} placeholder="Short description..." className="w-full px-5 py-4 bg-premium-bg border border-premium-divider/50 rounded-xl text-sm font-bold text-premium-primary outline-none focus:border-premium-secondary" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Cover Image URL</label>
                <div className="flex gap-2">
                  <input value={curationForm.image} onChange={e => setCurationForm(p => ({ ...p, image: e.target.value }))} placeholder="https://..." className="flex-1 px-5 py-4 bg-premium-bg border border-premium-divider/50 rounded-xl text-sm font-bold text-premium-primary outline-none focus:border-premium-secondary" />
                  <label className="px-6 py-4 bg-premium-secondary text-white rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:opacity-90 transition-opacity">
                    Upload
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) { const reader = new FileReader(); reader.onload = (ev) => setCurationForm(p => ({ ...p, image: ev.target?.result as string })); reader.readAsDataURL(file); }
                    }} />
                  </label>
                </div>
                {curationForm.image && <img src={curationForm.image} alt="Preview" className="h-32 w-full object-cover rounded-2xl mt-2 border border-premium-divider" />}
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted">Products in this Curation</label>
                  <button onClick={() => setPromptConfig({ title: 'Add Product', placeholder: 'Enter Product ID', onConfirm: (id) => { const pid = parseInt(id); if (!isNaN(pid) && !curationForm.product_ids.includes(pid)) setCurationForm(p => ({ ...p, product_ids: [...p.product_ids, pid] })); } })} className="text-[10px] font-black uppercase tracking-widest text-premium-secondary hover:text-premium-primary">+ Add Product</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {curationForm.product_ids.map((pid, idx) => {
                    const product = realProducts.find((p: any) => p.id === pid);
                    return (
                      <div key={idx} className="flex items-center gap-3 bg-premium-bg border border-premium-divider rounded-xl px-4 py-2">
                        <span className="text-xs font-black text-premium-primary">{product?.name || `Product #${pid}`}</span>
                        <button onClick={() => setCurationForm(p => ({ ...p, product_ids: p.product_ids.filter((_, i) => i !== idx) }))} className="text-red-400 hover:text-red-600"><X size={12} /></button>
                      </div>
                    );
                  })}
                  {curationForm.product_ids.length === 0 && <p className="text-xs text-premium-text-muted italic">No products added yet.</p>}
                </div>
              </div>
            </div>
            <div className="px-10 py-6 bg-premium-bg border-t border-premium-divider flex justify-end gap-4">
              <button onClick={() => setShowCurationModal(false)} className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-premium-text-muted hover:text-premium-primary">Cancel</button>
              <button onClick={async () => {
                try {
                  if (editingCuration) {
                    await api.put(`/curations/${editingCuration.id}`, curationForm);
                  } else {
                    await api.post('/curations', curationForm);
                  }
                  refetchCurations(); setShowCurationModal(false); showNotify('Curation saved!');
                } catch { showNotify('Failed to save curation.', 'error'); }
              }} className="px-12 py-4 bg-premium-primary text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-premium-secondary shadow-xl transition-all">
                {editingCuration ? 'Update Curation' : 'Create Curation'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Image Cropping Modal */}
      <AnimatePresence>
        {croppingImage && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[85vh] max-h-[900px] border border-premium-divider"
            >
              <div className="px-8 py-6 border-b border-premium-divider flex justify-between items-center bg-white z-10">
                <div>
                   <h3 className="text-xl font-black uppercase tracking-tight text-premium-primary">Adjust {croppingTarget?.replace('site_', '')}</h3>
                   <p className="text-[10px] text-premium-text-muted font-bold uppercase tracking-widest mt-1">Freeform adjustment for optimal branding</p>
                </div>
                <button onClick={() => setCroppingImage(null)} className="p-2 text-premium-text-muted hover:text-premium-primary hover:bg-premium-bg rounded-full transition-all"><X size={24} /></button>
              </div>

              <div className="flex-1 relative bg-[#111] overflow-hidden min-h-[300px]">
                <Cropper
                  image={croppingImage}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={croppingTarget === 'site_favicon' ? 1 : undefined}
                  onCropChange={setCrop}
                  onRotationChange={setRotation}
                  onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
                  onZoomChange={setZoom}
                  classes={{
                    containerClassName: 'cropper-container',
                    mediaClassName: 'cropper-media',
                    cropAreaClassName: 'cropper-area',
                  }}
                />
              </div>

              <div className="px-8 py-6 border-t border-premium-divider bg-white flex flex-col gap-6 z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6 w-full md:w-auto flex-1 max-w-xs">
                    <span className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted whitespace-nowrap">Zoom</span>
                    <input 
                      type="range" 
                      min={1} 
                      max={3} 
                      step={0.1} 
                      value={zoom} 
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="flex-1 accent-premium-secondary h-1 bg-premium-divider rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center gap-6 w-full md:w-auto flex-1 max-w-xs">
                    <span className="text-[10px] font-black uppercase tracking-widest text-premium-text-muted whitespace-nowrap">Rotate</span>
                    <input 
                      type="range" 
                      min={0} 
                      max={360} 
                      step={1} 
                      value={rotation} 
                      onChange={(e) => setRotation(Number(e.target.value))}
                      className="flex-1 accent-premium-secondary h-1 bg-premium-divider rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                    <button onClick={() => setCroppingImage(null)} className="flex-1 md:flex-none px-8 py-3 border border-premium-divider rounded-xl text-[10px] font-black uppercase tracking-widest text-premium-primary hover:bg-premium-bg transition-all">Cancel</button>
                    <button 
                      onClick={handleCropComplete}
                      disabled={isCropping}
                      className="flex-1 md:flex-none px-10 py-3 bg-premium-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-premium-secondary transition-all shadow-xl shadow-premium-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isCropping ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                      Apply & Save
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

