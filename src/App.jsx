"use client"

import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Layout, ConfigProvider } from "antd"
import { ToastContainer } from "react-toastify"
import Sidebar from "./components/Sidebar/Sidebar"
import Dashboard from "./pages/Dashboard/Dashboard"
import BooksPage from "./pages/BooksPage/BooksPage"
import RecommendationsPage from "./pages/RecommendationsPage/RecommendationsPage"
import ReviewsPage from "./pages/ReviewsPage/ReviewsPage"
import SignIn from "./pages/Auth/SignIn"
import "antd/dist/reset.css"
import "react-toastify/dist/ReactToastify.css"
import "./App.css"

const { Content } = Layout

function App() {
  const [collapsed, setCollapsed] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(true) // Set to false for login flow

  const handleLogout = () => {
    setIsAuthenticated(false)
  }

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  if (!isAuthenticated) {
    return <SignIn onLogin={handleLogin} />
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1890ff",
          borderRadius: 8,
        },
      }}
    >
      <Router>
        <Layout className="app-layout">
          <Sidebar collapsed={collapsed} onLogout={handleLogout} />
          <Layout className={`main-layout ${collapsed ? "collapsed" : ""}`}>
            <Content className="main-content">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/books" element={<BooksPage />} />
                <Route path="/recommendations" element={<RecommendationsPage />} />
                <Route path="/reviews" element={<ReviewsPage />} />
                <Route path="/signin" element={<SignIn onLogin={handleLogin} />} />
              </Routes>
            </Content>
          </Layout>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Layout>
      </Router>
    </ConfigProvider>
  )
}

export default App
