import { Row, Col, Card } from "antd"
import BarChart from "../BarChart/BarChart"
import LineChart from "../LineChart/LineChart"
import "./ChartsSection.css"

const ChartsSection = () => {
  return (
    <Row gutter={[24, 24]} className="charts-section">
      <Col span={12}>
        <Card title="Active Users" className="chart-card" bodyStyle={{ padding: "20px" }}>
          <BarChart />
        </Card>
      </Col>
      <Col span={12}>
        <Card
          title="Active Users"
          extra={<span className="chart-extra">than last week +30%</span>}
          className="chart-card"
          bodyStyle={{ padding: "20px" }}
        >
          <LineChart />
        </Card>
      </Col>
    </Row>
  )
}

export default ChartsSection
