// src/context/AuthContext.jsx
"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('authToken')
      if (token) {
        try {
          await axios.get('https://auth-service-0oqe.onrender.com/auth/validate', {
            headers: { Authorization: `Bearer ${token}` }
          })
          setIsAuthenticated(true)
        } catch (error) {
          localStorage.removeItem('authToken')
        }
      }
      setIsLoading(false)
    }
    validateToken()
  }, [])

  const login = async (token) => {
    localStorage.setItem('authToken', token)
    setIsAuthenticated(true)
    navigate('/dashboard')
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    setIsAuthenticated(false)
    navigate('/signin')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}