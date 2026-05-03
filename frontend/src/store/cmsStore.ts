import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface NavLink {
  name: string
  path: string
}

interface CMSState {
  systemName: string
  announcementText: string
  showAnnouncement: boolean

  // Identity & SEO
  site_logo?: string
  site_favicon?: string
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
  turnstile_site_key?: string,
  whatsapp_number?: string,
  
  // Footer Logos
  paymentLogos: { id: string; name: string; image: string; active: boolean }[]
  
  // Hero Section
  heroTitle: string
  heroSubtitle: string
  stats: { value: string; label: string }[]
  
  // Design Tokens
  primaryColor: string
  secondaryColor: string
  accentColor: string
  baseFontSize: number
  headingFont: 'Playfair Display' | 'Inter' | 'Roboto' | 'Outfit'
  bodyFont: 'Inter' | 'Roboto' | 'Outfit'
  
  // Currency
  currencySymbol: string
  currencyCode: string
  
  // Navigation
  navLinks: NavLink[]
  footerSections: {
    title: string
    links: NavLink[]
  }[]
  
  // Newsletter
  newsletterTitle: string
  newsletterPlaceholder: string
  newsletterButtonText: string
  
  // Actions
  updateSettings: (settings: Partial<CMSState>) => void
  resetSettings: () => void
}

const DEFAULT_SETTINGS: Partial<CMSState> = {
  systemName: 'URAIR',
  announcementText: 'Sign up and get 20% off to your first order.',
  showAnnouncement: true,
  heroTitle: 'Find Clothes That Matches Your Style',
  heroSubtitle: 'Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.',
  newsletterTitle: 'STAY UP TO DATE ABOUT OUR LATEST OFFERS',
  newsletterPlaceholder: 'Enter your email address',
  newsletterButtonText: 'Subscribe to Newsletter',
  stats: [
    { value: '200+', label: 'International Brands' },
    { value: '2,000+', label: 'High-Quality Products' },
    { value: '30,000+', label: 'Happy Customers' },
  ],
  primaryColor: '#1A1A1A',
  secondaryColor: '#A67C52',
  accentColor: '#D2B48C',
  baseFontSize: 16,
  headingFont: 'Playfair Display',
  bodyFont: 'Inter',
  navLinks: [
    { name: 'Home', path: '/' },
    { name: 'COLLECTIONS', path: '/shop' },
    { name: 'CURATIONS', path: '/curations' },
    { name: 'STORY', path: '/about' },
  ],
  footerSections: [
    {
      title: 'Company',
      links: [
        { name: 'About', path: '/about' },
        { name: 'Features', path: '/features' },
        { name: 'Works', path: '/works' },
        { name: 'Career', path: '/career' },
      ],
    },
    {
      title: 'Help',
      links: [
        { name: 'Customer Support', path: '/support' },
        { name: 'Delivery Details', path: '/delivery' },
        { name: 'Terms & Conditions', path: '/terms' },
        { name: 'Privacy Policy', path: '/privacy' },
      ],
    },
  ],
  paymentLogos: [],
  currencySymbol: '₦',
  currencyCode: 'NGN'
}

export const useCMSStore = create<CMSState>((set) => ({
  ...DEFAULT_SETTINGS,
  updateSettings: (settings: any) => set((state) => {
    let paymentLogos = settings.paymentLogos || state.paymentLogos || []
    if (typeof settings.payment_logos === 'string') {
      try {
        paymentLogos = JSON.parse(settings.payment_logos)
      } catch (e) {
        console.error('Failed to parse paymentLogos', e)
      }
    } else if (settings.paymentLogos) {
      paymentLogos = settings.paymentLogos
    }

    return { 
      ...state, 
      ...settings,
      paymentLogos,
      navLinks: settings.navLinks || state.navLinks || [],
      footerSections: settings.footerSections || state.footerSections || []
    }
  }),
  resetSettings: () => set(DEFAULT_SETTINGS as CMSState),
} as CMSState))
