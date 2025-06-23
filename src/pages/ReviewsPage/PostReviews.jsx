import React, { useState } from 'react';

const PostReview = () => {
  const [formData, setFormData] = useState({
    bookId: '',
    reviewer: '',
    comment: ''
  });
  const [submittedReview, setSubmittedReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://book-services-group-a-1.onrender.com/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: parseInt(formData.bookId),
          reviewer: formData.reviewer,
          comment: formData.comment
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSubmittedReview(data);
      setFormData({ bookId: '', reviewer: '', comment: '' }); // Reset form
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Submit a Book Review</h2>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="bookId" style={{ display: 'block', marginBottom: '5px' }}>
            Book ID:
          </label>
          <input
            type="number"
            id="bookId"
            name="bookId"
            value={formData.bookId}
            onChange={handleChange}
            min="1"
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="reviewer" style={{ display: 'block', marginBottom: '5px' }}>
            Your Name:
          </label>
          <input
            type="text"
            id="reviewer"
            name="reviewer"
            value={formData.reviewer}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="comment" style={{ display: 'block', marginBottom: '5px' }}>
            Your Review:
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            required
            rows="4"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>

      {error && (
        <div style={{ color: 'red', margin: '20px 0', padding: '10px', border: '1px solid red' }}>
          Error: {error}
        </div>
      )}

      {submittedReview && (
        <div style={{ 
          marginTop: '30px',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '5px',
          backgroundColor: '#f9f9f9'
        }}>
          <h4>Review Submitted Successfully:</h4>
          <p><strong>Book ID:</strong> {submittedReview.bookId}</p>
          <p><strong>Reviewer:</strong> {submittedReview.reviewer}</p>
          <p><strong>Comment:</strong> {submittedReview.comment}</p>
          <p><strong>Created At:</strong> {new Date(submittedReview.createdAt).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default PostReview;