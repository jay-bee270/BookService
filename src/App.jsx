"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Layout } from "antd"
import Header from "./components/Header/Header.jsx"
import Sidebar from "./components/Sidebar/Sidebar.jsx"
import Dashboard from "./pages/Dashboard/Dashboard.jsx"
import "./App.css"

// Import page components
import BooksPage from "./pages/BooksPage/BooksPage.jsx"
// import CompositePage from "./pages/CompositePage/CompositePage.jsx"
import RecommendationsPage from "./pages/RecommendationsPage/RecommendationsPage.jsx"
import ReviewsPage from "./pages/ReviewsPage/ReviewsPage.jsx"
import SignInPage from "./pages/SignInPage/SignInPage.jsx"
import SignUpPage from "./pages/SignUpPage/SignUpPage.jsx"

const { Content } = Layout

function App() {
  const [collapsed, setCollapsed] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check for existing token on initial load
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    setIsAuthenticated(!!token)
  }, [])

  // Handle authentication state changes
  const handleAuthentication = (status) => {
    setIsAuthenticated(status)
    if (!status) {
      // Clear all auth data on logout
      localStorage.removeItem("authToken")
      localStorage.removeItem("userData")
    }
  }

  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        {isAuthenticated && <Sidebar collapsed={collapsed} onLogout={() => handleAuthentication(false)} />}
        <Layout style={{ marginLeft: isAuthenticated ? (collapsed ? 80 : 250) : 0, transition: "margin-left 0.2s" }}>
          {isAuthenticated && (
            <Header 
              onCollapse={setCollapsed} 
              collapsed={collapsed} 
              onLogout={() => handleAuthentication(false)} 
            />
          )}
          <Content style={{ margin: "24px 16px", padding: 24, background: "#f0f2f5" }}>
            <Routes>
              <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/signin"} replace />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                isAuthenticated ? <Dashboard /> : <Navigate to="/signin" replace />
              } />
              {/* <Route path="/composite" element={
                isAuthenticated ? <CompositePage /> : <Navigate to="/signin" replace />
              } /> */}
              <Route path="/books" element={
                isAuthenticated ? <BooksPage /> : <Navigate to="/signin" replace />
              } />
              <Route path="/recommendations" element={
                isAuthenticated ? <RecommendationsPage /> : <Navigate to="/signin" replace />
              } />
              <Route path="/reviews" element={
                isAuthenticated ? <ReviewsPage /> : <Navigate to="/signin" replace />
              } />

              {/* Auth Routes */}
              <Route path="/signin" element={
                !isAuthenticated ? 
                  <SignInPage setIsAuthenticated={handleAuthentication} /> : 
                  <Navigate to="/dashboard" replace />
              } />
              <Route path="/signup" element={
                !isAuthenticated ? 
                  <SignUpPage /> : 
                  <Navigate to="/dashboard" replace />
              } />

              {/* Catch-all route */}
              <Route path="*" element={
                <Navigate to={isAuthenticated ? "/dashboard" : "/signin"} replace />
              } />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  )
}

export default App