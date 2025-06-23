"use client"

import { useState } from "react"
import "./LineChart.css"

const LineChart = () => {
  const [hoveredLine, setHoveredLine] = useState(null)
  const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"]

  const handleLineClick = (lineIndex) => {
    console.log(`Line ${lineIndex + 1} clicked`)
  }

  return (
    <div className="line-chart-container">
      <svg width="100%" height="100%" viewBox="0 0 400 200" className="line-chart-svg">
        {/* Blue line */}
        <path
          d="M 20 150 Q 60 120 100 140 T 180 100 T 260 120 T 340 80 T 380 90"
          className={`chart-line blue-line ${hoveredLine === 0 ? "hovered" : ""}`}
          onMouseEnter={() => setHoveredLine(0)}
          onMouseLeave={() => setHoveredLine(null)}
          onClick={() => handleLineClick(0)}
        />
        {/* Green line */}
        <path
          d="M 20 170 Q 60 160 100 150 T 180 130 T 260 140 T 340 110 T 380 120"
          className={`chart-line green-line ${hoveredLine === 1 ? "hovered" : ""}`}
          onMouseEnter={() => setHoveredLine(1)}
          onMouseLeave={() => setHoveredLine(null)}
          onClick={() => handleLineClick(1)}
        />
        {/* Purple line */}
        <path
          d="M 20 160 Q 60 140 100 160 T 180 120 T 260 130 T 340 100 T 380 110"
          className={`chart-line purple-line ${hoveredLine === 2 ? "hovered" : ""}`}
          onMouseEnter={() => setHoveredLine(2)}
          onMouseLeave={() => setHoveredLine(null)}
          onClick={() => handleLineClick(2)}
        />
      </svg>

      <div className="month-labels">
        {months.map((month, index) => (
          <span key={index} className="month-label">
            {month}
          </span>
        ))}
      </div>
    </div>
  )
}

export default LineChart
