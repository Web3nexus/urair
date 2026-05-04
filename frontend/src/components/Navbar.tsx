import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, User, ShoppingBag, Heart, Menu, X, Home, Grid, Bell, LogOut, Settings as SettingsIcon, Shield, MessageSquare } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useUIStore } from '@/store/uiStore'
import { useCMSStore } from '@/store/cmsStore'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/utils/cn'
import api from '@/api/client'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const { totalItems } = useCartStore()
  const { isMobileMenuOpen, openMobileMenu, closeMobileMenu, openSearch } = useUIStore()
  const { systemName, navLinks, showAnnouncement, announcementText, site_logo } = useCMSStore()
  const { isAuthenticated, isAdmin, user, logout } = useAuthStore()
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (isAuthenticated) {
      const fetchNotifications = async () => {
        try {
          const [notifsRes, countRes] = await Promise.all([
            api.get('/notifications'),
            api.get('/notifications/unread-count')
          ])
          setNotifications(notifsRes.data)
          setUnreadCount(countRes.data.count)
        } catch (error) {
          console.error('Failed to fetch notifications:', error)
        }
      }
      fetchNotifications()
      const interval = setInterval(fetchNotifications, 30000) // Poll every 30s
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  const markAsRead = async (id: string) => {
    try {
      await api.post(`/notifications/${id}/read`)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date() } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <AnimatePresence>
        {showAnnouncement && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-obsidian text-white py-2.5 text-center text-[10px] tracking-[0.3em] uppercase font-bold relative z-[60]"
          >
            {announcementText}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Navigation */}
      <nav
        className={cn(
          'hidden lg:block fixed left-0 right-0 z-50 transition-all duration-700',
          isScrolled
            ? 'top-4 mx-12 bg-white/90 backdrop-blur-2xl py-4 px-8 border border-premium-divider/30 shadow-2xl rounded-[30px]'
            : cn('bg-transparent py-8 border-transparent', showAnnouncement ? 'top-10' : 'top-0')
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Mobile Menu Toggle - Hidden as we use Bottom Nav */}
          <div className="lg:hidden w-8" />

          {/* Logo */}
          <Link to="/" className="text-3xl font-['Poppins'] tracking-[-0.05em] uppercase text-premium-primary group font-black flex items-center">
            {site_logo ? (
              <img src={site_logo} alt={systemName} className="h-6 lg:h-8 object-contain" />
            ) : (
              <>UR<span className="text-premium-secondary">AIR</span></>
            )}
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'text-[10px] tracking-[0.4em] uppercase transition-all duration-300 relative py-2 font-black font-[\'Poppins\']',
                  location.pathname === link.path 
                    ? 'text-premium-secondary' 
                    : 'text-premium-primary hover:text-premium-secondary'
                )}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div 
                    layoutId="navUnderline" 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-premium-secondary rounded-full" 
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Icons - Simplified on Mobile */}
          <div className="flex items-center gap-4 lg:gap-8">
            <button
              onClick={openSearch}
              className="text-premium-primary hover:text-premium-secondary transition-all hover:scale-110"
              aria-label="Search"
            >
              <Search size={20} strokeWidth={2} />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-premium-primary hover:text-premium-secondary transition-all hover:scale-110 relative"
                aria-label="Notifications"
              >
                <Bell size={20} strokeWidth={2} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-premium-secondary rounded-full border border-white" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-6 w-80 bg-white border border-premium-divider shadow-2xl rounded-2xl overflow-hidden z-[60]"
                  >
                    <div className="px-6 py-4 border-b border-premium-divider flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-premium-primary">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-[8px] bg-premium-bg px-2 py-0.5 rounded-full text-premium-secondary font-black">{unreadCount} NEW</span>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            onClick={() => {
                              if (!notif.read_at) markAsRead(notif.id);
                              if (notif.data.action_url) window.location.href = notif.data.action_url;
                            }}
                            className={cn(
                              "px-6 py-4 hover:bg-premium-bg cursor-pointer border-b border-premium-divider transition-colors relative",
                              !notif.read_at && "bg-premium-secondary/5"
                            )}
                          >
                            {!notif.read_at && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1 bg-premium-secondary rounded-full" />}
                            <p className="text-xs font-bold text-premium-primary">{notif.data.title}</p>
                            <p className="text-[10px] text-premium-text-muted mt-1 leading-relaxed">{notif.data.message}</p>
                            <p className="text-[8px] text-stone mt-2 uppercase font-bold">{new Date(notif.created_at).toLocaleDateString()}</p>
                          </div>
                        ))
                      ) : (
                        <div className="px-6 py-12 text-center">
                          <Bell size={24} className="mx-auto mb-3 text-premium-divider" />
                          <p className="text-[10px] text-premium-text-muted font-bold uppercase tracking-widest">No notifications yet</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile / Account */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => isAuthenticated ? setShowProfileDropdown(!showProfileDropdown) : window.location.href='/login'}
                className="text-premium-primary hover:text-premium-secondary transition-all hover:scale-110 flex items-center gap-2"
                aria-label="Account"
              >
                <User size={20} strokeWidth={2} />
                {isAuthenticated && user && (
                  <span className="text-[10px] font-black uppercase tracking-widest hidden xl:block">{user.name.split(' ')[0]}</span>
                )}
              </button>

              <AnimatePresence>
                {isAuthenticated && showProfileDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-6 w-64 bg-white border border-premium-divider shadow-2xl rounded-2xl overflow-hidden z-[60]"
                  >
                    <div className="px-6 py-6 border-b border-premium-divider bg-premium-bg">
                      <p className="text-[10px] font-black uppercase tracking-widest text-premium-secondary mb-1">{isAdmin ? 'Administrator' : 'Client Profile'}</p>
                      <p className="text-sm font-black text-premium-primary truncate">{user?.name}</p>
                      <p className="text-[10px] text-premium-text-muted truncate font-medium">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <Link 
                        to={isAdmin ? "/securegate?tab=settings" : "/account?tab=Profile+Settings"} 
                        onClick={() => setShowProfileDropdown(false)} 
                        className="flex items-center gap-3 px-4 py-3 hover:bg-premium-bg rounded-xl transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-premium-bg border border-premium-divider flex items-center justify-center text-premium-primary group-hover:bg-premium-primary group-hover:text-white transition-all">
                          <User size={16} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-premium-primary">Profile</span>
                      </Link>
                      
                      <Link to="/account/security" onClick={() => setShowProfileDropdown(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-premium-bg rounded-xl transition-all group">
                        <div className="w-8 h-8 rounded-lg bg-premium-bg border border-premium-divider flex items-center justify-center text-premium-primary group-hover:bg-premium-primary group-hover:text-white transition-all">
                          <Shield size={16} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-premium-primary">Security & 2FA</span>
                      </Link>

                      {!isAdmin && (
                        <Link to="/support" onClick={() => setShowProfileDropdown(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-premium-bg rounded-xl transition-all group">
                          <div className="w-8 h-8 rounded-lg bg-premium-bg border border-premium-divider flex items-center justify-center text-premium-primary group-hover:bg-premium-primary group-hover:text-white transition-all">
                            <MessageSquare size={16} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-premium-primary">Contact Support</span>
                        </Link>
                      )}

                      <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-xl transition-all group mt-2 border-t border-premium-divider pt-4">
                        <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                          <LogOut size={16} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/cart"
              className="hidden lg:block text-premium-primary hover:text-premium-secondary transition-all relative hover:scale-110"
              aria-label="Cart"
            >
              <ShoppingBag size={20} strokeWidth={2} />
              <AnimatePresence>
                {totalItems() > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 bg-premium-secondary text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-lg"
                  >
                    {totalItems()}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </div>
      </nav>
      {/* Mobile Top Header */}
      <div className={cn(
        "lg:hidden fixed left-0 right-0 z-50 px-6 py-4 transition-all duration-500",
        isScrolled ? "top-2" : (showAnnouncement ? "top-12" : "top-0")
      )}>
        <div className="bg-white/80 backdrop-blur-2xl border border-premium-divider/30 rounded-full px-6 py-3 flex items-center justify-between shadow-lg">
          <Link to="/" className="text-xl font-['Poppins'] tracking-tighter uppercase text-premium-primary font-black">
             {site_logo ? <img src={site_logo} alt={systemName} className="h-5 object-contain" /> : <>UR<span className="text-premium-secondary">AIR</span></>}
          </Link>
          <div className="flex items-center gap-4">
            <button onClick={openSearch} className="text-premium-primary">
              <Search size={20} />
            </button>
            <button onClick={() => setShowNotifications(!showNotifications)} className="text-premium-primary relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-premium-secondary rounded-full" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 bg-obsidian/40 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-premium-bg z-[70] p-12 flex flex-col"
            >
              <div className="flex items-center justify-between mb-20">
                <span className="text-2xl font-['Poppins'] tracking-[-0.05em] uppercase text-premium-primary font-black flex items-center">
                  {site_logo ? (
                    <img src={site_logo} alt={systemName} className="h-6 object-contain" />
                  ) : (
                    <>UR<span className="text-premium-secondary">AIR</span></>
                  )}
                </span>
                <button onClick={closeMobileMenu} className="text-premium-primary hover:text-premium-secondary transition-colors">
                  <X size={32} strokeWidth={1} />
                </button>
              </div>

              <div className="flex flex-col gap-10">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={closeMobileMenu}
                    className={cn(
                      'text-3xl tracking-tighter uppercase transition-all font-black font-[\'Poppins\']',
                      location.pathname === link.path ? 'text-premium-secondary' : 'text-premium-primary hover:text-premium-secondary'
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="h-px bg-premium-divider/30 my-6" />
                <Link
                  to="/account"
                  onClick={closeMobileMenu}
                  className="text-xs tracking-[0.4em] uppercase text-premium-text-muted hover:text-premium-primary flex items-center gap-6 font-black"
                >
                  <User size={20} strokeWidth={2} /> Membership
                </Link>
                <Link
                  to="/wishlist"
                  onClick={closeMobileMenu}
                  className="text-xs tracking-[0.4em] uppercase text-premium-text-muted hover:text-premium-primary flex items-center gap-6 font-black"
                >
                  <Heart size={20} strokeWidth={2} /> Collections
                </Link>
              </div>

              <div className="mt-auto pt-12 border-t border-premium-divider/30">
                <p className="text-premium-text-muted text-[10px] tracking-[0.5em] uppercase font-bold mb-8">Exclusive Access</p>
                <div className="flex gap-8">
                  {['INSTAGRAM', 'TIKTOK', 'TWITTER'].map((s) => (
                    <span key={s} className="text-[10px] text-premium-primary hover:text-premium-secondary cursor-pointer uppercase tracking-widest font-black transition-colors">
                      {s.slice(0, 2)}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] px-6 pb-8 pointer-events-none">
        <div className="bg-white/80 backdrop-blur-2xl border border-premium-divider/30 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-4 flex items-center justify-around pointer-events-auto">
          <Link 
            to="/" 
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              location.pathname === '/' ? "text-premium-secondary" : "text-premium-text-muted"
            )}
          >
            <Home size={22} strokeWidth={location.pathname === '/' ? 2.5 : 2} />
            <span className="text-[8px] font-black uppercase tracking-widest">Home</span>
          </Link>
          
          <Link 
            to="/shop" 
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              location.pathname === '/shop' ? "text-premium-secondary" : "text-premium-text-muted"
            )}
          >
            <Grid size={22} strokeWidth={location.pathname === '/shop' ? 2.5 : 2} />
            <span className="text-[8px] font-black uppercase tracking-widest">Shop</span>
          </Link>

          <Link 
            to="/cart" 
            className={cn(
              "flex flex-col items-center gap-1 transition-all relative",
              location.pathname === '/cart' ? "text-premium-secondary" : "text-premium-text-muted"
            )}
          >
            <ShoppingBag size={22} strokeWidth={location.pathname === '/cart' ? 2.5 : 2} />
            {totalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-premium-secondary text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                {totalItems()}
              </span>
            )}
            <span className="text-[8px] font-black uppercase tracking-widest">Cart</span>
          </Link>

          <Link 
            to={isAuthenticated ? "/account" : "/login"} 
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              location.pathname.startsWith('/account') || location.pathname === '/login' ? "text-premium-secondary" : "text-premium-text-muted"
            )}
          >
            <User size={22} strokeWidth={location.pathname.startsWith('/account') || location.pathname === '/login' ? 2.5 : 2} />
            <span className="text-[8px] font-black uppercase tracking-widest">Profile</span>
          </Link>
        </div>
      </div>

    </>
  )
}
