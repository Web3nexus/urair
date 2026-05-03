import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi, type LoginCredentials, type RegisterData } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: LoginCredentials) => authApi.login(data).then((r) => r.data),
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      navigate('/')
    },
  })
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data).then((r) => r.data),
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      navigate('/')
    },
  })
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  return () => {
    authApi.logout().finally(() => {
      logout()
      navigate('/login')
    })
  }
}
