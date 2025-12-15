"use client"

import { useState } from "react"
import { Card, Form, Input, Button, Typography, Space, message } from "antd"
import { UserOutlined, LockOutlined, BookOutlined } from "@ant-design/icons"
import "./SignIn.css"

const { Title, Text } = Typography

const SignIn = ({ onLogin }) => {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values) => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (values.username === "admin" && values.password === "password") {
        message.success("Welcome to Book Dashboard!")
        onLogin()
      } else {
        message.error("Invalid credentials. Use admin/password")
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="signin-container">
      <div className="signin-content">
        <Card className="signin-card">
          <div className="signin-header">
            <div className="logo-section">
              <BookOutlined className="signin-logo" />
              <Title level={2} className="signin-title">
                Book Dashboard
              </Title>
              <Text type="secondary">Management System</Text>
            </div>
          </div>

          <Form name="signin" onFinish={handleSubmit} layout="vertical" size="large" className="signin-form">
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: "Please input your username!" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Enter username" className="signin-input" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please input your password!" }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Enter password" className="signin-input" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} className="signin-button" block>
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div className="signin-footer">
            <Space direction="vertical" align="center">
              <Text type="secondary" className="demo-text">
                Demo Credentials:
              </Text>
              <Text code>Username: admin</Text>
              <Text code>Password: password</Text>
            </Space>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default SignIn
