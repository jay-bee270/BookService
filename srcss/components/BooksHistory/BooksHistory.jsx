"use client"

import { Card, Badge, Button, Avatar, Tooltip, Tag } from "antd"
import {
  EyeOutlined,
  UndoOutlined,
  UserOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons"
import "./BooksHistory.css"

const BooksHistory = () => {
  const adminActions = [
    {
      id: "ACT-2024-001",
      action: "Book Added",
      details: "The Midnight Library by Matt Haig",
      admin: "admin.johnson",
      adminName: "Sarah Johnson",
      timestamp: "Today, 2:20 PM",
      status: "success",
      statusText: "Completed",
      actionType: "add",
      category: "Fiction",
      isbn: "9780525559474",
    },
    {
      id: "ACT-2024-002",
      action: "Book Edited",
      details: "Atomic Habits - Updated description",
      admin: "admin.smith",
      adminName: "John Smith",
      timestamp: "Today, 11:45 AM",
      status: "success",
      statusText: "Completed",
      actionType: "edit",
      category: "Self-Help",
      isbn: "9781847941831",
    },
    {
      id: "ACT-2024-003",
      action: "User Suspended",
      details: "user.thompson - Policy violation",
      admin: "admin.davis",
      adminName: "Mike Davis",
      timestamp: "Yesterday, 4:30 PM",
      status: "warning",
      statusText: "Requires Review",
      actionType: "suspend",
      category: "User Management",
      duration: "7 days",
    },
    {
      id: "ACT-2024-004",
      action: "Book Deleted",
      details: "Duplicate entry: Project Hail Mary",
      admin: "admin.wilson",
      adminName: "Emily Wilson",
      timestamp: "Jun 10, 2:15 PM",
      status: "error",
      statusText: "Irreversible",
      actionType: "delete",
      category: "Sci-Fi",
      isbn: "9780593135204",
    },
    {
      id: "ACT-2024-005",
      action: "Category Added",
      details: "New category: Graphic Novels",
      admin: "admin.johnson",
      adminName: "Sarah Johnson",
      timestamp: "Jun 9, 10:20 AM",
      status: "success",
      statusText: "Completed",
      actionType: "system",
      category: "System",
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "#52c41a"
      case "processing":
        return "#1890ff"
      case "warning":
        return "#faad14"
      case "error":
        return "#ff4d4f"
      default:
        return "#d9d9d9"
    }
  }

  const getActionIcon = (type) => {
    switch (type) {
      case "add":
        return <PlusOutlined style={{ color: "#52c41a" }} />
      case "edit":
        return <EditOutlined style={{ color: "#1890ff" }} />
      case "delete":
        return <DeleteOutlined style={{ color: "#ff4d4f" }} />
      case "suspend":
        return <LockOutlined style={{ color: "#faad14" }} />
      case "unsuspend":
        return <UnlockOutlined style={{ color: "#52c41a" }} />
      case "system":
        return <EditOutlined style={{ color: "#722ed1" }} />
      default:
        return <EditOutlined />
    }
  }

  const handleActionClick = (actionId) => {
    console.log(`Admin action clicked: ${actionId}`)
  }

  const handleViewAction = (actionId) => {
    console.log(`View admin action: ${actionId}`)
  }

  const handleUndoAction = (actionId, actionType) => {
    if (actionType === "delete") {
      console.log(`Cannot undo delete action: ${actionId}`)
      return
    }
    console.log(`Undo admin action: ${actionId}`)
  }

  return (
    <Card title="Admin Activity Log" className="books-history-card" bodyStyle={{ padding: "20px" }}>
      <div className="books-history-list">
        {adminActions.map((activity, index) => (
          <div key={index} className="book-activity-item" onClick={() => handleActionClick(activity.id)}>
            <div className="activity-content">
              <div className="activity-header">
                <div className="activity-icon">{getActionIcon(activity.actionType)}</div>
                <div className="activity-info">
                  <div className="activity-title">{activity.action}</div>
                  <div className="activity-details">{activity.details}</div>
                  <div className="activity-meta">
                    <Tooltip title={activity.adminName}>
                      <div className="activity-admin">
                        <Avatar size="small" icon={<UserOutlined />} />
                        <span>{activity.admin}</span>
                      </div>
                    </Tooltip>
                    <span className="activity-id">{activity.id}</span>
                    {activity.category && (
                      <span className="activity-category">
                        <Tag size="small" color="blue">
                          {activity.category}
                        </Tag>
                      </span>
                    )}
                  </div>
                  <div className="activity-timestamp">{activity.timestamp}</div>
                </div>
              </div>
              <div className="activity-actions">
                <Button
                  type="text"
                  size="small"
                  icon={<EyeOutlined />}
                  className="action-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleViewAction(activity.id)
                  }}
                />
                <Tooltip title={activity.actionType === "delete" ? "Cannot undo this action" : "Undo this action"}>
                  <Button
                    type="text"
                    size="small"
                    icon={<UndoOutlined />}
                    className="action-button"
                    disabled={activity.actionType === "delete"}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleUndoAction(activity.id, activity.actionType)
                    }}
                  />
                </Tooltip>
              </div>
              <Badge color={getStatusColor(activity.status)} text={activity.statusText} className="activity-status" />
            </div>
          </div>
        ))}
      </div>
      <div className="view-all-actions">
        <Button type="link">View All Admin Actions</Button>
      </div>
    </Card>
  )
}

export default BooksHistory
