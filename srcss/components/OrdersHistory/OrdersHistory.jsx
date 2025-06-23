"use client"

import { Card, Badge, Button } from "antd"
import { EyeOutlined, MoreOutlined } from "@ant-design/icons"
import "./OrdersHistory.css"

const OrdersHistory = () => {
  const orders = [
    {
      id: "#MS-415646",
      amount: "$4,200",
      status: "success",
      statusText: "Paid",
      date: "23 DEC 7:20 PM",
    },
    {
      id: "New order #1832412",
      amount: "",
      status: "processing",
      statusText: "Processing",
      date: "18 DEC 11:13 PM",
    },
    {
      id: "Complete server payments",
      amount: "",
      status: "default",
      statusText: "Pending",
      date: "18 DEC 9:53 PM",
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "#52c41a"
      case "processing":
        return "#1890ff"
      default:
        return "#d9d9d9"
    }
  }

  const handleOrderClick = (orderId) => {
    console.log(`Order clicked: ${orderId}`)
  }

  const handleViewOrder = (orderId) => {
    console.log(`View order: ${orderId}`)
  }

  const handleMoreActions = (orderId) => {
    console.log(`More actions for order: ${orderId}`)
  }

  return (
    <Card title="Orders History" className="orders-card" bodyStyle={{ padding: "20px" }}>
      <div className="orders-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item" onClick={() => handleOrderClick(order.id)}>
            <div className="order-content">
              <div className="order-info">
                <div className="order-id">{order.id}</div>
                {order.amount && <div className="order-amount">{order.amount}</div>}
                {order.date && <div className="order-date">{order.date}</div>}
              </div>
              <div className="order-actions">
                <Button
                  type="text"
                  size="small"
                  icon={<EyeOutlined />}
                  className="action-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleViewOrder(order.id)
                  }}
                />
                <Button
                  type="text"
                  size="small"
                  icon={<MoreOutlined />}
                  className="action-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleMoreActions(order.id)
                  }}
                />
              </div>
              <Badge color={getStatusColor(order.status)} text={order.statusText} className="order-status" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default OrdersHistory
