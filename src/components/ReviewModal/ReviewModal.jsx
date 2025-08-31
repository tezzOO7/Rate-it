import React, { useState } from "react";

// Input validation and sanitization functions
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  // Remove HTML tags and dangerous characters
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .trim();
};

const validateReview = (content) => {
  if (!content || content.trim().length === 0) {
    return 'Review content is required';
  }
  if (content.length < 10) {
    return 'Review must be at least 10 characters long';
  }
  if (content.length > 1000) {
    return 'Review must be less than 1000 characters';
  }
  return null;
};

const ReviewModal = ({ isOpen, onClose, onSubmit }) => {
  const [authenticity, setAuthenticity] = useState(0);
  const [professionalism, setProfessionalism] = useState(0);
  const [communication, setCommunication] = useState(0);
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear errors when content changes
  const handleContentChange = (value) => {
    setContent(value);
    if (errors.content) {
      setErrors(prev => ({ ...prev, content: null }));
    }
  };

  // Validate all form fields
  const validateForm = () => {
    const newErrors = {};
    
    if (!authenticity || !professionalism || !communication) {
      newErrors.ratings = 'Please rate all categories';
    }
    
    const contentError = validateReview(content);
    if (contentError) newErrors.content = contentError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const overall = (authenticity + professionalism + communication) / 3;

      // Sanitize content before submitting
      const sanitizedContent = sanitizeInput(content);

      await onSubmit({
        authenticity,
        professionalism,
        communication,
        overall,
        content: sanitizedContent,
      });

      // reset after submit
      setAuthenticity(0);
      setProfessionalism(0);
      setCommunication(0);
      setContent("");
      setErrors({});
      onClose();
    } catch (error) {
      alert('An error occurred. Please try again.');
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (value, setter) => (
    <div className="flex space-x-2 mb-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => setter(star)}
          className={`text-2xl ${
            star <= value ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">Leave a Review</h2>

        <label className="block mb-2 font-medium">Authenticity</label>
        {renderStars(authenticity, setAuthenticity)}

        <label className="block mb-2 font-medium">Professionalism</label>
        {renderStars(professionalism, setProfessionalism)}

        <label className="block mb-2 font-medium">Communication</label>
        {renderStars(communication, setCommunication)}

        {errors.ratings && (
          <p className="text-red-500 text-sm mt-2">{errors.ratings}</p>
        )}

        <textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          className="w-full border rounded-lg p-3 text-sm mt-4"
          placeholder="Write your review..."
          rows={4}
        />

        {errors.content && (
          <p className="text-red-500 text-sm mt-2">{errors.content}</p>
        )}

        <button
          onClick={handleSubmit}
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default ReviewModal;
