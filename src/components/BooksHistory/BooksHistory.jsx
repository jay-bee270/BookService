"use client"

import { useState, useEffect } from "react"
import { Card, List, Tag, Space, Spin } from "antd"
import { BookOutlined, ClockCircleOutlined, UserOutlined } from "@ant-design/icons"
import "./BooksHistory.css"

const BooksHistory = () => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        // Fetch recent books
        const booksRes = await fetch("https://book-services-group-a.onrender.com/api/v1/products")
        const books = await booksRes.json()

        // Generate mock activities based on books
        const mockActivities = books.slice(0, 8).map((book, index) => ({
          id: index + 1,
          type: ["added", "updated", "reviewed", "recommended"][Math.floor(Math.random() * 4)],
          title: book.productTitle,
          author: book.productAuthor || "Unknown Author",
          user: ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson"][Math.floor(Math.random() * 4)],
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          description: book.productDescription?.substring(0, 100) + "..." || "No description available",
        }))

        // Sort by timestamp (newest first)
        mockActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

        setActivities(mockActivities)
      } catch (error) {
        console.error("Error fetching activities:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentActivities()
  }, [])

  const getActivityIcon = (type) => {
    switch (type) {
      case "added":
        return <BookOutlined style={{ color: "#52c41a" }} />
      case "updated":
        return <BookOutlined style={{ color: "#1890ff" }} />
      case "reviewed":
        return <BookOutlined style={{ color: "#faad14" }} />
      case "recommended":
        return <BookOutlined style={{ color: "#722ed1" }} />
      default:
        return <BookOutlined />
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case "added":
        return "success"
      case "updated":
        return "processing"
      case "reviewed":
        return "warning"
      case "recommended":
        return "purple"
      default:
        return "default"
    }
  }

  const getActivityText = (type) => {
    switch (type) {
      case "added":
        return "Added"
      case "updated":
        return "Updated"
      case "reviewed":
        return "Reviewed"
      case "recommended":
        return "Recommended"
      default:
        return "Activity"
    }
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return time.toLocaleDateString()
  }

  if (loading) {
    return (
      <Card title="Recent Activity" className="history-card">
        <div className="history-loading">
          <Spin tip="Loading activities..." />
        </div>
      </Card>
    )
  }

  return (
    <Card title="Recent Activity" className="history-card">
      <List
        itemLayout="horizontal"
        dataSource={activities}
        renderItem={(activity) => (
          <List.Item className="activity-item">
            <div className="activity-content">
              <div className="activity-header">
                <div className="activity-icon">{getActivityIcon(activity.type)}</div>
                <div className="activity-info">
                  <div className="activity-main">
                    <span className="activity-action">
                      <Tag color={getActivityColor(activity.type)} size="small">
                        {getActivityText(activity.type)}
                      </Tag>
                    </span>
                    <span className="activity-title">{activity.title}</span>
                  </div>
                  <div className="activity-meta">
                    <Space size="small">
                      <span className="activity-author">by {activity.author}</span>
                      <span className="activity-separator">•</span>
                      <span className="activity-user">
                        <UserOutlined /> {activity.user}
                      </span>
                      <span className="activity-separator">•</span>
                      <span className="activity-time">
                        <ClockCircleOutlined /> {formatTimeAgo(activity.timestamp)}
                      </span>
                    </Space>
                  </div>
                </div>
              </div>
            </div>
          </List.Item>
        )}
      />
    </Card>
  )
}

export default BooksHistory
