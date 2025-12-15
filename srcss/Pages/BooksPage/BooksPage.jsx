"use client"

import { useEffect, useState } from "react"
import { Card, Row, Col, Spin, Alert, Button, Modal, Form, Input, message, Rate, Divider, Typography } from "antd"
import { EyeOutlined, MessageOutlined, ExclamationCircleFilled, EditOutlined, DeleteOutlined } from "@ant-design/icons"
import "./BooksPage.css"

const { Title, Text } = Typography

const BooksPage = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false)
  const [isViewReviewsModalVisible, setIsViewReviewsModalVisible] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [bookToDelete, setBookToDelete] = useState(null)
  const [editingBook, setEditingBook] = useState(null)
  const [selectedBookForReview, setSelectedBookForReview] = useState(null)
  const [selectedBookReviews, setSelectedBookReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null) // Added this line
  const [form] = Form.useForm()
  const [reviewForm] = Form.useForm()

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const res = await fetch("https://book-services-group-a.onrender.com/api/v1/products")
      const data = await res.json()

      const booksWithReviewCounts = await Promise.all(
        data.map(async (book) => {
          try {
            const reviewRes = await fetch(`https://book-services-group-a-1.onrender.com/reviews/book/${book.productId}`)
            const reviews = await reviewRes.json()
            return {
              ...book,
              reviewCount: reviews.length || 0,
              reviews: reviews || [],
            }
          } catch (err) {
            return {
              ...book,
              reviewCount: 0,
              reviews: [],
            }
          }
        }),
      )

      setBooks(booksWithReviewCounts)
      setError(null)
    } catch (err) {
      setError(err.message || "Failed to fetch books")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const showModal = (book = null) => {
    setEditingBook(book)
    if (book) {
      form.setFieldsValue(book)
    } else {
      form.resetFields()
    }
    setIsModalVisible(true)
  }

  const showReviewModal = (book) => {
    setSelectedBookForReview(book)
    reviewForm.resetFields()
    setIsReviewModalVisible(true)
  }

  const showViewReviewsModal = async (book) => {
    setSelectedBookForReview(book)
    setReviewsLoading(true)
    setIsViewReviewsModalVisible(true)

    try {
      const response = await fetch(`https://book-services-group-a-1.onrender.com/reviews/book/${book.productId}`)
      if (response.ok) {
        const reviews = await response.json()
        setSelectedBookReviews(reviews)
      } else {
        setSelectedBookReviews([])
      }
    } catch (err) {
      message.error("Failed to fetch reviews")
      setSelectedBookReviews([])
    } finally {
      setReviewsLoading(false)
    }
  }

  const showDeleteConfirm = (book) => {
    setBookToDelete(book)
    setIsDeleteModalVisible(true)
  }

  const showBookDetails = (book) => {
    setSelectedBook(book)
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setEditingBook(null)
    form.resetFields()
  }

  const handleReviewCancel = () => {
    setIsReviewModalVisible(false)
    setSelectedBookForReview(null)
    reviewForm.resetFields()
  }

  const handleViewReviewsCancel = () => {
    setIsViewReviewsModalVisible(false)
    setSelectedBookForReview(null)
    setSelectedBookReviews([])
  }

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false)
    setBookToDelete(null)
  }

  const handleDelete = async () => {
    if (!bookToDelete) return
    
    try {
      await fetch(`https://book-services-group-a.onrender.com/api/v1/products/${bookToDelete.productId}`, {
        method: "DELETE",
      })
      message.success("Book deleted successfully")
      fetchBooks()
    } catch (err) {
      message.error("Error deleting book")
    } finally {
      setIsDeleteModalVisible(false)
      setBookToDelete(null)
    }
  }

  const handleFinish = async (values) => {
    try {
      const payload = {
        ...values,
        productId: editingBook?.productId ?? values.productId,
      }

      if (editingBook) {
        await fetch(`https://book-services-group-a.onrender.com/api/v1/products/${editingBook.productId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        message.success("Book updated successfully")
      } else {
        await fetch("https://book-services-group-a.onrender.com/api/v1/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        message.success("Book added successfully")
      }
      fetchBooks()
      setIsModalVisible(false)
    } catch (err) {
      message.error("Error saving book")
    }
  }

  const handleReviewSubmit = async (values) => {
    try {
      const payload = {
        bookId: selectedBookForReview.productId,
        reviewer: values.reviewer,
        comment: values.comment,
        rating: values.rating || 5,
      }

      const response = await fetch("https://book-services-group-a-1.onrender.com/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        message.success("Review added successfully!")
        setIsReviewModalVisible(false)
        fetchBooks()
      } else {
        throw new Error("Failed to submit review")
      }
    } catch (err) {
      message.error("Error submitting review")
    }
  }

  return (
    <div className="books-page">
      <div className="header-section">
        <Title level={3} className="page-title">Book Collection</Title>
        <Button 
          type="primary" 
          icon={<EditOutlined />}
          className="add-book-btn"
          onClick={() => showModal()}
          size="large"
        >
          Add New Book
        </Button>
      </div>

      {loading ? (
        <div className="loading-container">
          <Spin size="large" tip="Loading books..." />
        </div>
      ) : error ? (
        <Alert 
          type="error" 
          message="Error" 
          description={error} 
          showIcon 
          className="error-alert"
        />
      ) : (
        <Row gutter={[24, 24]} className="books-grid">
          {books.map((book) => (
            <Col xs={24} sm={12} md={8} lg={6} key={book.productId}>
              <Card
                className="book-card"
                cover={
                  <div className="book-cover-placeholder">
                    <Text strong className="book-id">Id: {book.productId}</Text>
                  </div>
                }
                actions={[
                  <Button 
                    type="primary" 
                    icon={<MessageOutlined />} 
                    onClick={(e) => {
                      e.stopPropagation()
                      showReviewModal(book)
                    }}
                    className="card-action-btn"
                  >
                    Add Review
                  </Button>,
                  <Button 
                    icon={<EyeOutlined />} 
                    onClick={(e) => {
                      e.stopPropagation()
                      showViewReviewsModal(book)
                    }}
                    className="card-action-btn"
                  >
                    Reviews ({book.reviewCount})
                  </Button>
                ]}
              >
                <Card
                  hoverable
                  onClick={() => showBookDetails(book)}
                  style={{ cursor: "pointer" }}
                >
                  <Card.Meta
                    title={
                      <>
                        <Text strong>Title: </Text>
                        <Text ellipsis={{ tooltip: book.productTitle }}>
                          {book.productTitle}
                        </Text>
                      </>
                    }
                    description={
                      <>
                        <Text type="secondary" strong>Author: </Text>
                        <Text type="secondary" ellipsis={{ tooltip: book.productAuthor || "Unknown Author" }}>
                          {book.productAuthor || "Unknown Author"}
                        </Text>
                        <Divider className="book-divider" />
                        <Text strong>About book: </Text>
                        <Text className="book-description" ellipsis={{ rows: 3, expandable: true, symbol: 'more' }}>
                          {book.productDescription || "No description available"}
                        </Text>
                      </>
                    }
                  />
                </Card>

                <div className="card-actions">
                  <Button 
                    icon={<EditOutlined />} 
                    onClick={(e) => {
                      e.stopPropagation()
                      showModal(book)
                    }}
                    className="edit-btn"
                  />
                  <Button 
                    icon={<DeleteOutlined />} 
                    danger 
                    onClick={(e) => {
                      e.stopPropagation()
                      showDeleteConfirm(book)
                    }}
                    className="delete-btn"
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Book Add/Edit Modal */}
      <Modal
        title={editingBook ? "Edit Book" : "Add Book"}
        open={isModalVisible && (editingBook !== null || selectedBook === null)}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText={editingBook ? "Update" : "Add"}
        cancelText="Cancel"
        width="90%"
        style={{ maxWidth: 600 }}
        className="book-modal"
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          {!editingBook && (
            <Form.Item
              name="productId"
              label="Book ID"
              rules={[{ required: true, message: "Please input product ID" }]}
            >
              <Input placeholder="Enter book ID" />
            </Form.Item>
          )}
          <Form.Item name="productTitle" label="Title" rules={[{ required: true, message: "Please input title" }]}>
            <Input placeholder="Enter book title" />
          </Form.Item>
          <Form.Item name="productAuthor" label="Author" rules={[{ required: true, message: "Please input author" }]}>
            <Input placeholder="Enter author name" />
          </Form.Item>
          <Form.Item
            name="productDescription"
            label="Description"
            rules={[{ required: true, message: "Please input description" }]}
          >
            <Input.TextArea rows={4} placeholder="Enter book description" showCount maxLength={500} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Book Details Modal */}
      <Modal
        title="Book Details"
        open={isModalVisible && selectedBook !== null && editingBook === null}
        onCancel={() => {
          setIsModalVisible(false)
          setSelectedBook(null)
        }}
        footer={[
          <Button 
            key="close" 
            onClick={() => {
              setIsModalVisible(false)
              setSelectedBook(null)
            }}
          >
            Close
          </Button>,
        ]}
        width="90%"
        style={{ maxWidth: 600 }}
      >
        {selectedBook && (
          <>
            <Title level={4}>{selectedBook.productTitle}</Title>
            <p><strong>Author:</strong> {selectedBook.productAuthor || "Unknown Author"}</p>
            <Divider />
            <p><strong>About book:</strong></p>
            <p>{selectedBook.productDescription || "No description available"}</p>
            <Divider />
            <p><strong>Reviews:</strong> {selectedBook.reviewCount}</p>
          </>
        )}
      </Modal>

      {/* Add Review Modal */}
      <Modal
        title={`Add Review for "${selectedBookForReview?.productTitle}"`}
        open={isReviewModalVisible}
        onCancel={handleReviewCancel}
        onOk={() => reviewForm.submit()}
        okText="Submit Review"
        cancelText="Cancel"
        width="90%"
        style={{ maxWidth: 600 }}
        className="review-modal"
      >
        <Form form={reviewForm} layout="vertical" onFinish={handleReviewSubmit}>
          <Form.Item name="reviewer" label="Your Name" rules={[{ required: true, message: "Please enter your name" }]}>
            <Input placeholder="Enter your name" />
          </Form.Item>
          <Form.Item name="rating" label="Rating" initialValue={5}>
            <Rate />
          </Form.Item>
          <Form.Item
            name="comment"
            label="Your Review"
            rules={[{ required: true, message: "Please write your review" }]}
          >
            <Input.TextArea rows={4} placeholder="Share your thoughts about this book..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Reviews Modal */}
      <Modal
        title={`Reviews for "${selectedBookForReview?.productTitle}"`}
        open={isViewReviewsModalVisible}
        onCancel={handleViewReviewsCancel}
        footer={[
          <Button key="close" onClick={handleViewReviewsCancel}>
            Close
          </Button>,
          <Button
            key="add"
            type="primary"
            onClick={() => {
              handleViewReviewsCancel()
              showReviewModal(selectedBookForReview)
            }}
          >
            Add Review
          </Button>,
        ]}
        width="90%"
        style={{ maxWidth: 700 }}
        className="reviews-modal"
      >
        {reviewsLoading ? (
          <div className="reviews-loading">
            <Spin tip="Loading reviews..." />
          </div>
        ) : selectedBookReviews.length === 0 ? (
          <div className="no-reviews">
            <p>No reviews yet for this book.</p>
            <Button
              type="primary"
              onClick={() => {
                handleViewReviewsCancel()
                showReviewModal(selectedBookForReview)
              }}
            >
              Be the first to review!
            </Button>
          </div>
        ) : (
          <div className="reviews-list">
            {selectedBookReviews.map((review) => (
              <Card key={review.id} className="review-card" size="small">
                <div className="review-content">
                  <div className="review-header">
                    <strong className="reviewer-name">{review.reviewer}</strong>
                    {review.rating && (
                      <Rate 
                        disabled 
                        defaultValue={review.rating} 
                        className="review-rating" 
                      />
                    )}
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <small className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </small>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title={
          <span className="delete-modal-title">
            <ExclamationCircleFilled className="delete-icon" />
            Confirm Delete
          </span>
        }
        open={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={handleDeleteCancel}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
        className="delete-modal"
        width="90%"
        style={{ maxWidth: 500 }}
      >
        <p className="delete-confirmation-text">
          Are you sure you want to delete the book <strong>"{bookToDelete?.productTitle}"</strong>?
        </p>
        <p className="delete-warning-text">This action cannot be undone.</p>
      </Modal>
    </div>
  )
}

export default BooksPage