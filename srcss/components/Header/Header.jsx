"use client"

import { Layout, Input, Badge, Avatar, Space } from "antd"
import { SearchOutlined, BellOutlined, UserOutlined } from "@ant-design/icons"
import "./Header.css"

const { Header: AntHeader } = Layout

const Header = () => {
  const handleSearch = (value) => {
    console.log("Search:", value)
  }

  const handleNotificationClick = () => {
    console.log("Notifications clicked")
  }

  const handleProfileClick = () => {
    console.log("Profile clicked")
  }

  return (
    <AntHeader className="header-container">
      <div className="header-left">
        <div className="header-logo">📊 Muse Dashboard</div>
        <div className="header-nav">
          <span className="nav-item active">Dashboard</span>
          <span className="nav-item">Dashboard</span>
        </div>
      </div>

      <Space size="large" className="header-right">
        <Input
          placeholder="Type here..."
          prefix={<SearchOutlined />}
          className="header-search"
          onPressEnter={(e) => handleSearch(e.target.value)}
        />
        <Badge count={5} className="header-notification">
          <BellOutlined className="notification-icon" onClick={handleNotificationClick} />
        </Badge>
        <Avatar icon={<UserOutlined />} className="header-avatar" onClick={handleProfileClick} />
      </Space>
    </AntHeader>
  )
}

export default Header
