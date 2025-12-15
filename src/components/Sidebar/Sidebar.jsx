"use client"
import { Layout, Menu, Modal, Button } from "antd"
import {
  DashboardOutlined,
  BookOutlined,
  StarOutlined,
  MessageOutlined,
  HeartOutlined,
  LogoutOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons"
import { useNavigate, useLocation } from "react-router-dom"
import "./Sidebar.css"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const { Sider } = Layout

function Sidebar({ collapsed, onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
      if (window.innerWidth > 768) {
        setMobileOpen(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const getSelectedKey = () => {
    const path = location.pathname
    if (path === "/" || path === "/dashboard") return "1"
    if (path === "/books") return "3"
    if (path === "/recommendations") return "4"
    if (path === "/reviews") return "5"
    return "1"
  }

  const handleLogout = () => {
    onLogout()
    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 2000,
    })
    navigate("/signin", { replace: true })
    setIsLogoutModalOpen(false)
  }

  const handleMenuClick = (e) => {
    const { key } = e
    switch (key) {
      case "1":
        navigate("/dashboard")
        break
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
        { key: "3", icon: <BookOutlined />, label: "Books" },
        { key: "4", icon: <StarOutlined />, label: "Recommendations" },
        { key: "5", icon: <MessageOutlined />, label: "Reviews" },
      ],
    },
    { type: "divider" },
    
  ]

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      {isMobile && (
        <Button
          className="mobile-menu-toggle"
          icon={mobileOpen ? <CloseOutlined /> : <MenuOutlined />}
          onClick={() => setMobileOpen(!mobileOpen)}
          type="primary"
        />
      )}

      {/* Overlay for mobile */}
      {isMobile && mobileOpen && (
        <div 
          className="sidebar-overlay active"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sider 
        width={250} 
        collapsible={!isMobile}
        collapsed={!isMobile && collapsed}
        className={`dashboard-sidebar ${isMobile && mobileOpen ? 'mobile-open' : ''}`}
        trigger={null}
      >
        <div className="sidebar-logo">
          <div className="logo-icon">📚</div>
          {(!collapsed || isMobile) && (
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

        {(!collapsed || isMobile) && (
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