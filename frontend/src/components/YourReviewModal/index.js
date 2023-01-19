//frontend/src/components/YourReviewModal/index.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { thunkUpdateReview, thunkDeleteReview, thunkLoadUserReviews } from "../../store/reviews";
import { useModal } from '../../context/Modal'
import './YourReviewModal.css'

const YourReviewModal = () => {
  const dispatch = useDispatch();
  const reviewsData = useSelector((state) => state.reviews.user);
  let reviews;
  if (reviewsData) {
    reviews = Object.values(reviewsData)
    console.log('user review ', reviews)
  }

  useEffect(() => {
    dispatch(thunkLoadUserReviews())
  }, [dispatch])

  return (
    <div className="your-review-main-div centered">
      <h1 className="your-review-title">Your Reviews</h1>
      {reviews.map((review) =>
      <ul className="your-review-modal">
        <li>{review.Spot.address}</li>
        <li key={review.id}>{review.review}</li>
        <button>Edit</button>
        <button>Delete</button>
      </ul>
      )}
    </div>
  )
};

export default YourReviewModal;
