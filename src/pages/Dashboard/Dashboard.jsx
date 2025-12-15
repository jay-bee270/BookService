import { Row, Col } from "antd"
import StatsCards from "../../components/StatsCards/StatsCards"
import ChartsSection from "../../components/ChartsSection/ChartsSection"
import ProjectsSection from "../../components/ProjectsSection/ProjectsSection"
import BooksHistory from "../../components/BooksHistory/BooksHistory"
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
        <Col xs={24} lg={12}>
          <ProjectsSection />
        </Col>
        <Col xs={24} lg={12}>
          <BooksHistory />
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
