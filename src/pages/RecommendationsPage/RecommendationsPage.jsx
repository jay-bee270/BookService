// RecommendationsPage.js (Updated with CSS class and debug)
import React, { useState, useCallback } from "react";
import { Tabs, message } from "antd";
import AddBook from "./AddRecommendations";
import GetRecommendations from "./GetRecommendations";
import EditBook from "./EditRecommendations";
import axios from "axios";

import "./RecommendationsPage.css"; // Import the CSS file

const API_URL = "http://172.193.176.39:8081/api/books";

const RecommendationsPage = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [editingBook, setEditingBook] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  console.log("RecommendationsPage render - refreshTrigger:", refreshTrigger);

  const deleteBook = async (bookId) => {
    try {
      await axios.delete(`${API_URL}/${bookId}`);
      message.success("Book deleted successfully!");
      return true;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete book";
      message.error(msg);
      console.error("Delete error:", error);
      return false;
    }
  };

  const handleDelete = useCallback(async (book) => {
    console.log("handleDelete called with:", book);
    if (!book?.id) {
      message.error("Invalid book selected");
      return;
    }

    const success = await deleteBook(book.id);
    if (success) {
      setRefreshTrigger((prev) => prev + 1);
    }
  }, []);

  const handleEdit = useCallback((book) => {
    console.log("handleEdit called with:", book);
    setEditingBook(book);
    setActiveTab("edit");
  }, []);

  const handleSuccess = useCallback((action = "Operation") => {
    setActiveTab("1");
    setEditingBook(null);
    setRefreshTrigger((prev) => prev + 1);
    message.success(`${action} completed successfully!`);
  }, []);

  const tabItems = [
    {
      key: "1",
      label: "View All Books",
      children: (
        <GetRecommendations
          onEditBook={handleEdit}
          onDeleteBook={handleDelete}
          refreshTrigger={refreshTrigger}
        />
      ),
    },
    {
      key: "2",
      label: "Can't Add Book At The Moment",
      children: <AddBook onSuccess={() => handleSuccess("Book added")} />,
    },
    ...(editingBook
      ? [
          {
            key: "edit",
            label: `Edit: ${editingBook.bookName}`,
            children: (
              <EditBook
                book={editingBook}
                onSuccess={() => handleSuccess("Book updated")}
                onCancel={() => {
                  setActiveTab("1");
                  setEditingBook(null);
                }}
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="recommendations-page">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        size="large"
        items={tabItems}
        destroyInactiveTabPane
      />
    </div>
  );
};

export default RecommendationsPage;