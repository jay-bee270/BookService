"use client"
import { Layout, Menu, Modal } from "antd"
import {
  DashboardOutlined,
  AppstoreOutlined,
  BookOutlined,
  StarOutlined,
  MessageOutlined,
  HeartOutlined,
  LogoutOutlined
} from "@ant-design/icons"
import { useNavigate, useLocation } from "react-router-dom"
import "./Sidebar.css"
import { useState } from "react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const { Sider } = Layout

function Sidebar({ collapsed, onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  const getSelectedKey = () => {
    const path = location.pathname
    if (path === "/" || path === "/dashboard") return "1"
    // if (path === "/composite") return "2"
    if (path === "/books") return "3"
    if (path === "/recommendations") return "4"
    if (path === "/reviews") return "5"
    return "1"
  }

  const handleLogout = () => {
    // Call parent logout handler
    onLogout()
    
    // Show success message
    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 2000,
    })

    // Redirect to login page
    navigate("/signin", { replace: true })

    // Close the modal
    setIsLogoutModalOpen(false)
  }

  // ... rest of your Sidebar component remains the same ...
  const handleMenuClick = (e) => {
    const { key } = e
    switch (key) {
      case "1":
        navigate("/dashboard")
        break
      // case "2":
      //   navigate("/composite")
      //   break
      case "3":
        navigate("/books")
        break
      case "4":
        navigate("/recommendations")
        break
      case "5":
        navigate("/reviews")
        break
      case "6":
        setIsLogoutModalOpen(true)
        break
      default:
        break
    }
  }

  const menuItems = [
    {
      key: "main-section",
      label: "MAIN NAVIGATION",
      type: "group",
      children: [
        { key: "1", icon: <DashboardOutlined />, label: "Dashboard" },
        // { key: "2", icon: <AppstoreOutlined />, label: "Composite" },
        { key: "3", icon: <BookOutlined />, label: "Books" },
        { key: "4", icon: <StarOutlined />, label: "Recommendations" },
        { key: "5", icon: <MessageOutlined />, label: "Reviews" },
      ],
    },
    { type: "divider" },
    {
      key: "account-section",
      label: "ACCOUNT",
      type: "group",
      children: [
        {
          key: "6",
          icon: <LogoutOutlined />,
          label: "Logout",
          danger: true,
        },
      ],
    },
  ]

  return (
    <>
      <Sider width={250} collapsible collapsed={collapsed} className="dashboard-sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">📚</div>
          {!collapsed && (
            <div className="logo-content">
              <span className="logo-title">Book Dashboard</span>
              <span className="logo-subtitle">Management System</span>
            </div>
          )}
        </div>

        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          className="sidebar-menu"
          onClick={handleMenuClick}
        />

        {!collapsed && (
          <div className="sidebar-upgrade">
            <div className="upgrade-card">
              <div className="upgrade-icon">
                <HeartOutlined />
              </div>
              <h4>Discover Books</h4>
              <p>Explore personalized recommendations and reviews</p>
              <button className="upgrade-btn" onClick={() => navigate("/recommendations")}>
                EXPLORE NOW
              </button>
            </div>
          </div>
        )}
      </Sider>

      <Modal
        title="Confirm Logout"
        open={isLogoutModalOpen}
        onOk={handleLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
        okText="Logout"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to log out?</p>
      </Modal>
    </>
  )
}

export default Sidebar