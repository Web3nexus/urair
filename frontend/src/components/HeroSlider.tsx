import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'

interface Slide {
  layout: 'split' | 'full'
  headline: string
  titleSize: string
  subtitle: string
  image: string
  bg_color: string
}

interface HeroSliderProps {
  slides: Slide[]
  stats?: { value: string; label: string }[]
}

export function HeroSlider({ slides, stats }: HeroSliderProps) {
  const [current, setCurrent] = useState(0)

  const activeSlides = slides && slides.length > 0 ? slides : [{
    layout: 'split',
    headline: 'Exclusive Collection 2024',
    titleSize: 'text-5xl',
    subtitle: 'Elevate your workspace with our meticulously crafted selection.',
    image: 'https://images.unsplash.com/photo-1550614005-045353066347?auto=format&fit=crop&q=80&w=1200',
    bg_color: '#f2f0f1'
  } as Slide]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeSlides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [activeSlides.length])

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % activeSlides.length)
  }

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)
  }

  const slide = activeSlides[current]

  return (
    <section 
      className="relative min-h-[90vh] overflow-hidden flex items-center transition-colors duration-1000" 
      style={{ backgroundColor: slide.layout === 'split' ? (slide.bg_color || '#f2f0f1') : '#000' }}
    >
      {/* Subtle Background Pattern */}
      {slide.layout === 'split' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0 pointer-events-none"
        />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial="enter"
          animate="center"
          exit="exit"
          variants={{
            enter: { opacity: 0 },
            center: { opacity: 1, transition: { staggerChildren: 0.1, duration: 0.6 } },
            exit: { opacity: 0, transition: { duration: 0.4 } }
          }}
          className="absolute inset-0 w-full h-full flex"
        >
          {slide.layout === 'full' ? (
            // ─── FULL IMAGE LAYOUT ───
            <div className="relative w-full h-full">
              <motion.img 
                variants={{
                  enter: { scale: 1.05, opacity: 0 },
                  center: { scale: 1, opacity: 1, transition: { duration: 1.2, ease: "easeOut" } },
                  exit: { scale: 1.05, opacity: 0, transition: { duration: 0.6 } }
                }}
                src={slide.image || "https://images.unsplash.com/photo-1550614005-045353066347?auto=format&fit=crop&q=80&w=1200"} 
                alt="Hero" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
              
              {(slide.headline || slide.subtitle) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10 space-y-6">
                  <motion.h1 
                    variants={{
                      enter: { y: 30, opacity: 0 },
                      center: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
                      exit: { y: -30, opacity: 0, transition: { duration: 0.4 } }
                    }}
                    className={cn("font-serif font-black text-white leading-[1.1] uppercase tracking-tighter break-words", slide.titleSize || 'text-5xl')}
                  >
                    {slide.headline}
                  </motion.h1>
                  {slide.subtitle && (
                    <motion.p 
                      variants={{
                        enter: { y: 30, opacity: 0 },
                        center: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
                        exit: { y: -30, opacity: 0, transition: { duration: 0.4 } }
                      }}
                      className="text-white/90 text-base lg:text-lg font-medium leading-relaxed max-w-2xl break-words"
                    >
                      {slide.subtitle}
                    </motion.p>
                  )}
                  <motion.div
                    variants={{
                      enter: { y: 30, opacity: 0 },
                      center: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
                      exit: { y: -30, opacity: 0, transition: { duration: 0.4 } }
                    }}
                    className="pt-6"
                  >
                    <Link to="/shop" className="group inline-flex items-center gap-3 bg-white text-obsidian px-12 py-5 rounded-full text-xs tracking-[0.2em] uppercase font-bold hover:bg-premium-bg transition-all shadow-2xl">
                      Shop Now
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                </div>
              )}
            </div>
          ) : (
            // ─── SPLIT LAYOUT ───
            <div className="w-full h-full flex flex-col lg:flex-row relative z-10 pt-32 lg:pt-0">
              
              {/* Left Text Half */}
              <motion.div 
                variants={{
                  enter: { x: '-15%', opacity: 0 },
                  center: { x: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
                  exit: { x: '-15%', opacity: 0, transition: { duration: 0.4 } }
                }}
                className="w-full lg:w-1/2 h-full flex flex-col justify-center px-6 lg:pl-20 lg:pr-12 relative z-20 pb-20 lg:pb-0"
              >
                <div className="max-w-2xl space-y-10 w-full">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 text-stone text-[8px] tracking-[0.4em] uppercase font-bold">
                      <div className="w-12 h-[1px] bg-stone" />
                      Premium Selection
                    </div>
                    <h1 
                      className={cn("font-serif font-black text-obsidian leading-[1.1] uppercase tracking-tighter break-words", slide.titleSize || 'text-5xl lg:text-6xl')}
                    >
                      {slide.headline}
                    </h1>
                    {slide.subtitle && (
                      <p className="text-stone text-base lg:text-lg font-medium leading-relaxed max-w-lg break-words">
                        {slide.subtitle}
                      </p>
                    )}
                  </div>

                  <div>
                    <Link to="/shop" className="group inline-flex items-center gap-3 bg-obsidian text-white px-12 py-5 rounded-full text-xs tracking-[0.2em] uppercase font-bold hover:bg-charcoal transition-all shadow-2xl">
                      Shop Now
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  {/* Brand Stats */}
                  {stats && stats.length > 0 && (
                    <div className="grid grid-cols-2 gap-8 pt-12 border-t border-mist/30">
                      {stats.slice(0, 2).map((stat, idx) => (
                        <div key={idx} className="space-y-1">
                          <p className="text-2xl lg:text-3xl font-serif font-black text-obsidian">{stat.value}</p>
                          <p className="text-stone text-[8px] tracking-widest uppercase font-bold">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
              
              {/* Right Image Half */}
              <motion.div 
                variants={{
                  enter: { x: '15%', opacity: 0 },
                  center: { x: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
                  exit: { x: '15%', opacity: 0, transition: { duration: 0.4 } }
                }}
                className="w-full lg:w-1/2 h-full hidden lg:block relative z-10"
              >
                <img 
                  src={slide.image || "https://images.unsplash.com/photo-1550614005-045353066347?auto=format&fit=crop&q=80&w=1200"} 
                  alt="Hero Slide" 
                  className="w-full h-full object-cover"
                />
              </motion.div>

            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Slider Controls */}
      {activeSlides.length > 1 && (
        <>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  current === idx ? "w-8 bg-premium-secondary" : "w-2 bg-premium-divider hover:bg-premium-secondary/50"
                )}
              />
            ))}
          </div>

          <button 
            onClick={handlePrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-obsidian hover:bg-white transition-all z-50 shadow-lg"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-obsidian hover:bg-white transition-all z-50 shadow-lg"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
    </section>
  )
}
