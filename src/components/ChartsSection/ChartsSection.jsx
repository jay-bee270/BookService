"use client"

import { useState, useEffect } from "react"
import { Card, Row, Col, Select, Spin } from "antd"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import "./ChartsSection.css"

const { Option } = Select

const COLORS = ["#1890ff", "#52c41a", "#faad14", "#f5222d", "#722ed1", "#13c2c2"]

const ChartsSection = () => {
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState({
    booksPerMonth: [],
    reviewsDistribution: [],
    ratingsOverTime: [],
  })

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        // Fetch books
        const booksRes = await fetch("http://20.121.232.133:8080/api/v1/products")
        const books = await booksRes.json()

        // Generate mock data for charts
        const booksPerMonth = [
          { month: "Jan", books: Math.floor(Math.random() * 20) + 10 },
          { month: "Feb", books: Math.floor(Math.random() * 20) + 10 },
          { month: "Mar", books: Math.floor(Math.random() * 20) + 10 },
          { month: "Apr", books: Math.floor(Math.random() * 20) + 10 },
          { month: "May", books: Math.floor(Math.random() * 20) + 10 },
          { month: "Jun", books: Math.floor(Math.random() * 20) + 10 },
        ]

        const reviewsDistribution = [
          { name: "5 Stars", value: Math.floor(Math.random() * 50) + 20 },
          { name: "4 Stars", value: Math.floor(Math.random() * 40) + 15 },
          { name: "3 Stars", value: Math.floor(Math.random() * 30) + 10 },
          { name: "2 Stars", value: Math.floor(Math.random() * 20) + 5 },
          { name: "1 Star", value: Math.floor(Math.random() * 10) + 2 },
        ]

        const ratingsOverTime = [
          { month: "Jan", rating: 4.2 },
          { month: "Feb", rating: 4.1 },
          { month: "Mar", rating: 4.3 },
          { month: "Apr", rating: 4.4 },
          { month: "May", rating: 4.2 },
          { month: "Jun", rating: 4.5 },
        ]

        setChartData({
          booksPerMonth,
          reviewsDistribution,
          ratingsOverTime,
        })
      } catch (error) {
        console.error("Error fetching chart data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [])

  if (loading) {
    return (
      <div className="charts-loading">
        <Spin size="large" tip="Loading charts..." />
      </div>
    )
  }

  return (
    <div className="charts-section">
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Books Added Per Month" className="chart-card">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.booksPerMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="books" fill="#1890ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Reviews Distribution" className="chart-card">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.reviewsDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.reviewsDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24}>
          <Card title="Average Rating Over Time" className="chart-card">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.ratingsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rating"
                  stroke="#52c41a"
                  strokeWidth={3}
                  dot={{ fill: "#52c41a", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ChartsSection
