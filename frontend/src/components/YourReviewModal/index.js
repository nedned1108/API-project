//frontend/src/components/YourReviewModal/index.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { thunkUpdateReview, thunkDeleteReview, thunkLoadUserReviews } from "../../store/reviews";
import { useModal } from '../../context/Modal'
import ReviewCard from "./ReviewCard";
import './YourReviewModal.css'

const YourReviewModal = () => {
  const dispatch = useDispatch();
  const reviewsData = useSelector((state) => state.reviews.user);
  let reviews;
  if (reviewsData) {
    reviews = Object.values(reviewsData)
  }

  useEffect(() => {
    dispatch(thunkLoadUserReviews())
  }, [dispatch]);

  return (
    <div className="your-review-main-div centered">
      <h1 className="your-review-title">Your Reviews</h1>
      {reviews.map((review) => <ReviewCard review={review} key={review.id}/>)}
    </div>
  )
};

export default YourReviewModal;
