import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Zap, Globe } from 'lucide-react'

export default function StoryPage() {
  return (
    <div className="bg-premium-bg min-h-screen pt-32 lg:pt-40">
      {/* ── Hero ── */}
      <div className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-30 grayscale"
            alt="URAIR Studio"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-premium-bg via-transparent to-premium-bg" />
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl space-y-12"
          >
            <div className="flex items-center gap-6 text-premium-secondary text-[10px] tracking-[0.6em] uppercase font-black">
              <div className="w-12 h-[1px] bg-premium-secondary" />
              Our Protocol
            </div>
            <h1 className="text-7xl lg:text-[10rem] font-black uppercase tracking-tighter leading-[0.8] text-premium-primary">
              The <span className="text-premium-secondary">Story</span>
            </h1>
            <p className="text-2xl lg:text-3xl font-medium text-premium-text-muted leading-relaxed max-w-2xl">
              Architecting the next generation of professional gear. We believe in the intersection of intelligence, durability, and editorial aesthetics.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Philosophy ── */}
      <div className="py-40 border-t border-premium-divider/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-32 items-center">
            <div className="space-y-16">
              <div className="space-y-8">
                <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter text-premium-primary leading-none">
                  Architectural <br/> <span className="text-premium-secondary">Intelligence</span>
                </h2>
                <p className="text-xl text-premium-text-muted font-medium leading-relaxed">
                  Founded in London, URAIR was born from a singular obsession: the evolution of the professional workstation. We saw a gap between high-performance hardware and the gear used to carry it.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-premium-secondary shadow-xl border border-premium-divider/50">
                    <Zap size={24} />
                  </div>
                  <h4 className="font-black uppercase tracking-widest text-xs">Velocity</h4>
                  <p className="text-xs text-premium-text-muted leading-relaxed">Optimized for rapid professional transit and deployment.</p>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-premium-secondary shadow-xl border border-premium-divider/50">
                    <Shield size={24} />
                  </div>
                  <h4 className="font-black uppercase tracking-widest text-xs">Durability</h4>
                  <p className="text-xs text-premium-text-muted leading-relaxed">Engineered with materials that outperform the elements.</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] bg-white rounded-[60px] overflow-hidden shadow-2xl border border-premium-divider">
                <img 
                  src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1200" 
                  className="w-full h-full object-cover"
                  alt="URAIR Product Engineering"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 w-64 aspect-square bg-premium-secondary rounded-[40px] p-10 flex flex-col justify-end shadow-2xl">
                 <p className="text-white text-4xl font-black leading-none uppercase tracking-tighter">Est.<br/>2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mission ── */}
      <div className="py-40 bg-premium-primary text-white overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30rem] font-black opacity-[0.03] pointer-events-none tracking-tighter leading-none">
          MISSION
        </div>
        <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center space-y-16">
          <h3 className="text-5xl lg:text-8xl font-black uppercase tracking-tighter leading-none">
            Elite Gear for <br/> <span className="text-premium-secondary">Elite Output</span>
          </h3>
          <p className="max-w-3xl mx-auto text-xl lg:text-2xl font-light opacity-60 leading-relaxed italic">
            "We don't just build bags and accessories. We build the physical interface between the professional and their craft. Every stitch, zipper, and pocket is a calculated decision in service of performance."
          </p>
          <div className="pt-12">
            <Link to="/shop" className="premium-button bg-white text-premium-primary hover:bg-premium-secondary hover:text-white px-16">
               Explore the Collection
            </Link>
          </div>
        </div>
      </div>

      {/* ── Global Presence ── */}
      <div className="py-40 border-t border-premium-divider/30">
        <div className="container mx-auto px-6 lg:px-12 text-center space-y-24">
           <div className="space-y-6">
              <p className="text-premium-secondary text-[10px] tracking-[0.5em] uppercase font-black">Global Operations</p>
              <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter text-premium-primary">Universal <span className="text-premium-secondary">Standard</span></h2>
           </div>
           <div className="grid md:grid-cols-3 gap-20">
              {[
                { title: 'London', label: 'Architecture & Design' },
                { title: 'Tokyo', label: 'Material Science' },
                { title: 'New York', label: 'Global Distribution' },
              ].map(hub => (
                <div key={hub.title} className="space-y-4">
                  <h4 className="text-3xl font-black uppercase tracking-tighter">{hub.title}</h4>
                  <p className="text-xs tracking-[0.3em] uppercase text-premium-text-muted font-bold">{hub.label}</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  )
}
