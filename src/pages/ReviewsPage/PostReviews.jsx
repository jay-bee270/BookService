import { useState, useEffect } from "react"
import { EditOutlined, BookOutlined, UserOutlined, StarFilled, StarOutlined } from "@ant-design/icons"

export default function PostReview() {
  const [formData, setFormData] = useState({
    bookId: "",
    reviewer: "",
    rating: 5,
    comment: ""
  })
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [booksLoading, setBooksLoading] = useState(true)
  const [errors, setErrors] = useState({})
  const [hoveredStar, setHoveredStar] = useState(0)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://20.121.232.133:8080/api/v1/products")
        if (response.ok) {
          const booksData = await response.json()
          console.log("Fetched books:", booksData)
          if (Array.isArray(booksData)) {
            setBooks(booksData)
          } else {
            console.error("Expected array but got:", booksData)
            setBooks([])
          }
        } else {
          throw new Error("Failed to fetch books")
        }
      } catch (error) {
        console.error("Error fetching books:", error)
        setBooks([])
      } finally {
        setBooksLoading(false)
      }
    }

    fetchBooks()
  }, [])

  const showMessage = (type, content) => {
    const messageDiv = document.createElement('div')
    messageDiv.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      padding: 12px 24px;
      background: ${type === 'success' ? '#52c41a' : '#ff4d4f'};
      color: white;
      border-radius: 4px;
      z-index: 9999;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      font-size: 14px;
      font-weight: 500;
    `
    messageDiv.textContent = content
    document.body.appendChild(messageDiv)
    setTimeout(() => messageDiv.remove(), 3000)
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.bookId) newErrors.bookId = "Please select a book"
    if (!formData.reviewer.trim()) newErrors.reviewer = "Please enter your name"
    if (!formData.rating) newErrors.rating = "Please provide a rating"
    if (!formData.comment.trim()) newErrors.comment = "Please write your review"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await fetch("http://9.169.178.97:8080/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: parseInt(formData.bookId),
          reviewer: formData.reviewer,
          comment: formData.comment,
          rating: formData.rating,
        }),
      })

      if (response.ok) {
        showMessage('success', "Review posted successfully!")
        setFormData({
          bookId: "",
          reviewer: "",
          rating: 5,
          comment: ""
        })
        setErrors({})
      } else {
        throw new Error("Failed to post review")
      }
    } catch (error) {
      showMessage('error', "Error posting review: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      bookId: "",
      reviewer: "",
      rating: 5,
      comment: ""
    })
    setErrors({})
  }

  const renderStars = () => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => setFormData(prev => ({ ...prev, rating: i }))}
          onMouseEnter={() => setHoveredStar(i)}
          onMouseLeave={() => setHoveredStar(0)}
          style={{ cursor: 'pointer', fontSize: 28, marginRight: 4 }}
        >
          {i <= (hoveredStar || formData.rating) ? (
            <StarFilled style={{ color: '#fadb14' }} />
          ) : (
            <StarOutlined style={{ color: '#d9d9d9' }} />
          )}
        </span>
      )
    }
    return stars
  }

  return (
    <div style={{ 
      padding: "20px", 
      minHeight: "100vh", 
      background: "#f0f2f5",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    }}>
      <div style={{ 
        maxWidth: 800, 
        margin: "0 auto", 
        background: "white",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        padding: 32
      }}>
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <EditOutlined style={{ fontSize: 48, color: "#1890ff", marginBottom: 16 }} />
          <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8, color: "#262626" }}>
            Write a Review
          </h2>
          <p style={{ color: "#8c8c8c", fontSize: 14 }}>Share your thoughts about a book</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Book Selection */}
          <div>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontSize: "16px", 
              fontWeight: 500,
              color: "#262626"
            }}>
              <BookOutlined style={{ marginRight: 8, color: "#1890ff" }} />
              Select Book <span style={{ color: "#ff4d4f" }}>*</span>
            </label>
            
            {booksLoading ? (
              <div style={{ 
                padding: "40px", 
                textAlign: "center", 
                background: "#fafafa",
                borderRadius: "8px",
                color: "#8c8c8c"
              }}>
                <div style={{ fontSize: 16 }}>Loading books...</div>
              </div>
            ) : (
              <>
                <select
                  value={formData.bookId}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, bookId: e.target.value }))
                    setErrors(prev => ({ ...prev, bookId: undefined }))
                  }}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    fontSize: 16,
                    border: errors.bookId ? "1px solid #ff4d4f" : "1px solid #d9d9d9",
                    borderRadius: 6,
                    background: "white",
                    cursor: "pointer",
                    outline: "none",
                    transition: "all 0.3s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#40a9ff"}
                  onBlur={(e) => e.target.style.borderColor = errors.bookId ? "#ff4d4f" : "#d9d9d9"}
                >
                  <option value="">Choose a book to review</option>
                  {books.map((book) => {
                    const bookId = book?.productId || book?.id
                    const bookTitle = book?.productTitle || book?.title || "Untitled"
                    const bookAuthor = book?.productAuthor || book?.author || "Unknown Author"
                    
                    return (
                      <option key={bookId} value={bookId}>
                        {bookTitle} by {bookAuthor}
                      </option>
                    )
                  })}
                </select>
                {books.length > 0 && (
                  <div style={{ marginTop: 4, fontSize: "12px", color: "#8c8c8c" }}>
                    {books.length} book{books.length !== 1 ? 's' : ''} available
                  </div>
                )}
              </>
            )}
            
            {errors.bookId && (
              <div style={{ color: "#ff4d4f", marginTop: "8px", fontSize: "14px" }}>
                {errors.bookId}
              </div>
            )}
          </div>

          {/* Reviewer Name */}
          <div>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontSize: "16px", 
              fontWeight: 500,
              color: "#262626"
            }}>
              <UserOutlined style={{ marginRight: 8, color: "#1890ff" }} />
              Your Name <span style={{ color: "#ff4d4f" }}>*</span>
            </label>
            <input
              type="text"
              value={formData.reviewer}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, reviewer: e.target.value }))
                setErrors(prev => ({ ...prev, reviewer: undefined }))
              }}
              placeholder="Enter your name"
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: 16,
                border: errors.reviewer ? "1px solid #ff4d4f" : "1px solid #d9d9d9",
                borderRadius: 6,
                outline: "none",
                transition: "all 0.3s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#40a9ff"}
              onBlur={(e) => e.target.style.borderColor = errors.reviewer ? "#ff4d4f" : "#d9d9d9"}
            />
            {errors.reviewer && (
              <div style={{ color: "#ff4d4f", marginTop: "8px", fontSize: "14px" }}>
                {errors.reviewer}
              </div>
            )}
          </div>

          

          {/* Review Comment */}
          <div>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontSize: "16px", 
              fontWeight: 500,
              color: "#262626"
            }}>
              Your Review <span style={{ color: "#ff4d4f" }}>*</span>
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, comment: e.target.value }))
                setErrors(prev => ({ ...prev, comment: undefined }))
              }}
              placeholder="Share your thoughts about this book..."
              maxLength={1000}
              rows={6}
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: 15,
                border: errors.comment ? "1px solid #ff4d4f" : "1px solid #d9d9d9",
                borderRadius: 6,
                outline: "none",
                transition: "all 0.3s",
                fontFamily: "inherit",
                resize: "vertical"
              }}
              onFocus={(e) => e.target.style.borderColor = "#40a9ff"}
              onBlur={(e) => e.target.style.borderColor = errors.comment ? "#ff4d4f" : "#d9d9d9"}
            />
            <div style={{ textAlign: "right", fontSize: 12, color: "#8c8c8c", marginTop: 4 }}>
              {formData.comment.length} / 1000
            </div>
            {errors.comment && (
              <div style={{ color: "#ff4d4f", marginTop: "8px", fontSize: "14px" }}>
                {errors.comment}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ 
            display: "flex", 
            gap: "12px", 
            justifyContent: "center", 
            marginTop: "16px",
            paddingTop: "16px",
            borderTop: "1px solid #f0f0f0"
          }}>
            <button 
              onClick={handleSubmit}
              disabled={loading || booksLoading}
              style={{
                minWidth: 140,
                padding: "12px 24px",
                fontSize: 16,
                fontWeight: 500,
                color: "white",
                background: loading ? "#91d5ff" : "#1890ff",
                border: "none",
                borderRadius: 6,
                cursor: loading || booksLoading ? "not-allowed" : "pointer",
                transition: "all 0.3s",
                boxShadow: "0 2px 0 rgba(0, 0, 0, 0.045)"
              }}
              onMouseEnter={(e) => {
                if (!loading && !booksLoading) e.target.style.background = "#40a9ff"
              }}
              onMouseLeave={(e) => {
                if (!loading) e.target.style.background = "#1890ff"
              }}
            >
              {loading ? "Posting..." : "Can't Add Review At The Moment"}
            </button>
            <button 
              onClick={handleReset}
              style={{
                minWidth: 100,
                padding: "12px 24px",
                fontSize: 16,
                fontWeight: 500,
                color: "#262626",
                background: "white",
                border: "1px solid #d9d9d9",
                borderRadius: 6,
                cursor: "pointer",
                transition: "all 0.3s"
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = "#40a9ff"
                e.target.style.color = "#40a9ff"
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = "#d9d9d9"
                e.target.style.color = "#262626"
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}