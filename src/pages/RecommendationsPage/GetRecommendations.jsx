import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Table, 
  Button, 
  Input, 
  Space, 
  message, 
  Card, 
  Divider, 
  Typography,
  Descriptions,
  Spin,
  Tag
} from "antd";
import { SearchOutlined, ReloadOutlined, EditOutlined } from "@ant-design/icons";

const { Text } = Typography;
const BASE_URL = "https://recommendation-8-c47c.onrender.com/api/books";

const GetRecommendations = ({ onEditBook, refreshTrigger }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [searchedBook, setSearchedBook] = useState(null);
  const [error, setError] = useState(null);

  const fetchAllBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(BASE_URL);
      console.log("API Response:", response.data);
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid response format: Expected an array of books");
      }

      const formattedBooks = response.data.map((book, index) => {
        // Handle various possible property names
        const id = book.id || book.bookId || `temp-${index}`;
        const bookName = book.bookName || book.title || `Book ${index + 1}`;
        const author = book.author || "Unknown Author";
        const createdAt = book.createdAt || book.dateAdded || null;

        return {
          key: id,
          id,
          bookName,
          author,
          createdAt: createdAt ? new Date(createdAt).toISOString() : null
        };
      });
      
      setBooks(formattedBooks);
    } catch (error) {
      console.error("Fetch error:", error);
      const errorMsg = error.response?.data?.message || 
                      error.message || 
                      "Failed to load books. Please try again later.";
      setError(errorMsg);
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookById = async () => {
    if (!searchId.trim()) {
      message.warning("Please enter a book ID");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}/${searchId.trim()}`);
      const bookData = response.data;
      console.log("Single Book Response:", bookData);
      
      if (!bookData) {
        throw new Error("No book data received from server");
      }

      const id = bookData.id || bookData.bookId;
      if (!id) {
        throw new Error("Book data missing ID field");
      }

      setSearchedBook({
        id,
        bookName: bookData.bookName || bookData.title || "Untitled Book",
        author: bookData.author || "Unknown Author",
        createdAt: bookData.createdAt || bookData.dateAdded || null
      });
    } catch (error) {
      console.error("Search error:", error);
      const errorMsg = error.response?.data?.message || 
                      error.response?.status === 404 ? "Book not found" :
                      error.message || 
                      "Failed to search for book";
      setError(errorMsg);
      setSearchedBook(null);
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => String(a.id).localeCompare(String(b.id)),
      render: id => <Tag color="blue">{id}</Tag>
    },
    {
      title: 'Book Name',
      dataIndex: 'bookName',
      key: 'bookName',
      sorter: (a, b) => a.bookName.localeCompare(b.bookName),
      render: text => <Text strong>{text}</Text>
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      sorter: (a, b) => a.author.localeCompare(b.author)
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: date => date ? new Date(date).toLocaleDateString() : 'N/A',
      sorter: (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button 
          icon={<EditOutlined />} 
          onClick={() => {
            if (typeof onEditBook === 'function') {
              onEditBook(record);
            } else {
              console.error("onEditBook is not a function");
              message.error("Edit functionality is not available");
            }
          }}
          type="link"
          style={{ color: '#1890ff' }}
        >
          Edit
        </Button>
      ),
    }
  ];

  useEffect(() => {
    fetchAllBooks();
  }, [refreshTrigger]);

  return (
    <Card 
      title="Book Recommendations"
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
      extra={
        <Button 
          icon={<ReloadOutlined />}
          onClick={fetchAllBooks}
          loading={loading}
          type="primary"
        >
          Refresh List
        </Button>
      }
    >
      <Spin spinning={loading} tip="Loading books...">
        <Space size="middle" style={{ marginBottom: 24 }}>
          <Input
            placeholder="Search by Book ID"
            value={searchId}
            onChange={e => setSearchId(e.target.value)}
            style={{ width: 250 }}
            allowClear
            onPressEnter={fetchBookById}
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={fetchBookById}
            loading={loading}
          >
            Search
          </Button>
        </Space>

        {error && (
          <Text type="danger" style={{ display: 'block', marginBottom: 24 }}>
            {error}
          </Text>
        )}

        {searchedBook && (
          <>
            <Divider orientation="left">Book Details</Divider>
            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="ID">
                <Tag color="blue">{searchedBook.id}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Book Name">
                <Text strong>{searchedBook.bookName}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Author">
                {searchedBook.author}
              </Descriptions.Item>
              <Descriptions.Item label="Created Date">
                {searchedBook.createdAt ? 
                  new Date(searchedBook.createdAt).toLocaleString() : 'N/A'}
              </Descriptions.Item>
            </Descriptions>
            <Divider />
          </>
        )}

        <Table
          columns={columns}
          dataSource={books}
          loading={loading}
          pagination={{ 
            pageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '50'],
            showTotal: (total) => `Total ${total} books`
          }}
          bordered
          rowKey="id"
          locale={{
            emptyText: error ? "Error loading books" : "No book recommendations available"
          }}
          scroll={{ x: true }}
        />
      </Spin>
    </Card>
  );
};

export default GetRecommendations;