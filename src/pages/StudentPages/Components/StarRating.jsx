import React from 'react';
import { FiStar } from 'react-icons/fi';
import PropTypes from 'prop-types';

const StarRating = ({ rating, onRatingChange, hoverRating, onHoverChange }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="focus:outline-none"
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => onHoverChange(star)}
          onMouseLeave={() => onHoverChange(0)}
        >
          <FiStar
            className={`h-6 w-6 ${(hoverRating || rating) >= star 
              ? 'text-yellow-500 fill-current' 
              : 'text-gray-300 dark:text-gray-500'}`}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
        {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Rate your experience'}
      </span>
    </div>
  );
};

  export default StarRating;