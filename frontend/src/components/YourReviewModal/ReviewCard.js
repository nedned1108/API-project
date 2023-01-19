//frontend/src/components/CreateReviewFormModal/ReviewCard.js
import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { thunkDeleteReview, thunkUpdateReview } from "../../store/reviews";
import { useModal } from '../../context/Modal'

const ReviewCard = ({ review }) => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([])
  const {closeModal} = useModal();
  console.log(review)

  const deleteReview = () => {
    return dispatch(thunkDeleteReview(review.id))
    .then(closeModal)
    .catch(async (res) => {
      const data = await res.json();
      if (data && data.errors) setErrors(data.errors);
    });
  }

  const updateReview = () => {
    return dispatch(thunkUpdateReview())
    .catch(async (res) => {
      const data = await res.json();
      if (data && data.errors) setErrors(data.errors);
    });
  }

  return (
    <div className="your-review-modal">
      <div>{review.Spot.address}</div>
      <div key={review.id}>{review.review}</div>
      <button onClick={updateReview}>Edit</button>
      <button onClick={deleteReview}>Delete</button>
    </div>
  )
};

export default ReviewCard;
