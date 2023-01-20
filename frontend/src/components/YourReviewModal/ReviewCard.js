//frontend/src/components/CreateReviewFormModal/ReviewCard.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { thunkDeleteReview, thunkUpdateReview, thunkLoadUserReviews } from "../../store/reviews";
import { useModal } from '../../context/Modal'

const ReviewCard = ({ review }) => {
  const dispatch = useDispatch();
  const deletedReview = useSelector(state => state.reviews.user)
  const [reviewInput, setReviewInput] = useState(review.review);
  const [stars, setStars] = useState(review.stars);
  const [hidden, setHidden] = useState(false);
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const deleteReview = (e) => {
    e.preventDefault();
    return dispatch(thunkDeleteReview(review.id))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  }
  const reviewButton = (e) => {
    e.preventDefault();
    setHidden(true);
  }

  const updateReview = (e) => {
    e.preventDefault();
    const data = {
      id: review.id,
      reviewInfo: {
        review: reviewInput,
        stars
      }
    }

    return dispatch(thunkUpdateReview(data))
      // .then(closeModal)
      .then(() => setHidden(false))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  };

  useEffect(() => {
    dispatch(thunkLoadUserReviews)
  }, [deletedReview])
  if (!review) {
    return null
  }
  return (
    <>
      {hidden ? (
        <div className="centered">
          <form onSubmit={updateReview}>
            <ul>
              {errors.map((error, idx) => <li key={idx}>{error}</li>)}
            </ul>
            <div className="input-form">
              <label>Review:</label>
              <input
                type='text'
                value={reviewInput}
                onChange={(e) => setReviewInput(e.target.value)}
                className='input-placeholder'
              />
            </div>
            <div className="input-form">
              <label>Stars from 1 to 5:</label>
              <input
                type='number'
                min='1'
                max='5'
                value={stars}
                onChange={(e) => setStars(e.target.value)}
                className='input-placeholder'
              />
            </div>
            <button className="submit-button" type="submit">Submit</button>
          </form>
        </div>
      ) : (
        <div className="your-review-modal">
          <div className="your-review-single-container">
            <div className="your-review-single-name bold">{review.Spot.name} | {review.Spot.address}</div>
            <div className="your-review-single-review" key={review.id}>{review.review}</div>
          </div>
          <div className="delete-submit-buttons">
            <button className="d-s-b" onClick={reviewButton}>{<i className="fas fa-solid fa-pen-to-square"></i>}</button>
            <button className="d-s-b" onClick={deleteReview}>{<i className="fas fa-solid fa-trash"></i>}</button>
          </div>
        </div>
      )}
    </>
  )
};

export default ReviewCard;
