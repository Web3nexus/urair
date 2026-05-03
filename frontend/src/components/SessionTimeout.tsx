import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'

const TIMEOUT_DURATION = 30 * 60 * 1000 // 30 minutes in milliseconds

export default function SessionTimeout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const timerRef = useRef<any>(null)

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (isAuthenticated) {
      timerRef.current = setTimeout(() => {
        logout()
        navigate('/login')
      }, TIMEOUT_DURATION)
    }
  }

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    
    const handleActivity = () => {
      resetTimer()
    }

    if (isAuthenticated) {
      resetTimer()
      events.forEach(event => window.addEventListener(event, handleActivity))
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      events.forEach(event => window.removeEventListener(event, handleActivity))
    }
  }, [isAuthenticated])

  return <>{children}</>
}
