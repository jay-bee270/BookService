"use client"

import { useState, useEffect } from "react"
import { Card, Input, Button, Spin, Alert, Typography, Space, Divider, Tag, message } from "antd"
import { SearchOutlined, CalendarOutlined, UserOutlined, MessageOutlined, CopyOutlined } from "@ant-design/icons"

const { Title, Text, Paragraph } = Typography

const GetReviews = () => {
  const [bookId, setBookId] = useState(2)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [inputId, setInputId] = useState("")

  const fetchReviews = async (id) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`https://book-services-group-a-1.onrender.com/reviews/book/${id}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setReviews(data)
    } catch (err) {
      setError(err.message)
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const id = Number.parseInt(inputId)
    if (!isNaN(id)) {
      setBookId(id)
      fetchReviews(id)
    }
  }

  useEffect(() => {
    fetchReviews(bookId)
  }, [])

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>
      <Title level={2}>Book Reviews</Title>

      <Card style={{ marginBottom: "24px" }}>
        <form onSubmit={handleSubmit}>
          <Space.Compact style={{ width: "100%" }}>
            <Input
              placeholder="Enter Book ID"
              type="number"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              min="1"
              size="large"
            />
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />} size="large">
              Search
            </Button>
          </Space.Compact>
        </form>
      </Card>

      {loading && (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" />
          <div style={{ marginTop: "16px" }}>Loading reviews for book ID: {bookId}...</div>
        </div>
      )}

      {error && <Alert message="Error" description={error} type="error" showIcon style={{ marginBottom: "24px" }} />}

      <Title level={3}>Reviews for Book ID: {bookId}</Title>

      {!loading && reviews.length === 0 && !error && (
        <Card>
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Text type="secondary">No reviews found for this book.</Text>
          </div>
        </Card>
      )}

      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {reviews.map((review) => (
          <Card
            key={review.id}
            hoverable
            title={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Space>
                  <UserOutlined />
                  <Text strong>{review.reviewer}</Text>
                </Space>
                <Tag color="#667eea" style={{ fontSize: "14px", padding: "2px 10px" }}>
                  Review ID: {review.id}
                </Tag>
              </div>
            }
          >
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              <Space align="start">
                <MessageOutlined />
                <Paragraph style={{ margin: 0 }}>{review.comment}</Paragraph>
              </Space>

              <Divider style={{ margin: "12px 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Space>
                  <CalendarOutlined />
                  <Text type="secondary">{new Date(review.createdAt).toLocaleString()}</Text>
                </Space>
                <Button
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => {
                    navigator.clipboard.writeText(review.id.toString())
                    message.success(`Review ID ${review.id} copied to clipboard!`)
                  }}
                >
                  Copy ID
                </Button>
              </div>
            </Space>
          </Card>
        ))}
      </Space>
    </div>
  )
}

export default GetReviews
