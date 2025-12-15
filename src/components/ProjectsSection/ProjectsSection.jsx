import { Card, List, Progress, Tag, Space } from "antd"
import { BookOutlined, UserOutlined, CalendarOutlined } from "@ant-design/icons"
import "./ProjectsSection.css"

const ProjectsSection = () => {
  const projects = [
    {
      id: 1,
      title: "Fiction Collection Expansion",
      description: "Adding new contemporary fiction books to our collection",
      progress: 75,
      status: "In Progress",
      assignee: "John Doe",
      dueDate: "2024-02-15",
      priority: "High",
    },
    {
      id: 2,
      title: "Review System Enhancement",
      description: "Improving the book review and rating system",
      progress: 45,
      status: "In Progress",
      assignee: "Jane Smith",
      dueDate: "2024-02-20",
      priority: "Medium",
    },
    {
      id: 3,
      title: "Recommendation Algorithm",
      description: "Developing AI-powered book recommendation system",
      progress: 90,
      status: "Almost Done",
      assignee: "Mike Johnson",
      dueDate: "2024-01-30",
      priority: "High",
    },
    {
      id: 4,
      title: "Mobile App Integration",
      description: "Creating mobile app for book management",
      progress: 20,
      status: "Planning",
      assignee: "Sarah Wilson",
      dueDate: "2024-03-15",
      priority: "Low",
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "processing"
      case "Almost Done":
        return "success"
      case "Planning":
        return "default"
      default:
        return "default"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "red"
      case "Medium":
        return "orange"
      case "Low":
        return "green"
      default:
        return "default"
    }
  }

  return (
    <Card title="Active Projects" className="projects-card">
      <List
        itemLayout="vertical"
        dataSource={projects}
        renderItem={(project) => (
          <List.Item className="project-item">
            <div className="project-content">
              <div className="project-header">
                <div className="project-title-section">
                  <BookOutlined className="project-icon" />
                  <div>
                    <h4 className="project-title">{project.title}</h4>
                    <p className="project-description">{project.description}</p>
                  </div>
                </div>
                <div className="project-tags">
                  <Tag color={getStatusColor(project.status)}>{project.status}</Tag>
                  <Tag color={getPriorityColor(project.priority)}>{project.priority}</Tag>
                </div>
              </div>

              <div className="project-progress">
                <Progress
                  percent={project.progress}
                  size="small"
                  strokeColor={{
                    "0%": "#108ee9",
                    "100%": "#87d068",
                  }}
                />
              </div>

              <div className="project-meta">
                <Space>
                  <span className="project-assignee">
                    <UserOutlined /> {project.assignee}
                  </span>
                  <span className="project-due-date">
                    <CalendarOutlined /> {project.dueDate}
                  </span>
                </Space>
              </div>
            </div>
          </List.Item>
        )}
      />
    </Card>
  )
}

export default ProjectsSection
