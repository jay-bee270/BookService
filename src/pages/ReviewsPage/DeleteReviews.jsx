"use client"

import { useState } from "react"
import { Card, Form, Input, Button, message, Typography, Space } from "antd"
import { DeleteOutlined } from "@ant-design/icons"

const { Title, Text } = Typography

const DeleteReview = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleDelete = async (reviewId) => {
    setLoading(true)
    try {
      const response = await fetch(`http://9.169.178.97:8080/reviews/${reviewId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        message.success("Review deleted successfully!")
        form.resetFields()
      } else {
        throw new Error("Failed to delete review")
      }
    } catch (error) {
      message.error("Error deleting review: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (values) => {
    const { reviewId } = values
    if (reviewId) {
      handleDelete(reviewId)
    }
  }

  return (
    <Card style={{ maxWidth: 600, margin: "0 auto" }}>
      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <DeleteOutlined style={{ fontSize: 48, color: "#ff4d4f", marginBottom: 16 }} />
        <Title level={3}>Delete Review</Title>
        <Text type="secondary">Remove a review by entering its ID</Text>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit} size="large">
        <Form.Item
          name="reviewId"
          label="Review ID"
          rules={[{ required: true, message: "Please enter the review ID" }]}
        >
          <Input placeholder="Enter the ID of the review you want to delete" allowClear />
        </Form.Item>

        <Form.Item>
          <Space style={{ width: "100%", justifyContent: "center" }}>
            <Button
              type="primary"
              danger
              htmlType="submit"
              loading={loading}
              size="large"
              icon={<DeleteOutlined />}
              style={{ minWidth: 120 }}
            >
              Delete Review
            </Button>
            <Button onClick={() => form.resetFields()} size="large">
              Clear
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <div
        style={{ marginTop: 24, padding: 16, backgroundColor: "#fff2f0", borderRadius: 8, border: "1px solid #ffccc7" }}
      >
        <Text type="warning" strong>
          ⚠️ Warning:{" "}
        </Text>
        <Text type="secondary">
          This action cannot be undone. Make sure you have the correct review ID before proceeding.
        </Text>
      </div>
    </Card>
  )
}

export default DeleteReview
