//frontend/src/components/SpotReview/index.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { thunkLoadReviews } from "../../store/reviews";
import './SpotReview.css';

const SpotReview = (spotId) => {
  const dispatch = useDispatch();
  const reviewsData = useSelector(state => state.reviews.spot);
  let reviews;
  if (reviewsData) reviews = Object.values(reviewsData)
  console.log(reviews)

  useEffect(() => {
    if (spotId) {
      dispatch(thunkLoadReviews(spotId))
    }
  }, [spotId])

  if (!reviewsData) {
    return null;
  }

  return (
    <div className="noL reviews-box">
      {reviews.map((review) => <li key={review.id}>{review.review}</li>)}
    </div>
  )
};

export default SpotReview;
