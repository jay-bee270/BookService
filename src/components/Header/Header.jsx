"use client"

import { Layout, Input, Badge, Avatar, Space, Button } from "antd"
import { SearchOutlined, BellOutlined, UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons"
import "./Header.css"

const { Header: AntHeader } = Layout

const Header = ({ onCollapse, collapsed }) => {
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
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => onCollapse(!collapsed)}
          className="collapse-button"
        />
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
