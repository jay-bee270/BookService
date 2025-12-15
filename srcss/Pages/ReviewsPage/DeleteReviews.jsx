import React, { useState } from 'react';

const DeleteReview = () => {
  const [reviewId, setReviewId] = useState('');
  const [isDeleted, setIsDeleted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const handleInputChange = (e) => {
    setReviewId(e.target.value);
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    if (!reviewId) {
      setError('Please enter a review ID');
      return;
    }
    setReviewToDelete(reviewId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    setShowModal(false);
    setLoading(true);
    setError(null);
    setIsDeleted(false);

    try {
      const response = await fetch(`https://book-services-group-a-1.onrender.com/reviews/${reviewToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setIsDeleted(true);
      setReviewId('');
      setReviewToDelete(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setReviewToDelete(null);
  };

  return (
    <div style={{ 
      maxWidth: '500px', 
      margin: '20px auto', 
      padding: '20px', 
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h2>Delete a Review</h2>
      
      <form onSubmit={handleDeleteClick} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="reviewId" style={{ display: 'block', marginBottom: '5px' }}>
            Review ID to Delete:
          </label>
          <input
            type="text"
            id="reviewId"
            value={reviewId}
            onChange={handleInputChange}
            required
            style={{ 
              width: '100%', 
              padding: '8px', 
              boxSizing: 'border-box',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? 'Deleting...' : 'Delete Review'}
        </button>
      </form>

      {error && (
        <div style={{ 
          color: 'white',
          backgroundColor: '#ff4444',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          Error: {error}
        </div>
      )}

      {isDeleted && (
        <div style={{ 
          color: 'white',
          backgroundColor: '#00C851',
          padding: '10px',
          borderRadius: '4px'
        }}>
          Success! Review has been deleted.
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '400px',
            maxWidth: '90%'
          }}>
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete review with ID: {reviewToDelete}?</p>
            <p style={{ color: '#ff4444', fontWeight: 'bold' }}>This action cannot be undone.</p>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              marginTop: '20px',
              gap: '10px'
            }}>
              <button
                onClick={cancelDelete}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f1f1f1',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: '20px', color: '#666' }}>
        <p>Note: Enter the ID of the review you want to delete.</p>
      </div>
    </div>
  );
};

export default DeleteReview;