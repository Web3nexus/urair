import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import NewsletterPopup from '@/components/NewsletterPopup'
import WhatsAppWidget from '@/components/WhatsAppWidget'
import { useCMSStore } from '@/store/cmsStore'
import { cmsApi } from '@/api/cms'
import { layoutApi } from '@/api/layout'
import { cn } from '@/utils/cn'

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

const pageTransition = {
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1] as any,
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function RootLayout() {
  const location = useLocation()
  const cms = useCMSStore()

  useEffect(() => {
    // Fetch initial settings
    cmsApi.get().then(cms.updateSettings)
    // Fetch layout
    layoutApi.get().then(data => {
      cms.updateSettings({
        navLinks: data.navigation,
        footerSections: data.footer
      })
    })
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--color-obsidian', cms.primaryColor)
    root.style.setProperty('--color-gold', cms.accentColor)
    root.style.setProperty('font-size', `${cms.baseFontSize}px`)
    root.style.setProperty('--font-serif', `"${cms.headingFont}", serif`)
    root.style.setProperty('--font-sans', `"${cms.bodyFont}", sans-serif`)

    // Identity & SEO Injection
    if (cms.seo_title) document.title = cms.seo_title;
    
    if (cms.seo_description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', cms.seo_description);
    }

    if (cms.seo_keywords) {
      let metaKw = document.querySelector('meta[name="keywords"]');
      if (!metaKw) {
        metaKw = document.createElement('meta');
        metaKw.setAttribute('name', 'keywords');
        document.head.appendChild(metaKw);
      }
      metaKw.setAttribute('content', cms.seo_keywords);
    }

    if (cms.site_favicon) {
      let linkIcon: HTMLLinkElement | null = document.querySelector('link[rel="icon"]');
      if (!linkIcon) {
        linkIcon = document.createElement('link');
        linkIcon.setAttribute('rel', 'icon');
        document.head.appendChild(linkIcon);
      }
      linkIcon.setAttribute('href', cms.site_favicon);
    }
  }, [cms])

  return (
    <div className="flex flex-col min-h-screen bg-white text-obsidian font-sans selection:bg-gold/30 selection:text-obsidian">
      <ScrollToTop />

      
      {/* Always show Navbar on user routes (it handles its own mobile/desktop visibility), except on dashboard routes */}
      {!location.pathname.startsWith('/securegate') && !location.pathname.startsWith('/account') && !location.pathname.startsWith('/wishlist') && <Navbar />}
      
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className={cn(
              "min-h-screen transition-colors duration-1000",
              location.pathname !== '/' && "premium-theme"
            )}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {!location.pathname.startsWith('/account') && (
        <>
          <Footer />
          <NewsletterPopup />
          <WhatsAppWidget />
        </>
      )}
    </div>
  )
}

