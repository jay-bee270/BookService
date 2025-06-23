"use client"

import { useState, useEffect } from "react"
import { Card, Spin, Empty } from "antd"
import "./BarChart.css"

const BarChart = () => {
  const [hoveredBar, setHoveredBar] = useState(null)
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBooksData = async () => {
      try {
        const res = await fetch("https://book-services-group-a.onrender.com/api/v1/products")
        const books = await res.json()

        if (!books || books.length === 0) {
          setChartData([])
          return
        }

        const booksByAuthor = books.reduce((acc, book) => {
          const author = book.productAuthor || "Unknown Author"
          acc[author] = (acc[author] || 0) + 1
          return acc
        }, {})

        const data = Object.entries(booksByAuthor)
          .map(([author, count]) => ({ author, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10) // Limit for better display

        setChartData(data)
      } catch (error) {
        console.error("Error fetching books data:", error)
        setChartData([])
      } finally {
        setLoading(false)
      }
    }

    fetchBooksData()
  }, [])

  const generateDynamicYAxis = (maxValue) => {
    if (maxValue === 0) return [0]

    // For very small values
    if (maxValue <= 5) {
      return Array.from({ length: maxValue + 1 }, (_, i) => i)
    }

    // Calculate step size for clean intervals
    let step
    if (maxValue <= 10) step = 2
    else if (maxValue <= 20) step = 5
    else if (maxValue <= 50) step = 10
    else if (maxValue <= 100) step = 20
    else if (maxValue <= 200) step = 50
    else if (maxValue <= 500) step = 100
    else if (maxValue <= 1000) step = 200
    else {
      // For larger values, calculate dynamic step
      const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)))
      const normalizedMax = maxValue / magnitude
      if (normalizedMax <= 2) step = 0.5 * magnitude
      else if (normalizedMax <= 5) step = 1 * magnitude
      else step = 2 * magnitude
    }

    const values = []
    for (let i = 0; i <= Math.ceil(maxValue / step) * step; i += step) {
      values.push(i)
      if (i >= maxValue) break
    }

    return values
  }

  if (loading) {
    return (
      <Card className="chart-card">
        <div className="loading-container">
          <Spin size="large" />
          <p>Loading book data...</p>
        </div>
      </Card>
    )
  }

  if (chartData.length === 0) {
    return (
      <Card className="chart-card">
        <Empty description="No book data available" />
      </Card>
    )
  }

  const actualMaxValue = Math.max(...chartData.map((item) => item.count))
  const yAxisValues = generateDynamicYAxis(actualMaxValue)
  const chartMaxValue = Math.max(...yAxisValues)

  return (
    <Card className="chart-card" title="Books by Author Distribution">
      <div className="chart-container">
        {/* Y-Axis */}
        <div className="y-axis">
          {[...yAxisValues].reverse().map((value, index) => (
            <div key={index} className="y-axis-label">
              {value}
            </div>
          ))}
        </div>

        {/* Chart Area */}
        <div className="chart-area">
          {/* Grid Lines */}
          <div className="grid-container">
            {yAxisValues.map((value, index) => (
              <div
                key={index}
                className="grid-line"
                style={{
                  bottom: `${(value / chartMaxValue) * 100}%`,
                }}
              />
            ))}
          </div>

          {/* Bars Container - bars grow from bottom */}
          <div className="bars-container">
            {chartData.map((item, index) => {
              const heightPercentage = (item.count / chartMaxValue) * 100
              const isHovered = hoveredBar === index

              return (
                <div key={index} className="bar-column">
                  {/* Bar grows from bottom */}
                  <div className="bar-space">
                    <div
                      className={`bar ${isHovered ? "bar-hovered" : ""}`}
                      style={{
                        height: `${heightPercentage}%`,
                      }}
                      onMouseEnter={() => setHoveredBar(index)}
                      onMouseLeave={() => setHoveredBar(null)}
                      title={`${item.author}: ${item.count} books`}
                    >
                      <div className="bar-value">{item.count}</div>
                    </div>
                  </div>

                  {/* X-axis label */}
                  <div className="x-axis-label">
                    <span className="author-full" title={item.author}>
                      {item.author.length > 12 ? `${item.author.substring(0, 12)}...` : item.author}
                    </span>
                    <span className="author-short">
                      {item.author
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .substring(0, 2)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="chart-footer">
        <p>
          Dynamic range: 0 - {chartMaxValue} | Data range: 0 - {actualMaxValue}
        </p>
      </div>
    </Card>
  )
}

export default BarChart
