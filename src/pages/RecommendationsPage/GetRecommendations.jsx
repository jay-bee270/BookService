import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Button,
  Input,
  Space,
  message,
  Divider,
  Typography,
  Row,
  Col,
  Spin,
  Empty,
  Tag,
  Modal,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  UserOutlined,
  BookOutlined,
  NumberOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const BASE_URL = "http://172.193.176.39:8081/api/books";

const formatDate = (dateString) => {
  if (!dateString) return "Unknown date";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const GetRecommendations = ({ onEditBook, onDeleteBook, refreshTrigger }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [searchedBook, setSearchedBook] = useState(null);
  const [searchError, setSearchError] = useState(null);

  const fetchAllBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(BASE_URL);
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid response");
      }

      const formattedBooks = response.data.map((book) => ({
        id: book.bookId ?? book.id,
        bookName: book.bookName || "Untitled Book",
        author: book.author || "Unknown Author",
        createdAt: book.createdAt || null,
      }));

      setBooks(formattedBooks);
    } catch (error) {
      message.error("Failed to load books");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookById = async () => {
    if (!searchId.trim()) return message.warning("Enter a book ID");
    setLoading(true);
    setSearchError(null);
    setSearchedBook(null);
    
    try {
      const response = await axios.get(`${BASE_URL}/${searchId.trim()}`);
      const book = response.data;

      setSearchedBook({
        id: book.bookId ?? book.id,
        bookName: book.bookName || "Untitled",
        author: book.author || "Unknown",
        createdAt: book.createdAt || null,
      });
      message.success("Book found!");
    } catch (error) {
      if (error.response?.status === 404) {
        setSearchError("Book does not exist");
        message.error("Book does not exist");
      } else {
        setSearchError("Search failed. Please try again.");
        message.error("Search failed");
      }
      setSearchedBook(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBooks();
  }, [refreshTrigger]);

  return (
    <div style={{ padding: "20px 0" }}>
      <Card
        title={<Title level={3}>All Book Recommendations</Title>}
        extra={
          <Button type="primary" icon={<ReloadOutlined />} onClick={fetchAllBooks}>
            Refresh
          </Button>
        }
      >
        <Space style={{ marginBottom: 24, width: "100%" }} wrap>
          <Input
            placeholder="Search by Book ID"
            value={searchId}
            onChange={(e) => {
              setSearchId(e.target.value);
              // Clear search results when input is cleared
              if (e.target.value.trim() === "") {
                setSearchedBook(null);
                setSearchError(null);
              }
            }}
            onPressEnter={fetchBookById}
            style={{ width: 300 }}
            allowClear
            onClear={() => {
              setSearchedBook(null);
              setSearchError(null);
            }}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={fetchBookById}>
            Search
          </Button>
          {(searchedBook || searchError) && (
            <Button 
              icon={<ReloadOutlined />} 
              onClick={() => {
                setSearchId("");
                setSearchedBook(null);
                setSearchError(null);
              }}
            >
              Clear Search
            </Button>
          )}
        </Space>

        <Spin spinning={loading}>
          {searchError && (
            <>
              <Divider orientation="left">Search Result</Divider>
              <Card 
                style={{ 
                  marginBottom: 24, 
                  borderColor: "#ff4d4f",
                  background: "#fff2f0"
                }}
              >
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div>
                      <Text strong style={{ fontSize: 16, color: "#ff4d4f" }}>
                        {searchError}
                      </Text>
                      <br />
                      <Text type="secondary">
                        No book found with ID: <strong>{searchId}</strong>
                      </Text>
                    </div>
                  }
                />
              </Card>
              <Divider />
            </>
          )}

          {searchedBook && (
            <>
              <Divider orientation="left">Search Result</Divider>
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} lg={8} xl={6}>
                  <BookCard book={searchedBook} onEdit={onEditBook} onDelete={onDeleteBook} />
                </Col>
              </Row>
              <Divider />
            </>
          )}

          {books.length === 0 ? (
            <Empty description="No recommendations yet. Be the first!" />
          ) : (
            <Row gutter={[24, 24]}>
              {books.map((book) => (
                <Col xs={24} sm={12} lg={8} xl={6} key={book.id}>
                  <BookCard book={book} onEdit={onEditBook} onDelete={onDeleteBook} />
                </Col>
              ))}
            </Row>
          )}
        </Spin>
      </Card>
    </div>
  );
};

// Clean Book Card - Only Available Fields
const BookCard = ({ book, onEdit, onDelete }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showDeleteModal = () => {
    setIsModalVisible(true);
  };

  const handleConfirmDelete = () => {
    setIsModalVisible(false);
    if (onDelete) {
      onDelete(book);
    }
  };

  const handleCancelDelete = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ExclamationCircleOutlined style={{ color: "#ff4d4f", fontSize: 20 }} />
            <span>Delete Book Recommendation</span>
          </div>
        }
        open={isModalVisible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText="Yes, Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
        centered
        width={500}
      >
        <div>
          <p>Are you sure you want to delete this book?</p>
          <div style={{ marginTop: 16, padding: 12, background: "#f5f5f5", borderRadius: 8 }}>
            <div style={{ marginBottom: 8 }}>
              <BookOutlined /> <strong>{book.bookName}</strong>
            </div>
            <div style={{ color: "#666" }}>
              <UserOutlined /> {book.author}
            </div>
          </div>
          <p style={{ marginTop: 16, color: "#ff4d4f", marginBottom: 0 }}>
            <strong>This action cannot be undone!</strong>
          </p>
        </div>
      </Modal>

      <Card
        hoverable
        style={{ height: "100%", borderRadius: 16, overflow: "hidden" }}
        cover={
          <div
            style={{
              height: 280,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 28,
              fontWeight: "bold",
              textAlign: "center",
              padding: 20,
            }}
          >
            <BookOutlined style={{ fontSize: 70, marginBottom: 16, opacity: 0.9 }} />
            <div style={{ fontSize: 18, opacity: 0.9 }}>{book.bookName}</div>
          </div>
        }
        actions={[
          <Button type="link" icon={<EditOutlined />} onClick={() => onEdit?.(book)}>
            Edit
          </Button>,
          <Button danger type="link" icon={<DeleteOutlined />} onClick={showDeleteModal}>
            Delete
          </Button>,
        ]}
      >
        <Card.Meta
          title={
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <Title level={5} style={{ margin: 0, lineHeight: 1.4, flex: 1 }}>
                {book.bookName}
              </Title>
              {/* Stylish ID Badge */}
              <div style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                padding: "6px 16px",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: "bold",
                boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
                display: "flex",
                alignItems: "center",
                gap: 6,
                whiteSpace: "nowrap"
              }}>
                <NumberOutlined style={{ fontSize: 14 }} />
                #{book.id}
              </div>
            </div>
          }
          description={
            <div style={{ fontSize: 14, marginTop: 12 }}>
              {/* Author */}
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                marginBottom: 16,
                padding: "12px 16px",
                background: "linear-gradient(135deg, #f6f8fb 0%, #f0f2f5 100%)",
                borderRadius: 10,
                border: "1px solid #e8e8e8"
              }}>
                <div style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                  boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)"
                }}>
                  <UserOutlined style={{ fontSize: 18 }} />
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 12, display: "block", lineHeight: 1.2 }}>
                    Author
                  </Text>
                  <Text strong style={{ fontSize: 15, lineHeight: 1.2 }}>
                    {book.author}
                  </Text>
                </div>
              </div>

              {/* Added Date */}
              <Text type="secondary" style={{ fontSize: 13, display: "flex", alignItems: "center" }}>
                <CalendarOutlined style={{ marginRight: 6 }} />
                Added on {formatDate(book.createdAt)}
              </Text>
            </div>
          }
        />
      </Card>
    </>
  );
};

export default GetRecommendations;