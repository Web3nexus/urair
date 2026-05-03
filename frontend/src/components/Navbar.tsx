import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, User, ShoppingBag, Heart, Menu, X, Home, Grid } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useUIStore } from '@/store/uiStore'
import { useCMSStore } from '@/store/cmsStore'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/utils/cn'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const { totalItems } = useCartStore()
  const { isMobileMenuOpen, openMobileMenu, closeMobileMenu, openSearch } = useUIStore()
  const { systemName, navLinks, showAnnouncement, announcementText, site_logo } = useCMSStore()
  const { isAuthenticated, isAdmin } = useAuthStore()

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
            <Link
              to={isAuthenticated ? "/account" : "/login"}
              className="hidden lg:block text-premium-primary hover:text-premium-secondary transition-all hover:scale-110"
              aria-label="Account"
            >
              <User size={20} strokeWidth={2} />
            </Link>
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
          <button onClick={openSearch} className="text-premium-primary">
            <Search size={20} />
          </button>
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
