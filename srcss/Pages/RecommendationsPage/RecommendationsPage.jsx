import React, { useState, useCallback } from "react";
import { Tabs, message } from "antd";
import AddBook from "./AddRecommendations";
import GetBooks from "./GetRecommendations";
import EditBook from "./EditRecommendations";

const RecommendationsPage = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [editingBook, setEditingBook] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEdit = useCallback((book) => {
    console.log("Edit book data:", book);
    if (!book || !book.id) {
      message.error("Invalid book data received");
      return;
    }
    setEditingBook(book);
    setActiveTab("edit");
    message.info(`Editing: ${book.bookName || 'book'}`);
  }, []);

  const handleSuccess = useCallback((action = 'Operation') => {
    setActiveTab("1");
    setEditingBook(null);
    setRefreshTrigger((prev) => prev + 1);
    message.success(`${action} completed successfully`);
  }, []);

  const items = [
    {
      key: "1",
      label: "View Books",
      children: (
        <GetBooks 
          onEditBook={handleEdit} 
          refreshTrigger={refreshTrigger} 
        />
      ),
    },
    {
      key: "2",
      label: "Add New Book",
      children: <AddBook onSuccess={() => handleSuccess('Addition')} />,
    },
    ...(editingBook ? [{
      key: "edit",
      label: `Edit ${editingBook.bookName || 'Book'}`,
      children: (
        <EditBook
          book={editingBook}
          onSuccess={() => handleSuccess('Update')}
          onCancel={() => {
            setActiveTab("1");
            setEditingBook(null);
          }}
        />
      ),
    }] : []),
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        size="large"
        items={items}
        destroyInactiveTabPane
      />
    </div>
  );
};

export default RecommendationsPage;