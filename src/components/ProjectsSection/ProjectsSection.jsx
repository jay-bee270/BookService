"use client"

import { Card, Progress, Avatar, Space, Button, Tag, Tooltip } from "antd"
import {
  EyeOutlined,
  EditOutlined,
  CheckOutlined,
  DatabaseOutlined,
  FileAddOutlined,
  WarningOutlined,
  ToolOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons"
import "./ProjectsSection.css"

const ProjectsSection = () => {
  const adminTasks = [
    {
      name: "New Book Submissions Review",
      type: "Content Review",
      progress: 68,
      assignees: ["👤", "👤", "👤"],
      target: "42 submissions",
      completed: "29 reviewed",
      priority: "high",
      status: "in-progress",
      deadline: "Today, 5:00 PM",
    },
    {
      name: "Author Verification Requests",
      type: "User Verification",
      progress: 45,
      assignees: ["👤", "👤"],
      target: "18 requests",
      completed: "8 verified",
      priority: "medium",
      status: "in-progress",
      deadline: "Tomorrow, 12:00 PM",
    },
    {
      name: "Database Optimization",
      type: "System Maintenance",
      progress: 90,
      assignees: ["👤"],
      target: "5 tasks",
      completed: "4 completed",
      priority: "low",
      status: "completing",
      deadline: "Jun 15, 2024",
    },
    {
      name: "Content Flagging Review",
      type: "Moderation",
      progress: 32,
      assignees: ["👤", "👤", "👤", "👤"],
      target: "25 flags",
      completed: "8 resolved",
      priority: "critical",
      status: "delayed",
      deadline: "Overdue: Jun 10, 2024",
    },
  ]

  const getTaskIcon = (type) => {
    switch (type) {
      case "Content Review":
        return <FileAddOutlined />
      case "User Verification":
        return <UserSwitchOutlined />
      case "System Maintenance":
        return <ToolOutlined />
      case "Moderation":
        return <WarningOutlined />
      default:
        return <DatabaseOutlined />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success"
      case "in-progress":
        return "processing"
      case "completing":
        return "success"
      case "delayed":
        return "error"
      case "pending":
        return "default"
      default:
        return "default"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
        return "#ff4d4f"
      case "high":
        return "#fa8c16"
      case "medium":
        return "#1890ff"
      case "low":
        return "#52c41a"
      default:
        return "#d9d9d9"
    }
  }

  const handleTaskAction = (action, taskName) => {
    console.log(`${action} action for task: ${taskName}`)
  }

  const handleAssigneeClick = (taskName, assigneeIndex) => {
    console.log(`Assignee ${assigneeIndex + 1} clicked for task: ${taskName}`)
  }

  return (
    <Card
      title="Admin Tasks"
      extra={<span className="projects-extra">4 pending tasks</span>}
      className="projects-card"
      bodyStyle={{ padding: "20px" }}
    >
      <div className="projects-stats">
        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-value">12</span>
            <span className="stat-label">Open Tasks</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">3</span>
            <span className="stat-label">Critical Priority</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">8</span>
            <span className="stat-label">Due Today</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">76%</span>
            <span className="stat-label">On-time Completion</span>
          </div>
        </div>
      </div>

      <div className="projects-list">
        {adminTasks.map((task, index) => (
          <div key={index} className="project-item">
            <div className="project-header">
              <div className="project-title-section">
                <div className="project-icon" style={{ color: getPriorityColor(task.priority) }}>
                  {getTaskIcon(task.type)}
                </div>
                <div className="project-details">
                  <span className="project-name">{task.name}</span>
                  <div className="project-meta">
                    <Tag color={getStatusColor(task.status)}>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </Tag>
                    <Tooltip title={`Priority: ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`}>
                      <Tag
                        color={
                          task.priority === "critical"
                            ? "red"
                            : task.priority === "high"
                              ? "orange"
                              : task.priority === "medium"
                                ? "blue"
                                : "green"
                        }
                      >
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </Tag>
                    </Tooltip>
                    <span className="project-deadline">{task.deadline}</span>
                  </div>
                </div>
              </div>
              <div className="project-actions">
                <Button
                  type="text"
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => handleTaskAction("view", task.name)}
                />
                <Button
                  type="text"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => handleTaskAction("edit", task.name)}
                />
                <Button
                  type="text"
                  size="small"
                  icon={<CheckOutlined />}
                  onClick={() => handleTaskAction("complete", task.name)}
                />
              </div>
            </div>

            <div className="project-progress-section">
              <div className="progress-info">
                <span className="progress-text">
                  {task.completed} of {task.target}
                </span>
                <span className="progress-percentage">{task.progress}%</span>
              </div>
              <Progress
                percent={task.progress}
                showInfo={false}
                strokeColor={
                  task.priority === "critical"
                    ? "#ff4d4f"
                    : task.priority === "high"
                      ? "#fa8c16"
                      : task.priority === "medium"
                        ? "#1890ff"
                        : "#52c41a"
                }
                className="progress-bar"
              />
            </div>

            <div className="project-footer">
              <div className="project-participants">
                <Space className="participants-avatars">
                  {task.assignees.slice(0, 4).map((assignee, i) => (
                    <Avatar
                      key={i}
                      size="small"
                      className="participant-avatar"
                      style={{
                        backgroundColor: i === 0 ? "#1890ff" : i === 1 ? "#52c41a" : i === 2 ? "#fa8c16" : "#722ed1",
                      }}
                      onClick={() => handleAssigneeClick(task.name, i)}
                    >
                      {assignee}
                    </Avatar>
                  ))}
                  {task.assignees.length > 4 && (
                    <Avatar size="small" className="participant-avatar">
                      +{task.assignees.length - 4}
                    </Avatar>
                  )}
                </Space>
              </div>
              <div className="task-type">
                <Tag color="default">{task.type}</Tag>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default ProjectsSection
