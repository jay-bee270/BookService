"use client"

import { useState } from "react"
import "./BarChart.css"

const BarChart = () => {
  const [hoveredBar, setHoveredBar] = useState(null)
  const data = [40, 60, 80, 45, 70, 55, 85, 65, 75, 90, 50, 95]
  const maxValue = Math.max(...data)

  const handleBarClick = (index, value) => {
    console.log(`Bar ${index + 1} clicked with value: ${value}`)
  }

  return (
    <div className="bar-chart-container">
      {data.map((value, index) => (
        <div
          key={index}
          className={`bar ${hoveredBar === index ? "hovered" : ""}`}
          style={{
            height: `${(value / maxValue) * 100}%`,
          }}
          onMouseEnter={() => setHoveredBar(index)}
          onMouseLeave={() => setHoveredBar(null)}
          onClick={() => handleBarClick(index, value)}
          title={`Value: ${value}`}
        />
      ))}
    </div>
  )
}

export default BarChart
