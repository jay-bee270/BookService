import { Row, Col } from "antd"
import StatsCards from "../../components/StatsCards/StatsCards"
import ChartsSection from "../../components/ChartsSection/ChartsSection"
import ProjectsSection from "../../components/ProjectsSection/ProjectsSection"
import OrdersHistory from "../../components/OrdersHistory/OrdersHistory"
import "./Dashboard.css"

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <StatsCards />
      <Row gutter={[24, 24]} className="dashboard-row">
        <Col span={24}>
          <ChartsSection />
        </Col>
      </Row>
      <Row gutter={[24, 24]} className="dashboard-row">
        <Col span={12}>
          <ProjectsSection />
        </Col>
        <Col span={12}>
          <OrdersHistory />
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
