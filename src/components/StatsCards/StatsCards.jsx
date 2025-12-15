"use client"

import { useState, useEffect } from "react"
import { Row, Col, Card, Statistic, Spin } from "antd"
import {
  BookOutlined,
  StarOutlined,
  MessageOutlined,
  TrophyOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons"
import "./StatsCards.css"

const StatsCards = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalRecommendations: 0,
    totalReviews: 0,
    averageRating: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch books
        const booksRes = await fetch("http://20.121.232.133:8080/api/v1/products")
        const books = await booksRes.json()

        // Fetch recommendations
        const recsRes = await fetch("http://172.193.176.39:8081/api/books")
        const recommendations = await recsRes.json()

        // Calculate total reviews from all books
        let totalReviews = 0
        let totalRating = 0
        let reviewCount = 0

        for (const book of books) {
          try {
            const reviewRes = await fetch("http://9.169.178.97:8080/reviews/book/1")
            const reviews = await reviewRes.json()
            totalReviews += reviews.length

            reviews.forEach((review) => {
              if (review.rating) {
                totalRating += review.rating
                reviewCount++
              }
            })
          } catch (err) {
            console.log("Error fetching reviews for book:", book.productId)
          }
        }

        setStats({
          totalBooks: books.length,
          totalRecommendations: Array.isArray(recommendations) ? recommendations.length : 0,
          totalReviews,
          averageRating: reviewCount > 0 ? (totalRating / reviewCount).toFixed(1) : 0,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statsData = [
    {
      title: "Total Books",
      value: stats.totalBooks,
      icon: <BookOutlined />,
      color: "#1890ff",
      trend: "up",
      trendValue: 12,
    },
    {
      title: "Recommendations",
      value: stats.totalRecommendations,
      icon: <StarOutlined />,
      color: "#52c41a",
      trend: "up",
      trendValue: 8,
    },
    {
      title: "Total Reviews",
      value: stats.totalReviews,
      icon: <MessageOutlined />,
      color: "#faad14",
      trend: "up",
      trendValue: 15,
    },
    {
      title: "Average Rating",
      value: stats.averageRating,
      icon: <TrophyOutlined />,
      color: "#f5222d",
      trend: "up",
      trendValue: 2.5,
      suffix: "/5",
    },
  ]

  if (loading) {
    return (
      <div className="stats-loading">
        <Spin size="large" tip="Loading statistics..." />
      </div>
    )
  }

  return (
    <Row gutter={[24, 24]} className="stats-cards-container">
      {statsData.map((stat, index) => (
        <Col xs={24} sm={12} lg={6} key={index}>
          <Card className="stats-card" hoverable>
            <div className="stats-card-content">
              <div className="stats-icon" style={{ color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stats-info">
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  suffix={stat.suffix}
                  valueStyle={{
                    color: stat.color,
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                />
                <div className="stats-trend">
                  {stat.trend === "up" ? (
                    <ArrowUpOutlined style={{ color: "#52c41a" }} />
                  ) : (
                    <ArrowDownOutlined style={{ color: "#f5222d" }} />
                  )}
                  <span className={`trend-value ${stat.trend}`}>{stat.trendValue}%</span>
                  <span className="trend-text">vs last month</span>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default StatsCards
