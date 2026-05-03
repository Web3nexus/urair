import { Link } from 'react-router-dom'

import { useCMSStore } from '@/store/cmsStore'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const cms = useCMSStore()
  const { systemName, footerSections, site_logo } = cms

  return (
    <footer className="bg-pearl pt-40">
      <div className="bg-obsidian py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-12 mb-20">
            <div className="col-span-2 space-y-8">
              <Link to="/" className="text-3xl font-serif tracking-[0.25em] uppercase text-white font-black flex items-center">
                {site_logo ? (
                  <img src={site_logo} alt={systemName} className="h-8 object-contain filter invert" />
                ) : (
                  systemName
                )}
              </Link>
              <p className="text-stone text-sm font-light max-w-xs leading-relaxed">
                We have clothes that suits your style and which you're proud to wear. From women to men.
              </p>
              <div className="flex gap-4">
                {[
                  { label: 'TW', icon: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                  { label: 'FB', icon: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
                  { label: 'IG', icon: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
                  { label: 'GH', icon: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg> }
                ].map((s) => (
                  <div key={s.label} className="w-10 h-10 rounded-full border border-mist/30 flex items-center justify-center text-white hover:bg-white hover:text-obsidian transition-all cursor-pointer">
                    <s.icon />
                  </div>
                ))}
              </div>
            </div>

            {footerSections.map((section) => (
              <div key={section.title} className="space-y-6">
                <h4 className="text-white text-xs tracking-[0.2em] uppercase font-bold">
                  {section.title}
                </h4>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="text-stone hover:text-white text-sm font-light transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-mist/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-stone text-xs font-light">
              {systemName} © 2000-{currentYear}, All Rights Reserved
            </p>
            <div className="flex flex-wrap gap-6 items-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
               {cms.paymentLogos && cms.paymentLogos.length > 0 ? (
                 cms.paymentLogos.filter(l => l.active).map(logo => (
                   <img 
                     key={logo.id} 
                     src={logo.image} 
                     alt={logo.name} 
                     title={logo.name}
                     className="h-5 w-auto object-contain" 
                   />
                 ))
               ) : (
                 <>
                   {/* Fallback to hardcoded logos if none uploaded */}
                   {/* Paystack */}
                   <svg viewBox="0 0 512 512" className="h-5 w-auto fill-current text-white"><path d="M225.8 288c-12.7 0-25-5.1-33.9-14.1l-60.6-60.6c-18.7-18.7-18.7-49.1 0-67.9l60.6-60.6c9-9 21.2-14.1 33.9-14.1h211.7c8.8 0 16 7.2 16 16v95.3c0 8.8-7.2 16-16 16H225.8z" opacity=".5"/><path d="M225.8 441.3c-12.7 0-25-5.1-33.9-14.1l-60.6-60.6c-18.7-18.7-18.7-49.1 0-67.9l60.6-60.6c9-9 21.2-14.1 33.9-14.1h211.7c8.8 0 16 7.2 16 16v95.3c0 8.8-7.2 16-16 16H225.8z"/></svg>

                   {/* Flutterwave */}
                   <svg viewBox="0 0 1000 1000" className="h-4 w-auto fill-current text-white"><path d="M381 216h238l-119 206L381 216z"/><path d="M666 422h238L785 628l-119-206z"/><path d="M96 422h238l119 206L96 422z"/><path d="M381 628h238L500 834 381 628z" opacity=".5"/></svg>

                   {/* Visa */}
                   <svg viewBox="0 0 38 12" className="h-3.5 w-auto fill-current text-white"><path d="M14.65 0l-1.39 8.21h2.24L16.89 0h-2.24zm8.68 8.04c-.03-2.02 1.94-3.13 3.32-3.8.19-.09.38-.18.57-.27-1.12-.55-2.58-.59-3.41-.6-1.95-.03-3.95 1.05-3.95 3.12 0 1.54 1.34 2.37 2.5 2.94 1.18.57 1.58.94 1.58 1.45 0 .78-1 .15-1.93.36-1.12.24-1.98.54-2.48.78.58 1.45 2.11 2.32 3.86 2.32 2.14 0 4.14-1.05 4.15-3.23 0-1.2-.82-2-2.38-2.75l-.33-.16c-.95-.45-1.53-.76-1.53-1.22 0-.44.5-.89 1.44-.89.81 0 1.43.17 1.95.39l.29.13.35-2.18c-.46-.22-1.32-.42-2.35-.43zm7.04-1.36h-1.74c-.45 0-.79.13-1 .59l-3.32 7.82h2.36s.39-1.07.48-1.31h2.89c.07.31.28 1.31.28 1.31h2.08l-2.03-8.41zm-1.87 5.15c.13-.37.64-1.77.64-1.77.03-.1.06-.18.1-.28l.34 1.63h-1.08zm-15.01.69l.11-.53c.66-3.17 1.25-5.91 1.25-5.91h-2.31L8.71 8.21h2.35s.26-1.25.32-1.56h.03c.53 1.09 1.47 1.56 2.08 1.56z"/></svg>

                   {/* Mastercard */}
                   <svg viewBox="0 0 38 24" className="h-4 w-auto text-white"><path d="M12 12A12 12 0 1 0 24 12A12 12 0 1 0 12 12Z" fill="currentColor" opacity="0.6"/><path d="M26 12A12 12 0 1 0 14 12A12 12 0 1 0 26 12Z" fill="currentColor"/></svg>
                </>
               )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

