import { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Set axios defaults
  axios.defaults.baseURL = 'http://localhost:5000/api'
  
  // Set auth token for all requests if available
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  // Load user if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await axios.get('/auth/me')
          setUser(res.data.data)
          setIsAuthenticated(true)
        } catch (err) {
          localStorage.removeItem('token')
          setToken(null)
          setUser(null)
          setIsAuthenticated(false)
        }
      }
      setLoading(false)
    }

    loadUser()
  }, [token])

  // Register user
  const register = async (userData) => {
    try {
      const res = await axios.post('/auth/register', userData)
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token)
        setToken(res.data.token)
        setUser(res.data.user)
        setIsAuthenticated(true)
        toast.success('Registration successful')
        return true
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed')
      return false
    }
  }

  // Login user
  const login = async (userData) => {
    try {
      const res = await axios.post('/auth/login', userData)
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token)
        setToken(res.data.token)
        setUser(res.data.user)
        setIsAuthenticated(true)
        toast.success('Login successful')
        return true
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed')
      return false
    }
  }

  // Logout user
  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
    toast.info('Logged out successfully')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
