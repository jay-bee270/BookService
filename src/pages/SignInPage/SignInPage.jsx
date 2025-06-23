"use client"

import { useState, useEffect } from "react"
import { Form, Input, Button, Alert, Card, Typography, Checkbox, Divider, Space, Row, Col } from "antd"
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  SafetyCertificateOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons"
import { useNavigate, useLocation } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "axios"
import "./SignInPage.css"

const { Title, Text, Link } = Typography

const SignInPage = ({ setIsAuthenticated }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [rememberMe, setRememberMe] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockoutTime, setLockoutTime] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Check for success message from signup
    if (location.state?.message) {
      toast.success(location.state.message, {
        position: "top-right",
        autoClose: 5000,
      })

      // Pre-fill username if provided
      if (location.state.username) {
        form.setFieldsValue({ username: location.state.username })
      }
    }

    // Check for existing lockout
    const lockoutEnd = localStorage.getItem("loginLockoutEnd")
    if (lockoutEnd && new Date() < new Date(lockoutEnd)) {
      setIsLocked(true)
      setLockoutTime(new Date(lockoutEnd))
    }

    // Load remember me preference
    const savedUsername = localStorage.getItem("rememberedUsername")
    const savedRememberMe = localStorage.getItem("rememberMe") === "true"

    if (savedRememberMe && savedUsername) {
      form.setFieldsValue({ username: savedUsername })
      setRememberMe(true)
    }
  }, [location.state, form])

  useEffect(() => {
    let timer
    if (isLocked && lockoutTime) {
      timer = setInterval(() => {
        if (new Date() >= lockoutTime) {
          setIsLocked(false)
          setLockoutTime(null)
          setLoginAttempts(0)
          localStorage.removeItem("loginLockoutEnd")
          localStorage.removeItem("loginAttempts")
        }
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isLocked, lockoutTime])

  const handleLockout = () => {
    const lockoutEnd = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
    setIsLocked(true)
    setLockoutTime(lockoutEnd)
    localStorage.setItem("loginLockoutEnd", lockoutEnd.toISOString())
    localStorage.setItem("loginAttempts", "0")
  }

  const getRemainingLockoutTime = () => {
    if (!lockoutTime) return ""
    const remaining = Math.ceil((lockoutTime - new Date()) / 1000 / 60)
    return `${remaining} minute${remaining !== 1 ? "s" : ""}`
  }

  const onFinish = async (values) => {
    if (isLocked) {
      toast.error(`Account temporarily locked. Try again in ${getRemainingLockoutTime()}.`)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // First, try the real API
      const response = await axios.post(
        "https://auth-service-0oqe.onrender.com/auth/login",
        {
          username: values.username.trim(),
          password: values.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        },
      )

      // Reset login attempts on successful login
      setLoginAttempts(0)
      localStorage.removeItem("loginAttempts")
      localStorage.removeItem("loginLockoutEnd")

      // Handle remember me
      if (rememberMe) {
        localStorage.setItem("rememberedUsername", values.username)
        localStorage.setItem("rememberMe", "true")
      } else {
        localStorage.removeItem("rememberedUsername")
        localStorage.removeItem("rememberMe")
      }

      // Store auth token securely
      const token = response.data.jwt || response.data.token
      if (token) {
        localStorage.setItem("authToken", token)
        const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000)
        localStorage.setItem("tokenExpiration", expirationTime.toISOString())
      }

      if (setIsAuthenticated) {
        setIsAuthenticated(true)
      }

      toast.success("Welcome back! Login successful.", {
        position: "top-right",
        autoClose: 3000,
      })

      form.resetFields()
      const intendedPath = location.state?.from?.pathname || "/dashboard"
      navigate(intendedPath, { replace: true })
    } catch (error) {
      console.error("Login error:", error)

      // Check if it's a network error and use mock system
      if (error.code === "ERR_NETWORK" || error.message.includes("Network Error") || !error.response) {
        console.log("Using mock authentication system")

        try {
          // Mock login - simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Check credentials against localStorage
          const existingUsers = JSON.parse(localStorage.getItem("mockUsers") || "[]")
          const user = existingUsers.find(
            (u) => u.username === values.username.trim() && u.password === values.password,
          )

          if (!user) {
            throw new Error("Invalid username or password")
          }

          // Reset login attempts on successful login
          setLoginAttempts(0)
          localStorage.removeItem("loginAttempts")
          localStorage.removeItem("loginLockoutEnd")

          // Handle remember me
          if (rememberMe) {
            localStorage.setItem("rememberedUsername", values.username)
            localStorage.setItem("rememberMe", "true")
          } else {
            localStorage.removeItem("rememberedUsername")
            localStorage.removeItem("rememberMe")
          }

          // Create mock token
          const mockToken = `mock_token_${user.id}_${Date.now()}`
          localStorage.setItem("authToken", mockToken)
          const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000)
          localStorage.setItem("tokenExpiration", expirationTime.toISOString())
          localStorage.setItem("currentUser", JSON.stringify(user))

          if (setIsAuthenticated) {
            setIsAuthenticated(true)
          }

          toast.success("Welcome back! Login successful. (Demo mode)", {
            position: "top-right",
            autoClose: 3000,
          })

          form.resetFields()
          const intendedPath = location.state?.from?.pathname || "/dashboard"
          navigate(intendedPath, { replace: true })
          return
        } catch (mockError) {
          // Increment login attempts for mock system too
          const newAttempts = loginAttempts + 1
          setLoginAttempts(newAttempts)
          localStorage.setItem("loginAttempts", newAttempts.toString())

          if (newAttempts >= 5) {
            handleLockout()
            setError("Too many failed login attempts. Account locked for 15 minutes for security.")
            toast.error("Account temporarily locked due to multiple failed attempts.", {
              position: "top-right",
              autoClose: 8000,
            })
            return
          }

          const remainingAttempts = 5 - newAttempts
          const errorMessage = `${mockError.message} (${remainingAttempts} attempt${remainingAttempts !== 1 ? "s" : ""} remaining)`

          setError(errorMessage)
          toast.error(errorMessage)
          return
        }
      }

      // Handle real API errors
      const newAttempts = loginAttempts + 1
      setLoginAttempts(newAttempts)
      localStorage.setItem("loginAttempts", newAttempts.toString())

      if (newAttempts >= 5) {
        handleLockout()
        setError("Too many failed login attempts. Account locked for 15 minutes for security.")
        toast.error("Account temporarily locked due to multiple failed attempts.", {
          position: "top-right",
          autoClose: 8000,
        })
        return
      }

      let errorMessage = "Login failed. Please check your credentials."

      if (error.response) {
        const status = error.response.status
        const data = error.response.data

        switch (status) {
          case 400:
            errorMessage = "Invalid username or password."
            break
          case 401:
            errorMessage = "Invalid credentials. Please check your username and password."
            break
          case 403:
            errorMessage = "Account access denied. Please contact support."
            break
          case 404:
            errorMessage = "User not found. Please check your username or sign up."
            break
          case 429:
            errorMessage = "Too many login attempts. Please try again later."
            break
          case 500:
            errorMessage = "Server error. Please try again later."
            break
          default:
            errorMessage = data?.message || data?.error || errorMessage
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your internet connection or try demo mode."
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Request timeout. Please try again."
      }

      const remainingAttempts = 5 - newAttempts
      if (remainingAttempts > 0) {
        errorMessage += ` (${remainingAttempts} attempt${remainingAttempts !== 1 ? "s" : ""} remaining)`
      }

      setError(errorMessage)
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log("Form validation failed:", errorInfo)
    toast.error("Please fix the form errors before submitting.", {
      position: "top-right",
    })
  }

  const handleForgotPassword = () => {
    toast.info("Password reset functionality will be available soon.", {
      position: "top-right",
    })
    // TODO: Implement forgot password functionality
  }

  return (
    <div className="signin-container">
      <Row justify="center" align="middle" style={{ minHeight: "100vh", padding: "20px" }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={8}>
          <Card className="signin-card" bordered={false}>
            <div className="signin-header">
              <Title level={2} className="signin-title">
                Welcome Back
              </Title>
              <Text type="secondary" className="signin-subtitle">
                Sign in to your account
              </Text>
            </div>

            {error && (
              <Alert
                message="Sign In Error"
                description={error}
                type="error"
                showIcon
                closable
                onClose={() => setError(null)}
                style={{ marginBottom: 24 }}
                role="alert"
                aria-live="polite"
              />
            )}

            {isLocked && (
              <Alert
                message="Account Temporarily Locked"
                description={`For security reasons, this account is locked for ${getRemainingLockoutTime()}. Please try again later.`}
                type="warning"
                showIcon
                style={{ marginBottom: 24 }}
                icon={<SafetyCertificateOutlined />}
              />
            )}

            <Form
              form={form}
              name="signin"
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              size="large"
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  { required: true, message: "Please enter your username" },
                  { min: 3, message: "Username must be at least 3 characters" },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter your username"
                  autoComplete="username"
                  disabled={isLocked}
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter your password" },
                  { min: 6, message: "Password must be at least 6 characters" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  disabled={isLocked}
                />
              </Form.Item>

              <Form.Item>
                <div className="signin-options">
                  <Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} disabled={isLocked}>
                    Remember me
                  </Checkbox>
                  <Button
                    type="link"
                    onClick={handleForgotPassword}
                    className="forgot-password-link"
                    disabled={isLocked}
                  >
                    Forgot password?
                  </Button>
                </div>
              </Form.Item>

              <Form.Item style={{ marginBottom: 16 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                  className="signin-button"
                  disabled={loading || isLocked}
                  aria-describedby={loading ? "loading-text" : undefined}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
                {loading && (
                  <div id="loading-text" className="sr-only">
                    Please wait while we sign you in
                  </div>
                )}
              </Form.Item>
            </Form>

            <Divider>
              <Text type="secondary">Don't have an account?</Text>
            </Divider>

            <div className="signup-link">
              <Button type="link" size="large" onClick={() => navigate("/signup")} block>
                Create New Account
              </Button>
            </div>

            <div className="security-notice">
              <Space align="start">
                <SafetyCertificateOutlined style={{ color: "#52c41a", marginTop: 2 }} />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Your connection is secure and encrypted. We protect your privacy and data.
                </Text>
              </Space>
            </div>

            <div className="demo-notice">
              <Space align="start">
                <InfoCircleOutlined style={{ color: "#faad14", marginTop: 2 }} />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  <strong>Demo Mode:</strong> If the server is unavailable, the app will automatically switch to demo
                  mode using local storage.
                </Text>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default SignInPage
