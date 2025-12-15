"use client"

import { useState } from "react"
import { Card, Form, Input, Button, message, Rate, Space, Typography } from "antd"
import { BookOutlined, UserOutlined } from "@ant-design/icons"

const { Title, Text } = Typography
const { TextArea } = Input

const AddRecommendations = ({ onSuccess }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      const response = await fetch("http://172.193.176.39:8081/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        message.success("Book recommendation added successfully!")
        form.resetFields()
        onSuccess && onSuccess()
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to add recommendation")
      }
    } catch (error) {
      message.error("Error adding recommendation: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="add-recommendation-card">
      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <BookOutlined style={{ fontSize: 48, color: "#1890ff", marginBottom: 16 }} />
        <Title level={3}>Add New Book Recommendation</Title>
        <Text type="secondary">Share a book you love with the community</Text>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit} size="large">
        <Form.Item
          name="bookName"
          label="Book Title"
          rules={[{ required: true, message: "Please enter the book title" }]}
        >
          <Input prefix={<BookOutlined />} placeholder="e.g. Atomic Habits" />
        </Form.Item>

        <Form.Item
          name="author"
          label="Author"
          rules={[{ required: true, message: "Please enter the author name" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="e.g. James Clear" />
        </Form.Item>

        <Form.Item
          name="rating"
          label="Your Rating"
          rules={[{ required: true, message: "Please rate this book" }]}
        >
          <Rate allowHalf />
        </Form.Item>

        <Form.Item
          name="description"
          label="Why do you recommend this book?"
          rules={[
            { required: true, message: "Please tell us why you love this book" },
            { min: 20, message: "Please write at least 20 characters" }
          ]}
        >
          <TextArea
            rows={5}
            placeholder="Share what makes this book special, how it impacted you, or who should read it..."
            showCount
            maxLength={800}
          />
        </Form.Item>

        <Form.Item style={{ marginTop: 32 }}>
          <Space style={{ width: "100%", justifyContent: "center" }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              style={{ minWidth: 160 }}
            >
              Add Recommendation
            </Button>
            <Button onClick={() => form.resetFields()} size="large">
              Clear Form
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default AddRecommendations