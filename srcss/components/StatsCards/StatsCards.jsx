"use client"

import { Row, Col, Card, Statistic } from "antd"
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons"
import "./StatsCards.css"

const StatsCards = () => {
  const stats = [
    {
      title: "Today's Money",
      value: 53000,
      prefix: "$",
      suffix: "",
      trend: "up",
      trendValue: "+55%",
      icon: "💰",
      color: "#1890ff",
    },
    {
      title: "Today's Users",
      value: 3200,
      trend: "up",
      trendValue: "+3%",
      icon: "👥",
      color: "#52c41a",
    },
    {
      title: "New Clients",
      value: 1200,
      prefix: "+",
      trend: "down",
      trendValue: "-2%",
      icon: "📊",
      color: "#fa541c",
    },
    {
      title: "Sales",
      value: 13200,
      prefix: "$",
      trend: "up",
      trendValue: "+5%",
      icon: "🛒",
      color: "#722ed1",
    },
  ]

  const handleCardClick = (title) => {
    console.log(`${title} card clicked`)
  }

  return (
    <Row gutter={[24, 24]} className="stats-cards-container">
      {stats.map((stat, index) => (
        <Col span={6} key={index}>
          <Card className="stats-card" bodyStyle={{ padding: "20px" }} onClick={() => handleCardClick(stat.title)}>
            <div className="stats-card-content">
              <div className="stats-info">
                <div className="stats-title">{stat.title}</div>
                <Statistic value={stat.value} prefix={stat.prefix} suffix={stat.suffix} className="stats-value" />
                <div className={`stats-trend ${stat.trend}`}>
                  {stat.trend === "up" ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {stat.trendValue}
                </div>
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
