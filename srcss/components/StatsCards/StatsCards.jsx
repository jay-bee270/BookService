"use client"

import { useState, useEffect } from "react"
import { Row, Col, Card, Statistic, Tooltip, Spin } from "antd"
import { ArrowUpOutlined, ArrowDownOutlined, InfoCircleOutlined } from "@ant-design/icons"
import "./StatsCards.css"

const StatsCards = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState([])

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const res = await fetch("https://book-services-group-a.onrender.com/api/v1/products")
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      setBooks(data)
      calculateStats(data)
      setError(null)
    } catch (err) {
      setError(err.message || "Failed to fetch books")
      console.error("Error fetching books:", err)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (booksData) => {
    // Calculate total books
    const totalBooks = booksData.length

    // Calculate unique authors
    const uniqueAuthors = new Set(
      booksData.map((book) => book.productAuthor).filter((author) => author && author.trim() !== ""),
    ).size

    // Calculate books with descriptions (as a proxy for "complete" books)
    const booksWithDescriptions = booksData.filter(
      (book) => book.productDescription && book.productDescription.trim() !== "",
    ).length

    // Calculate average description length (as a quality metric)
    const avgDescriptionLength =
      booksData.reduce((sum, book) => {
        return sum + (book.productDescription ? book.productDescription.length : 0)
      }, 0) / totalBooks

    // Simulate some trends (in a real app, you'd compare with historical data)
    const simulatedTrends = {
      totalBooks: Math.random() > 0.5 ? "up" : "down",
      authors: Math.random() > 0.3 ? "up" : "down",
      complete: Math.random() > 0.4 ? "up" : "down",
      quality: Math.random() > 0.6 ? "up" : "down",
    }

    const calculatedStats = [
      {
        title: "Total Books",
        value: totalBooks,
        prefix: "",
        suffix: "",
        trend: simulatedTrends.totalBooks,
        trendValue: simulatedTrends.totalBooks === "up" ? "+12%" : "-5%",
        icon: "📚",
        color: "#667eea",
        description: "Books in collection",
        tooltip: "Total number of books in the library collection including all genres and formats",
      },
      {
        title: "Total Authors",
        value: uniqueAuthors,
        prefix: "",
        suffix: "",
        trend: simulatedTrends.authors,
        trendValue: simulatedTrends.authors === "up" ? "+8%" : "-2%",
        icon: "✍️",
        color: "#fa541c",
        description: "Unique authors",
        tooltip: "Number of unique authors represented in the collection",
      },
      {
        title: "Complete Books",
        value: booksWithDescriptions,
        prefix: "",
        suffix: "",
        trend: simulatedTrends.complete,
        trendValue: simulatedTrends.complete === "up" ? "+15%" : "-3%",
        icon: "✅",
        color: "#52c41a",
        description: "With descriptions",
        tooltip: "Books that have complete information including descriptions",
      },
      {
        title: "Avg Description",
        value: Math.round(avgDescriptionLength),
        prefix: "",
        suffix: " chars",
        trend: simulatedTrends.quality,
        trendValue: simulatedTrends.quality === "up" ? "+7%" : "-4%",
        icon: "📝",
        color: "#722ed1",
        description: "Content quality",
        tooltip: "Average length of book descriptions, indicating content richness",
      },
    ]

    setStats(calculatedStats)
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const handleCardClick = (title) => {
    console.log(`${title} card clicked - Navigate to detailed ${title.toLowerCase()} view`)
    // Navigation logic based on the card clicked
    switch (title) {
      case "Total Books":
        console.log("Navigate to books overview")
        break
      case "Total Authors":
        console.log("Navigate to authors list")
        break
      case "Complete Books":
        console.log("Navigate to complete books")
        break
      case "Avg Description":
        console.log("Navigate to content quality analysis")
        break
      default:
        break
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
        <Spin size="large" tip="Loading statistics..." />
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <Card>
          <p style={{ color: "#ff4d4f" }}>Error loading statistics: {error}</p>
          <button onClick={fetchBooks} style={{ marginTop: "10px" }}>
            Retry
          </button>
        </Card>
      </div>
    )
  }

  return (
    <Row gutter={[24, 24]} className="stats-cards-container">
      {stats.map((stat, index) => (
        <Col span={6} key={index}>
          <Card className="stats-card" bodyStyle={{ padding: "20px" }} onClick={() => handleCardClick(stat.title)}>
            <div className="stats-card-content">
              <div className="stats-info">
                <div className="stats-header">
                  <div className="stats-title">{stat.title}</div>
                  <Tooltip title={stat.tooltip}>
                    <InfoCircleOutlined className="stats-info-icon" />
                  </Tooltip>
                </div>
                <Statistic value={stat.value} prefix={stat.prefix} suffix={stat.suffix} className="stats-value" />
                <div className={`stats-trend ${stat.trend}`}>
                  {stat.trend === "up" ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {stat.trendValue}
                  <span className="trend-period">vs last month</span>
                </div>
                <div className="stats-description">{stat.description}</div>
              </div>
              <div className="stats-icon" style={{ background: stat.color }}>
                {stat.icon}
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default StatsCards
