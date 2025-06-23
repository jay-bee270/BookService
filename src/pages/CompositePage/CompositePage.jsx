import { Card, Row, Col } from "antd"
import "./CompositePage.css"

const CompositePage = () => {
  return (
    <div className="composite-page">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card title="Composite View" className="composite-card">
            <p>This is the composite page where you can view combined data and analytics.</p>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default CompositePage
