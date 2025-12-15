"use client"

import { useState, useEffect, useMemo } from "react"
import { Layout, Button, Typography, Card, Space, Spin, Alert, Input, Select, Tag, Grid } from "antd"
import {
  BookOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UserOutlined,
  MessageOutlined,
  CalendarOutlined,
  SyncOutlined,
  MenuOutlined,
} from "@ant-design/icons"
import GetReviews from "./GetReviews"
import PostReview from "./PostReviews"
import DeleteReview from "./DeleteReviews"
import "./ReviewsPage.css"

const { Header, Content } = Layout
const { Title, Paragraph, Text } = Typography
const { Search } = Input
const { Option } = Select
const { useBreakpoint } = Grid

const ReviewsPage = () => {
  const screens = useBreakpoint()
  const [currentPage, setCurrentPage] = useState("browse-by-book")
  const [books, setBooks] = useState([])
  const [allReviews, setAllReviews] = useState([])
  const [filteredReviews, setFilteredReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBook, setSelectedBook] = useState("all")
  const [refreshing, setRefreshing] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const fetchBooksAndReviews = async () => {
    setLoading(true)
    try {
      // UPDATED: Fetch all reviews from the new endpoint
      const reviewsRes = await fetch("http://9.169.178.97:8080/reviews/book/1")

      if (!reviewsRes.ok) {
        throw new Error(`HTTP error! status: ${reviewsRes.status}`)
      }

      const reviewsData = await reviewsRes.json()

      // Extract unique books from reviews
      const booksMap = new Map()

      reviewsData.forEach((review) => {
        const bookId = review.bookId
        if (!booksMap.has(bookId)) {
          booksMap.set(bookId, {
            productId: bookId,
            productTitle: review.bookTitle || `Book ${bookId}`,
            productAuthor: review.bookAuthor || "Unknown Author",
            reviews: [],
          })
        }
        booksMap.get(bookId).reviews.push(review)
      })

      const booksWithReviews = Array.from(booksMap.values())

      // Flatten all reviews with book information
      const allReviewsFlat = reviewsData.map((review) => ({
        ...review,
        bookTitle: review.bookTitle || `Book ${review.bookId}`,
        bookAuthor: review.bookAuthor || "Unknown Author",
        bookId: review.bookId,
      }))

      setBooks(booksWithReviews)
      setAllReviews(allReviewsFlat)
      setFilteredReviews(allReviewsFlat)
      setError(null)
    } catch (err) {
      setError(err.message || "Failed to fetch data")
      console.error("Fetch error:", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchBooksAndReviews()
  }

  useEffect(() => {
    fetchBooksAndReviews()
  }, [])

  useEffect(() => {
    let filtered = allReviews

    if (searchTerm) {
      filtered = filtered.filter(
        (review) =>
          (review.bookTitle?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (review.bookAuthor?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (review.reviewer?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (review.comment?.toLowerCase() || "").includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedBook !== "all") {
      filtered = filtered.filter((review) => review.bookId.toString() === selectedBook)
    }

    setFilteredReviews(filtered)
  }, [searchTerm, selectedBook, allReviews])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const bookOptions = useMemo(
    () =>
      books.map((book) => (
        <Option key={book.productId} value={book.productId.toString()}>
          {book.productTitle}
        </Option>
      )),
    [books],
  )

  const renderBrowseByBook = () => (
    <div className="page-style">
      <Title level={2} className="title-style">
        <br />
        Find Reviews About Your favourite Books
      </Title>

      <Card className="card-style">
        <div className="search-container">
          <Space className={`search-space ${screens.xs ? "vertical-space" : ""}`}>
            <Search
              placeholder="Search books, authors, or reviewers..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              className="search-input"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              placeholder="Select a book to view..."
              className="book-select"
              size="large"
              value={selectedBook}
              onChange={setSelectedBook}
              getPopupContainer={(trigger) => trigger.parentElement}
            >
              <Option value="all">All Books</Option>
              {bookOptions}
            </Select>
            <Button
              type="primary"
              icon={<SyncOutlined spin={refreshing} />}
              onClick={handleRefresh}
              size="large"
              className="refresh-button"
            >
              {screens.md ? (refreshing ? "Refreshing" : "Refresh") : ""}
            </Button>
          </Space>
        </div>

        {loading ? (
          <div className="loading-container">
            <Spin size="large" tip="Loading literary treasures..." />
          </div>
        ) : error ? (
          <Alert message="No Reviews at The Moment" description="Check Back Later"  className="error-alert" />
        ) : (
          <div>
            {filteredReviews.length === 0 ? (
              <div className="empty-state">
                <Paragraph type="secondary">
                  No reviews found in this tale,
                  <br />
                  Perhaps try another trail.
                </Paragraph>
              </div>
            ) : (
              <div>
                {selectedBook !== "all" && (
                  <Title level={4} className="book-title">
                    Reviews for "{books.find((b) => b.productId.toString() === selectedBook)?.productTitle}"
                  </Title>
                )}

                <div className="reviews-container">
                  {filteredReviews.map((review) => (
                    <Card key={review.id} className="book-card">
                      <div className="review-content-wrapper">
                        <div className="review-header">
                          <UserOutlined className="review-icon" />
                          <Text strong className="reviewer-name">
                            {review.reviewer}
                          </Text>
                          <Tag color="blue" className="book-tag">
                            <BookOutlined className="tag-icon" />
                            {review.bookTitle}
                          </Tag>
                        </div>
                        <div className="review-meta">
                          <Text type="secondary" className="review-id">
                            <span className="id-label">Review ID:</span> {review.id}
                          </Text>
                          <Text type="secondary" className="review-date">
                            <CalendarOutlined className="footer-icon" />
                            {new Date(review.createdAt).toLocaleDateString()}
                          </Text>
                        </div>
                        <Paragraph className="review-content">
                          <MessageOutlined className="content-icon" />
                          {review.comment}
                        </Paragraph>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="review-count">
                  <Text type="secondary">
                    Showing {filteredReviews.length} review{filteredReviews.length !== 1 ? "s" : ""}
                  </Text>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (currentPage) {
      case "get-reviews":
        return (
          <div className="page-style">
            <Title level={2} className="title-style">
              Find Reviews Far and Wide
              <br />
              Search Them With Pride
            </Title>
            <GetReviews />
          </div>
        )
      case "post-review":
        return (
          <div className="page-style">
            <Title level={2} className="title-style">
              Share Your Thoughts So True
              <br />
              Let Others Read Your View
            </Title>
            <PostReview />
          </div>
        )
      case "delete-review":
        return (
          <div className="page-style">
            <Title level={2} className="title-style">
              Remove What You Wrote
              <br />
              Delete That Old Note
            </Title>
            <DeleteReview />
          </div>
        )
      default:
        return renderBrowseByBook()
    }
  }

  return (
    <Layout className="main-layout">
      <Header className="header-style">
        <div className="nav-container">
          <div className="brand-container">
            <BookOutlined className="brand-icon" />
            <span className="brand-name">Book Reviews</span>
          </div>

          {screens.md ? (
            <Space className="nav-buttons">
              <Button
                type={currentPage === "browse-by-book" ? "primary" : "text"}
                icon={<BookOutlined />}
                onClick={() => setCurrentPage("browse-by-book")}
                className={`nav-button ${currentPage === "browse-by-book" ? "active" : ""}`}
              >
                Browse
              </Button>
              <Button
                type={currentPage === "get-reviews" ? "primary" : "text"}
                icon={<SearchOutlined />}
                onClick={() => setCurrentPage("get-reviews")}
                className={`nav-button ${currentPage === "get-reviews" ? "active" : ""}`}
              >
                Find
              </Button>
              <Button
                type={currentPage === "post-review" ? "primary" : "text"}
                icon={<EditOutlined />}
                onClick={() => setCurrentPage("post-review")}
                className={`nav-button ${currentPage === "post-review" ? "active" : ""}`}
              >
                Write
              </Button>
              <Button
                type={currentPage === "delete-review" ? "primary" : "text"}
                icon={<DeleteOutlined />}
                onClick={() => setCurrentPage("delete-review")}
                className={`nav-button ${currentPage === "delete-review" ? "active" : ""}`}
              >
                Delete
              </Button>
            </Space>
          ) : (
            <Button icon={<MenuOutlined />} onClick={toggleMobileMenu} className="mobile-menu-button" />
          )}
        </div>

        {!screens.md && mobileMenuOpen && (
          <div className="mobile-menu">
            <Button
              block
              type={currentPage === "browse-by-book" ? "primary" : "text"}
              icon={<BookOutlined />}
              onClick={() => {
                setCurrentPage("browse-by-book")
                setMobileMenuOpen(false)
              }}
              className={`mobile-nav-button ${currentPage === "browse-by-book" ? "active" : ""}`}
            >
              Browse
            </Button>
            <Button
              block
              type={currentPage === "get-reviews" ? "primary" : "text"}
              icon={<SearchOutlined />}
              onClick={() => {
                setCurrentPage("get-reviews")
                setMobileMenuOpen(false)
              }}
              className={`mobile-nav-button ${currentPage === "get-reviews" ? "active" : ""}`}
            >
              Find
            </Button>
            <Button
              block
              type={currentPage === "post-review" ? "primary" : "text"}
              icon={<EditOutlined />}
              onClick={() => {
                setCurrentPage("post-review")
                setMobileMenuOpen(false)
              }}
              className={`mobile-nav-button ${currentPage === "post-review" ? "active" : ""}`}
            >
              Write
            </Button>
            <Button
              block
              type={currentPage === "delete-review" ? "primary" : "text"}
              icon={<DeleteOutlined />}
              onClick={() => {
                setCurrentPage("delete-review")
                setMobileMenuOpen(false)
              }}
              className={`mobile-nav-button ${currentPage === "delete-review" ? "active" : ""}`}
            >
              Delete
            </Button>
          </div>
        )}
      </Header>

      <Content className="content-area">{renderContent()}</Content>
    </Layout>
  )
}

export default ReviewsPage
