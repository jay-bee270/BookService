"use client"

import { Card, Progress, Avatar, Space, Button } from "antd"
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons"
import "./ProjectsSection.css"

const ProjectsSection = () => {
  const projects = [
    {
      name: "Soft UI Shopify Version",
      progress: 60,
      avatars: ["👤", "👤", "👤", "👤"],
      budget: "$14,000",
    },
    {
      name: "Progress Track",
      progress: 10,
      avatars: ["👤", "👤"],
      budget: "$3,000",
    },
    {
      name: "Fix Platform",
      progress: 100,
      avatars: ["👤"],
      budget: "Not set",
    },
  ]

  const handleProjectAction = (action, projectName) => {
    console.log(`${action} action for project: ${projectName}`)
  }

  const handleAvatarClick = (projectName, avatarIndex) => {
    console.log(`Avatar ${avatarIndex + 1} clicked for project: ${projectName}`)
  }

  return (
    <Card
      title="Projects"
      extra={<span className="projects-extra">30 done this month</span>}
      className="projects-card"
      bodyStyle={{ padding: "20px" }}
    >
      <div className="projects-stats">
        <div className="stats-row">
          <span className="stat-value">3.6K</span>
          <span className="stat-value">2m</span>
          <span className="stat-value">$772</span>
          <span className="stat-value">82</span>
        </div>
        <div className="stats-labels">
          <span className="stat-label">Total Users</span>
          <span className="stat-label">Total Clicks</span>
          <span className="stat-label">Total Sales</span>
          <span className="stat-label">Total Items</span>
        </div>
      </div>

      <div className="projects-list">
        {projects.map((project, index) => (
          <div key={index} className="project-item">
            <div className="project-header">
              <span className="project-name">{project.name}</span>
              <div className="project-actions">
                <Button
                  type="text"
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => handleProjectAction("view", project.name)}
                />
                <Button
                  type="text"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => handleProjectAction("edit", project.name)}
                />
                <Button
                  type="text"
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => handleProjectAction("delete", project.name)}
                />
              </div>
              <Space className="project-avatars">
                {project.avatars.map((avatar, i) => (
                  <Avatar
                    key={i}
                    size="small"
                    className="project-avatar"
                    onClick={() => handleAvatarClick(project.name, i)}
                  >
                    {avatar}
                  </Avatar>
                ))}
              </Space>
            </div>
            <div className="project-progress">
              <Progress percent={project.progress} showInfo={false} strokeColor="#1890ff" className="progress-bar" />
              <span className="project-budget">{project.budget}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default ProjectsSection
