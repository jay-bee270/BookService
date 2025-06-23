import { Layout } from "antd"
import Header from "./components/Header/Header"
import Sidebar from "./components/Sidebar/Sidebar"
import Dashboard from "./Pages/Dashboard/Dashboard"
import "./App.css"

const { Content } = Layout

function App() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Header />
        <Content style={{ margin: "24px 16px", padding: 24, background: "#f0f2f5" }}>
          <Dashboard />
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
