//frontend/src/components/SpotReview/index.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { thunkLoadReviews } from "../../store/reviews";
import './SpotReview.css';
import userImage from '../../Image/user-image.png'

const SpotReview = (spotId) => {
  const dispatch = useDispatch();
  const reviewsData = useSelector(state => state.reviews.spot);
  let reviews;
  if (reviewsData) reviews = Object.values(reviewsData)

  useEffect(() => {
    if (spotId) {
      dispatch(thunkLoadReviews(spotId))
    }
  }, [spotId])

  if (reviews.length === 0 || !reviewsData) {
    return null;
  }

  return (
    <div className="noL review-box-container">
      {reviews.map((review) => {
        const reviewDate = new Date(review.createdAt)
        return (
          <div className="reviews-box">
            <div className="user-image-div">
              <img className="user-image" src={userImage} />
              <div className="name-date-review">
                <h3>{review.User.firstName}</h3>
                <p>{reviewDate.toString().split(' ').slice(1, 4).join(' ')}</p>
              </div>
            </div>
            <div>
              <li key={review.id}>{review.review}</li>
            </div>
          </div>
        )
      })}
    </div>
  )
};

export default SpotReview;
