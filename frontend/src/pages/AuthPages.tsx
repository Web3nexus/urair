import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Loader2, Shield } from 'lucide-react'
import { Turnstile } from '@marsidev/react-turnstile'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'
import { useCMSStore } from '@/store/cmsStore'

export default function AuthPages({ type }: { type: 'login' | 'register' | 'admin-login' }) {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const [cfToken, setCfToken] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  
  // 2FA State
  const [is2FARequired, setIs2FARequired] = useState(false)
  const [twoFactorUserId, setTwoFactorUserId] = useState<number | null>(null)
  const [twoFactorCode, setTwoFactorCode] = useState('')

  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const { turnstile_site_key, site_logo } = useCMSStore()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (turnstile_site_key && !cfToken) {
      setError('Please complete the security check.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const payload = { ...formData, cf_turnstile_response: cfToken }
      let data;
      if (type === 'admin-login') {
        data = await authApi.adminLogin({ email: payload.email, password: payload.password, cf_turnstile_response: payload.cf_turnstile_response })
      } else if (type === 'login') {
        data = await authApi.login({ email: payload.email, password: payload.password, cf_turnstile_response: payload.cf_turnstile_response })
      } else {
        data = await authApi.register(payload)
      }
      
      if (data['2fa_required']) {
        setIs2FARequired(true)
        setTwoFactorUserId(data.user_id)
        setLoading(false)
        return
      }
      
      setAuth(data.user, data.access_token)
      
      if (data.user.email === 'admin@urair.com' || data.user.role === 'admin') {
        navigate('/securegate')
      } else {
        navigate('/')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const data = await authApi.verify2FALogin({
        user_id: twoFactorUserId,
        code: twoFactorCode
      })
      
      setAuth(data.user, data.access_token)
      if (data.user.email === 'admin@urair.com' || data.user.role === 'admin') {
        navigate('/securegate')
      } else {
        navigate('/')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid 2FA code.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[90vh] flex">
      {/* Visual Side */}
      <div className="hidden lg:flex flex-1 bg-white relative overflow-hidden items-center justify-center border-r border-premium-divider">
        <div className="relative z-10 text-center space-y-10 max-w-md px-12">
          <p className="text-premium-secondary text-[10px] tracking-[0.5em] uppercase font-bold">The Urair Standard</p>
          <h2 className="text-5xl lg:text-6xl text-premium-primary leading-[1] uppercase font-black tracking-tighter">
            {type === 'login' ? 'Welcome Back' : type === 'admin-login' ? 'System Control' : 'Create Account'}
          </h2>
          <p className="text-premium-text-muted font-medium leading-relaxed text-lg">
            Indulge in a world of curated luxury. Access your private collection and experience white-glove logistics.
          </p>
          <div className="pt-10 flex justify-center">
            <div className="w-16 h-1 bg-premium-secondary" />
          </div>
        </div>
        {/* Abstract elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-premium-secondary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-premium-accent/5 blur-[120px] rounded-full" />
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-24 bg-transparent">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-sm space-y-12"
        >
          <div className={`space-y-6 ${type === 'register' ? 'pt-12 lg:pt-16' : ''}`}>
            <Link to="/" className="inline-block mb-4">
              {site_logo ? (
                <img src={site_logo} alt="Logo" className="h-10 object-contain" />
              ) : (
                <span className="text-2xl font-black tracking-tighter text-premium-primary uppercase">
                  UR<span className="text-premium-secondary">AIR</span>
                </span>
              )}
            </Link>
            <h1 className="text-5xl text-premium-primary uppercase font-black tracking-tighter">
              {type === 'login' || type === 'admin-login' ? 'Sign In' : 'Sign Up'}
            </h1>
            <p className="text-premium-text-muted text-[10px] tracking-[0.4em] uppercase font-bold">
              {type === 'login' ? 'Enter your details to sign in' : type === 'admin-login' ? 'Authorised Personnel Only' : 'Enter your details to create an account'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest">
              {error}
            </div>
          )}

          {is2FARequired ? (
            <form className="space-y-6" onSubmit={handleVerify2FA}>
              <div className="space-y-2">
                <label className="text-[10px] tracking-[0.3em] uppercase text-premium-text-muted font-black">Authentication Code</label>
                <div className="relative group">
                  <Shield className="absolute left-6 top-1/2 -translate-y-1/2 text-premium-text-muted group-focus-within:text-premium-secondary transition-colors" size={18} />
                  <input
                    type="text"
                    required
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    className="w-full bg-white border border-premium-divider/50 rounded-full text-premium-primary px-14 py-3 text-sm font-bold outline-none focus:border-premium-secondary transition-all shadow-sm tracking-[0.2em]"
                    placeholder="123456"
                    maxLength={6}
                  />
                </div>
                <p className="text-[10px] text-premium-text-muted mt-2 px-2 uppercase tracking-widest font-bold">Enter the 6-digit code from your authenticator app.</p>
              </div>

              <button
                type="submit"
                disabled={loading || twoFactorCode.length < 6}
                className="w-full bg-premium-primary text-white rounded-full py-4 text-[10px] uppercase tracking-[0.3em] font-black hover:bg-premium-secondary transition-all shadow-xl shadow-premium-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : 'Verify Access'}
              </button>
            </form>
          ) : (
            <form className={`space-y-4 ${type === 'register' ? 'mt-8' : ''}`} onSubmit={handleAuth}>
            {type === 'register' && (
              <div className="space-y-2">
                <label className="text-[10px] tracking-[0.3em] uppercase text-premium-text-muted font-black">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-premium-text-muted group-focus-within:text-premium-secondary transition-colors" size={18} />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-premium-divider/50 rounded-full text-premium-primary px-14 py-3 text-sm font-bold outline-none focus:border-premium-secondary transition-all shadow-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.3em] uppercase text-premium-text-muted font-black">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-premium-text-muted group-focus-within:text-premium-secondary transition-colors" size={18} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white border border-premium-divider/50 rounded-full text-premium-primary px-14 py-3 text-sm font-bold outline-none focus:border-premium-secondary transition-all shadow-sm"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] tracking-[0.3em] uppercase text-premium-text-muted font-black">Password</label>
                {type === 'login' && (
                  <Link to="/forgot-password" className="text-[10px] text-premium-secondary hover:text-premium-primary tracking-[0.2em] uppercase transition-colors font-black">
                    Lost?
                  </Link>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-premium-text-muted group-focus-within:text-premium-secondary transition-colors" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-white border border-premium-divider/50 rounded-full text-premium-primary px-14 py-3 text-sm font-bold outline-none focus:border-premium-secondary transition-all shadow-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-8 top-1/2 -translate-y-1/2 text-premium-text-muted hover:text-premium-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {type === 'register' && (
              <div className="space-y-2">
                <label className="text-[10px] tracking-[0.3em] uppercase text-premium-text-muted font-black">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-premium-text-muted group-focus-within:text-premium-secondary transition-colors" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password_confirmation}
                    onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                    className="w-full bg-white border border-premium-divider/50 rounded-full text-premium-primary px-14 py-3 text-sm font-bold outline-none focus:border-premium-secondary transition-all shadow-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {turnstile_site_key && (
              <div className="pt-4 flex justify-center">
                <Turnstile 
                  siteKey={turnstile_site_key} 
                  onSuccess={(token) => setCfToken(token)} 
                  onError={() => setError('Security check failed.')}
                  onExpire={() => setCfToken('')}
                />
              </div>
            )}

            <button 
              disabled={loading || (!!turnstile_site_key && !cfToken)}
              className="w-full premium-button py-4 flex items-center justify-center gap-4 mt-10 shadow-2xl disabled:opacity-50 text-sm"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (type === 'login' || type === 'admin-login' ? 'Sign In' : 'Sign Up')} <ArrowRight size={20} />
            </button>
          </form>
          )}

          {type !== 'admin-login' && (
            <div className="text-center pt-10 border-t border-premium-divider/30">
              <p className="text-premium-text-muted text-xs font-bold tracking-widest uppercase">
                {type === 'login' ? "New Here?" : "Already have an account?"}{' '}
                <Link
                  to={type === 'login' ? '/register' : '/login'}
                  className="text-premium-secondary hover:text-premium-primary transition-colors font-black ml-2"
                >
                  {type === 'login' ? 'Sign Up' : 'Sign In'}
                </Link>
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

