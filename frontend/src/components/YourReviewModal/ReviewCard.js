//frontend/src/components/CreateReviewFormModal/ReviewCard.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { thunkDeleteReview, thunkUpdateReview, thunkLoadUserReviews, thunkLoadReviews } from "../../store/reviews";

const ReviewCard = ({ review }) => {
  const dispatch = useDispatch();
  const deletedReview = useSelector(state => state.reviews.user)
  const spotId = useSelector(state => state.spots.singleSpot.id)
  const [reviewInput, setReviewInput] = useState(review.review);
  const [editButton, setEditButton] = useState(false);
  const { user } = useSelector(state => state.session);
  const [stars, setStars] = useState(review.stars);
  const [hidden, setHidden] = useState(false);
  const [errors, setErrors] = useState([]);

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
      },
      ReviewImages: [],
      User: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName
      }
    }

    dispatch(thunkUpdateReview(data))
      .then(() => setHidden(false))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });

    dispatch(thunkLoadReviews({ spotId }))
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
        <div className="edit-review-container">
          <form className="edit-review-form-box" onSubmit={updateReview}>
            <ul>
              {errors.map((error, idx) => <li key={idx}>{error}</li>)}
            </ul>
            <div className="edit-review-div">
              <label>Review:</label>
              <input
                type='text'
                value={reviewInput}
                onChange={(e) => setReviewInput(e.target.value)}
                className='input-placeholder'
              />
            </div>
            <div className="edit-review-div">
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
            <div className="submit-cancel-div">
              <button className="edit-review-submit" type="submit">Submit</button>
              <button className="edit-review-cancel" onClick={() => setHidden(false)}>Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="update-review">
          <div className="your-review-single-container">
            <h2 className="your-review-single-name bold">{review.Spot.name}</h2>
            <div className="bold">{review.Spot.address}, {review.Spot.city}, {review.Spot.state} </div>
            <div className="your-review-single-review" key={review.id}>{review.review}</div>
          </div>
          {editButton ?
            <div className="hiddenButton">
              <button className="edit-review-button" onClick={() => setEditButton(false)}>{<i class="fa-solid fa-bars"></i>}</button>
              <div className="delete-submit-buttons">
                <button className="d-s-b" onClick={reviewButton}>Edit</button>
                <button className="d-s-b" onClick={deleteReview}>Delete</button>
              </div>
            </div>
            :
            <div className="hiddenButton">
              <button className="edit-review-button" onClick={() => setEditButton(true)}>{<i class="fa-solid fa-bars"></i>}</button>
            </div>
          }

        </div>
      )}
    </>
  )
};

export default ReviewCard;
