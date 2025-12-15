import { useEffect, useState } from "react"
import {
  Card,
  Row,
  Col,
  Spin,
  Alert,
  Button,
  Modal,
  Form,
  Input,
  message,
  Rate,
  Divider,
  Typography,
} from "antd"
import { EyeOutlined, MessageOutlined, ExclamationCircleFilled, EditOutlined, DeleteOutlined } from "@ant-design/icons"

const { Title, Text } = Typography

export default function BooksPage() {
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
  const [selectedBook, setSelectedBook] = useState(null)
  const [form] = Form.useForm()
  const [reviewForm] = Form.useForm()

  const REVIEWS_API = "http://9.169.178.97:8080/reviews"

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const res = await fetch("http://20.121.232.133:8080/api/v1/products")
      if (!res.ok) {
        throw new Error(`Failed to fetch books: ${res.status}`)
      }
      const data = await res.json()

      const booksWithReviewCounts = await Promise.all(
        data.map(async (book) => {
          try {
            const reviewRes = await fetch(`${REVIEWS_API}/book/${book.productId}`)
            if (reviewRes.ok) {
              const reviews = await reviewRes.json()
              const reviewsArray = Array.isArray(reviews) ? reviews : []
              return {
                ...book,
                reviewCount: reviewsArray.length,
                reviews: reviewsArray,
              }
            }
            return {
              ...book,
              reviewCount: 0,
              reviews: [],
            }
          } catch (err) {
            console.error(`Error fetching reviews for book ${book.productId}:`, err)
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
      message.error("Failed to load books")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const showModal = (book = null) => {
    setEditingBook(book)
    setSelectedBook(null)
    if (book) {
      form.setFieldsValue({
        productTitle: book.productTitle,
        productAuthor: book.productAuthor,
        productDescription: book.productDescription,
      })
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
      const response = await fetch(`${REVIEWS_API}/book/${book.productId}`)
      if (response.ok) {
        const reviews = await response.json()
        setSelectedBookReviews(Array.isArray(reviews) ? reviews : [])
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
    setSelectedBook(null)
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
      const response = await fetch(`http://20.121.232.133:8080/api/v1/products/${bookToDelete.productId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Failed to delete: ${response.status}`)
      }

      message.success("Book deleted successfully")
      fetchBooks()
    } catch (err) {
      message.error("Error deleting book")
      console.error("Delete error:", err)
    } finally {
      setIsDeleteModalVisible(false)
      setBookToDelete(null)
    }
  }

  const handleFinish = async (values) => {
    try {
      let payload
      let url
      let method

      if (editingBook) {
        url = `http://20.121.232.133:8080/api/v1/products/${editingBook.productId}`
        method = "PUT"
        payload = {
          productTitle: values.productTitle,
          productAuthor: values.productAuthor,
          productDescription: values.productDescription,
        }
      } else {
        url = "http://20.121.232.133:8080/api/v1/products"
        method = "POST"
        payload = {
          productTitle: values.productTitle,
          productAuthor: values.productAuthor,
          productDescription: values.productDescription,
        }
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        message.success(editingBook ? "Book updated successfully" : "Book added successfully")
        fetchBooks()
        setIsModalVisible(false)
        setEditingBook(null)
        setSelectedBook(null)
        form.resetFields()
      } else {
        let errorMessage = `Error ${response.status}`
        try {
          const errorText = await response.text()
          errorMessage += `: ${errorText}`
        } catch (e) {
          // Ignore
        }
        throw new Error(errorMessage)
      }
    } catch (err) {
      console.error("Save book error:", err)
      message.error(`Error: ${err.message}`)
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

      const response = await fetch(REVIEWS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        message.success("Review added successfully!")
        setIsReviewModalVisible(false)
        reviewForm.resetFields()
        fetchBooks()
      } else {
        throw new Error("Failed to submit review")
      }
    } catch (err) {
      message.error("Error submitting review")
    }
  }

  return (
    <div style={{ padding: 24, background: "#f0f2f5", minHeight: "100vh" }}>
      <div style={{ marginBottom: 24, marginTop: 40, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 19 }}>
        <Title level={3} style={{ margin: -17.5 }}>
          Book Collection
        </Title>
        <Button type="primary" icon={<EditOutlined />} onClick={() => showModal()} size="large">
          Can't Add Book At The Moment
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 50 }}>
          <Spin size="large" tip="Loading books..." />
        </div>
      ) : error ? (
        <Alert  message="No Books Available At The Moment" description="Check Back Later"  />
      ) : (
        <Row gutter={[24, 24]}>
          {books.map((book) => (
            <Col xs={24} sm={12} md={8} lg={6} key={book.productId}>
              <Card
                hoverable
                style={{ height: "100%", display: "flex", flexDirection: "column" }}
                bodyStyle={{ flex: 1, display: "flex", flexDirection: "column", padding: "16px" }}
                cover={
                  <div
                    style={{
                      height: 180,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 20,
                      color: "white",
                      fontSize: 18,
                      fontWeight: 600,
                      textAlign: "center",
                      overflow: "hidden",
                      cursor: "pointer"
                    }}
                    onClick={() => showBookDetails(book)}
                  >
                    <div style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      lineHeight: 1.4
                    }}>
                      {book.productTitle}
                    </div>
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
                    size="small"
                    key="addReview"
                  >
                    Add Review
                  </Button>,
                  <Button
                    icon={<EyeOutlined />}
                    onClick={(e) => {
                      e.stopPropagation()
                      showViewReviewsModal(book)
                    }}
                    size="small"
                    key="viewReviews"
                  >
                    Reviews ({book.reviewCount})
                  </Button>,
                ]}
              >
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ marginBottom: 8 }}>
                    <Text type="secondary" strong style={{ fontSize: 12 }}>
                      Author:{" "}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {book.productAuthor || "Unknown Author"}
                    </Text>
                  </div>
                  
                  <Divider style={{ margin: "8px 0" }} />
                  
                  <div style={{ flex: 1, marginBottom: 12 }}>
                    <Text strong style={{ fontSize: 12 }}>About: </Text>
                    <div style={{ 
                      height: 60, 
                      overflow: "hidden", 
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      fontSize: 12,
                      color: "#595959",
                      lineHeight: 1.5
                    }}>
                      {book.productDescription || "No description available"}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                    <Button
                      icon={<EditOutlined />}
                      onClick={(e) => {
                        e.stopPropagation()
                        showModal(book)
                      }}
                      style={{ flex: 1 }}
                      size="small"
                    >
                      Edit
                    </Button>
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      onClick={(e) => {
                        e.stopPropagation()
                        showDeleteConfirm(book)
                      }}
                      style={{ flex: 1 }}
                      size="small"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Book Add/Edit Modal */}
      <Modal
        title={editingBook ? "Edit Book" : "Add New Book"}
        open={isModalVisible && (editingBook !== null || selectedBook === null)}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText={editingBook ? "Update" : "Add"}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
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
        width={600}
      >
        {selectedBook && (
          <>
            <Title level={4}>{selectedBook.productTitle}</Title>
            <p>
              <strong>Author:</strong> {selectedBook.productAuthor || "Unknown Author"}
            </p>
            <Divider />
            <p>
              <strong>About:</strong>
            </p>
            <p>{selectedBook.productDescription || "No description available"}</p>
            <Divider />
            <p>
              <strong>Reviews:</strong> {selectedBook.reviewCount}
            </p>
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
        width={600}
      >
        <Form form={reviewForm} layout="vertical" onFinish={handleReviewSubmit}>
          <Form.Item name="reviewer" label="Your Name" rules={[{ required: true, message: "Please enter your name" }]}>
            <Input placeholder="Enter your name" />
          </Form.Item>
          <Form.Item name="rating" label="Rating" initialValue={5}>
            <Rate />
          </Form.Item>
          <Form.Item name="comment" label="Your Review" rules={[{ required: true, message: "Please write your review" }]}>
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
        width={700}
      >
        {reviewsLoading ? (
          <div style={{ textAlign: "center", padding: 30 }}>
            <Spin tip="Loading reviews..." />
          </div>
        ) : selectedBookReviews.length === 0 ? (
          <div style={{ textAlign: "center", padding: 30 }}>
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
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {selectedBookReviews.map((review) => (
              <Card key={review.id} size="small" style={{ background: "#fafafa" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <strong>{review.reviewer}</strong>
                    {review.rating && <Rate disabled defaultValue={review.rating} />}
                  </div>
                  <p style={{ margin: "8px 0" }}>{review.comment}</p>
                  <small style={{ color: "#8c8c8c" }}>{new Date(review.createdAt).toLocaleDateString()}</small>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title={
          <span>
            <ExclamationCircleFilled style={{ color: "#ff4d4f", marginRight: 8 }} />
            Confirm Delete
          </span>
        }
        open={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={handleDeleteCancel}
        okText="Delete"
        okButtonProps={{ danger: true }}
        width={500}
      >
        <p>
          Are you sure you want to delete the book <strong>"{bookToDelete?.productTitle}"</strong>?
        </p>
        <p style={{ color: "#ff4d4f" }}>This action cannot be undone.</p>
      </Modal>
    </div>
  )
}