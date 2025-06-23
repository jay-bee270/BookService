"use client"

import { useState } from "react"
import { Form, Input, Button, Alert, Card, Typography, Space, Divider, Progress, Row, Col } from "antd"
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "axios"
import "./SignUpPage.css"

const { Title, Text, Link } = Typography

const SignUpPage = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  })
  const navigate = useNavigate()

  const calculatePasswordStrength = (password) => {
    if (!password) return 0

    const criteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }

    setPasswordCriteria(criteria)

    const score = Object.values(criteria).filter(Boolean).length
    return (score / 5) * 100
  }

  const handlePasswordChange = (e) => {
    const password = e.target.value
    const strength = calculatePasswordStrength(password)
    setPasswordStrength(strength)
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return "#ff4d4f"
    if (passwordStrength < 80) return "#faad14"
    return "#52c41a"
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength < 40) return "Weak"
    if (passwordStrength < 80) return "Medium"
    return "Strong"
  }

  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please enter your password"))
    }
    if (value.length < 8) {
      return Promise.reject(new Error("Password must be at least 8 characters"))
    }
    if (passwordStrength < 60) {
      return Promise.reject(new Error("Password is too weak"))
    }
    return Promise.resolve()
  }

  const validateConfirmPassword = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please confirm your password"))
    }
    if (value !== form.getFieldValue("password")) {
      return Promise.reject(new Error("Passwords do not match"))
    }
    return Promise.resolve()
  }

  const onFinish = async (values) => {
    const { username, password, email, confirmPassword } = values

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // First, try the real API
      const response = await axios.post(
        "https://auth-service-0oqe.onrender.com/auth/signup",
        {
          username: username.trim(),
          password,
          email: email.trim().toLowerCase(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        },
      )

      toast.success("Account created successfully! Please sign in.", {
        position: "top-right",
        autoClose: 3000,
      })

      // Clear form
      form.resetFields()

      // Navigate to sign in
      setTimeout(() => {
        navigate("/signin", {
          state: {
            message: "Account created successfully! Please sign in with your credentials.",
            username: username,
          },
        })
      }, 1000)
    } catch (error) {
      console.error("Signup error:", error)

      // Check if it's a network error and use mock system
      if (error.code === "ERR_NETWORK" || error.message.includes("Network Error") || !error.response) {
        console.log("Using mock authentication system")

        try {
          // Mock signup - simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 1500))

          // Check if user already exists in localStorage
          const existingUsers = JSON.parse(localStorage.getItem("mockUsers") || "[]")
          const userExists = existingUsers.some(
            (user) => user.username === username.trim() || user.email === email.trim().toLowerCase(),
          )

          if (userExists) {
            throw new Error("Username or email already exists")
          }

          // Save user to localStorage
          const newUser = {
            id: Date.now(),
            username: username.trim(),
            email: email.trim().toLowerCase(),
            password: password, // In real app, this would be hashed
            createdAt: new Date().toISOString(),
          }

          existingUsers.push(newUser)
          localStorage.setItem("mockUsers", JSON.stringify(existingUsers))

          toast.success("Account created successfully! (Using demo mode)", {
            position: "top-right",
            autoClose: 3000,
          })

          // Clear form
          form.resetFields()

          // Navigate to sign in
          setTimeout(() => {
            navigate("/signin", {
              state: {
                message: "Account created successfully! Please sign in with your credentials. (Demo mode active)",
                username: username,
              },
            })
          }, 1000)

          return
        } catch (mockError) {
          setError(mockError.message)
          toast.error(mockError.message)
          return
        }
      }

      let errorMessage = "An unexpected error occurred. Please try again."

      if (error.response) {
        const status = error.response.status
        const data = error.response.data

        switch (status) {
          case 400:
            if (typeof data === "string" && data.includes("Username already exists")) {
              errorMessage = "This username is already taken. Please choose another one."
            } else if (typeof data === "string" && data.includes("Email already exists")) {
              errorMessage = "This email is already registered. Please use a different email or sign in."
            } else {
              errorMessage = "Invalid registration data. Please check your inputs."
            }
            break
          case 409:
            errorMessage = "Username or email already exists. Please try different credentials."
            break
          case 500:
            errorMessage = "Server error. Please try again later."
            break
          default:
            errorMessage = `Registration failed (${status}). Please try again.`
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your internet connection or try demo mode."
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Request timeout. Please try again."
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

  return (
    <div className="signup-container">
      <Row justify="center" align="middle" style={{ minHeight: "100vh", padding: "20px" }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={8}>
          <Card className="signup-card" bordered={false}>
            <div className="signup-header">
              <Title level={2} className="signup-title">
                Create Account
              </Title>
              <Text type="secondary" className="signup-subtitle">
                Join us today and get started
              </Text>
            </div>

            {error && (
              <Alert
                message="Registration Error"
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

            <Form
              form={form}
              name="signup"
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
                  { max: 20, message: "Username must be less than 20 characters" },
                  {
                    pattern: /^[a-zA-Z0-9_]+$/,
                    message: "Username can only contain letters, numbers, and underscores",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter a unique username"
                  autoComplete="username"
                  aria-describedby="username-help"
                />
              </Form.Item>

              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email address" },
                  { type: "email", message: "Please enter a valid email address" },
                  { max: 100, message: "Email must be less than 100 characters" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Enter your email address"
                  autoComplete="email"
                  aria-describedby="email-help"
                />
              </Form.Item>

              <Form.Item label="Password" name="password" rules={[{ validator: validatePassword }]}>
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  onChange={handlePasswordChange}
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  aria-describedby="password-help password-strength"
                />
              </Form.Item>

              {passwordStrength > 0 && (
                <div className="password-strength" id="password-strength">
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>Password Strength: </Text>
                    <Text style={{ color: getPasswordStrengthColor() }}>{getPasswordStrengthText()}</Text>
                  </div>
                  <Progress
                    percent={passwordStrength}
                    strokeColor={getPasswordStrengthColor()}
                    showInfo={false}
                    size="small"
                  />
                  <div className="password-criteria">
                    <Space direction="vertical" size="small" style={{ width: "100%" }}>
                      {Object.entries({
                        length: "At least 8 characters",
                        uppercase: "One uppercase letter",
                        lowercase: "One lowercase letter",
                        number: "One number",
                        special: "One special character",
                      }).map(([key, text]) => (
                        <div key={key} className="criteria-item">
                          {passwordCriteria[key] ? (
                            <CheckCircleOutlined style={{ color: "#52c41a" }} />
                          ) : (
                            <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
                          )}
                          <Text
                            style={{
                              marginLeft: 8,
                              color: passwordCriteria[key] ? "#52c41a" : "#8c8c8c",
                            }}
                          >
                            {text}
                          </Text>
                        </div>
                      ))}
                    </Space>
                  </div>
                </div>
              )}

              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={["password"]}
                rules={[{ validator: validateConfirmPassword }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 16 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                  className="signup-button"
                  disabled={loading}
                  aria-describedby={loading ? "loading-text" : undefined}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
                {loading && (
                  <div id="loading-text" className="sr-only">
                    Please wait while we create your account
                  </div>
                )}
              </Form.Item>
            </Form>

            <Divider>
              <Text type="secondary">Already have an account?</Text>
            </Divider>

            <div className="signin-link">
              <Button type="link" size="large" onClick={() => navigate("/signin")} block>
                Sign In Instead
              </Button>
            </div>

            <div className="security-notice">
              <Space align="start">
                <InfoCircleOutlined style={{ color: "#1890ff", marginTop: 2 }} />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  By creating an account, you agree to our Terms of Service and Privacy Policy. Your data is encrypted
                  and secure.
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

export default SignUpPage
