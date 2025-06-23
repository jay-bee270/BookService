"use client"

import { useState } from "react"
import { Layout, Menu, Card, Button } from "antd"
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  TeamOutlined,
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons"
import "./Sidebar.css"

const { Sider } = Layout

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "2",
      icon: <ShoppingCartOutlined />,
      label: "Sales",
    },
    {
      key: "3",
      icon: <FileTextOutlined />,
      label: "Billing",
    },
    {
      key: "4",
      icon: <TeamOutlined />,
      label: "RTL",
    },
    {
      key: "5",
      icon: <BarChartOutlined />,
      label: "Profile",
    },
    {
      key: "6",
      icon: <UserOutlined />,
      label: "Sign In",
    },
    {
      key: "7",
      icon: <LogoutOutlined />,
      label: "Sign Up",
    },
  ]

  const handleMenuClick = (e) => {
    console.log("Menu clicked:", e.key)
  }

  const handleDocumentationClick = () => {
    console.log("Documentation clicked")
    window.open("https://ant.design/docs/react/introduce", "_blank")
  }

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} className="sidebar-container" width={250}>
      <div className="sidebar-content">
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={menuItems}
          className="sidebar-menu"
          onClick={handleMenuClick}
        />

        <Card className="help-card" bodyStyle={{ padding: "16px" }}>
          <div className="help-content">
            <div className="help-title">Need Help?</div>
            <div className="help-subtitle">Please check our docs</div>
            <Button type="primary" ghost size="small" className="help-button" onClick={handleDocumentationClick}>
              DOCUMENTATION
            </Button>
          </div>
        </Card>
      </div>
    </Sider>
  )
}

export default Sidebar
