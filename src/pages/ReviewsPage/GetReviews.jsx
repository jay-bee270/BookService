"use client"

import { useState } from "react"
import { Card, Form, Input, Button, message, List, Typography, Space, Spin } from "antd"
import { SearchOutlined, BookOutlined, UserOutlined, CalendarOutlined } from "@ant-design/icons"

const { Title, Text, Paragraph } = Typography

const GetReviews = () => {
  const [form] = Form.useForm()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (values) => {
    setLoading(true)
    setSearched(true)
    try {
      const { reviewId, bookId } = values

      if (reviewId) {
        // UPDATED: Changed to new API endpoint
        const response = await fetch(`http://9.169.178.97:8080/reviews/${reviewId}`)
        if (response.ok) {
          const review = await response.json()
          setReviews([review])
        } else {
          setReviews([])
          message.warning("No review found with that ID")
        }
      } else if (bookId) {
        // UPDATED: Changed to new API endpoint
        const response = await fetch(`http://9.169.178.97:8080/reviews/book/${bookId}`)
        if (response.ok) {
          const bookReviews = await response.json()
          setReviews(Array.isArray(bookReviews) ? bookReviews : [])
          if (bookReviews.length === 0) {
            message.warning("No reviews found for that book")
          }
        } else {
          setReviews([])
          message.warning("No reviews found for that book")
        }
      }
    } catch (error) {
      message.error("Error searching reviews: " + error.message)
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Card style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 24, textAlign: "center" }}>
          <SearchOutlined style={{ fontSize: 48, color: "#1890ff", marginBottom: 16 }} />
          <Title level={3}>Find Reviews</Title>
          <Text type="secondary">Search for reviews by Review ID or Book ID</Text>
        </div>

        <Form form={form} layout="vertical" onFinish={handleSearch} size="large">
          <Form.Item name="reviewId" label="Review ID">
            <Input placeholder="Enter review ID to find a specific review" allowClear />
          </Form.Item>

          <Form.Item name="bookId" label="Book ID">
            <Input placeholder="Enter book ID to find all reviews for that book" allowClear />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: "100%", justifyContent: "center" }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                icon={<SearchOutlined />}
                style={{ minWidth: 120 }}
              >
                Search Reviews
              </Button>
              <Button
                onClick={() => {
                  form.resetFields()
                  setReviews([])
                  setSearched(false)
                }}
                size="large"
              >
                Clear
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {loading && (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" tip="Searching reviews..." />
        </div>
      )}

      {!loading && searched && (
        <Card title={`Search Results (${reviews.length} found)`}>
          {reviews.length === 0 ? (
            <div style={{ textAlign: "center", padding: "50px" }}>
              <Text type="secondary">No reviews found. Try different search criteria.</Text>
            </div>
          ) : (
            <List
              itemLayout="vertical"
              dataSource={reviews}
              renderItem={(review) => (
                <List.Item
                  style={{
                    padding: "16px",
                    border: "1px solid #f0f0f0",
                    borderRadius: "8px",
                    marginBottom: "16px",
                    backgroundColor: "#fafafa",
                  }}
                >
                  <div>
                    <div style={{ marginBottom: 12 }}>
                      <Space>
                        <Text strong>
                          <UserOutlined style={{ marginRight: 4, color: "#1890ff" }} />
                          {review.reviewer}
                        </Text>
                        <Text type="secondary">Review ID: {review.id}</Text>
                        <Text type="secondary">
                          <CalendarOutlined style={{ marginRight: 4 }} />
                          {new Date(review.createdAt).toLocaleDateString()}
                        </Text>
                      </Space>
                    </div>

                    <Paragraph style={{ marginBottom: 8 }}>
                      <Text strong>Review: </Text>
                      {review.comment}
                    </Paragraph>

                    {review.rating && (
                      <div style={{ marginBottom: 8 }}>
                        <Text strong>Rating: </Text>
                        <Text>{review.rating}/5 ⭐</Text>
                      </div>
                    )}

                    <Text type="secondary">
                      <BookOutlined style={{ marginRight: 4 }} />
                      Book ID: {review.bookId}
                    </Text>
                  </div>
                </List.Item>
              )}
            />
          )}
        </Card>
      )}
    </div>
  )
}

export default GetReviews