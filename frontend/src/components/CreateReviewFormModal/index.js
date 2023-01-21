//frontend/src/components/CreateReviewFormModal/index.js
import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { thunkCreateReview } from "../../store/reviews";
import { useModal } from '../../context/Modal'
import { thunkLoadSpot } from "../../store/spots";

const CreateReviewFormModal = ({spotId, user}) => {
  const dispatch = useDispatch();
  const [review, setReview] = useState('');
  const [stars, setStars] = useState('');
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const reviewData = {
      spotId,
      reviewDetail : {
        review,
        stars
      },
      ReviewImages: [],
      User: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName
      }
    }

    dispatch(thunkCreateReview(reviewData))
    .then(closeModal)
    .catch(async (res) => {
      const data = await res.json();
      if (data && data.errors) setErrors(data.errors);
    });

    dispatch(thunkLoadSpot(spotId))
  };

  return (
    <section className="create-spot-form centered">
      <h1>Review</h1>
      <form onSubmit={handleSubmit} className='centered'>
        <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <div className="input-form">
          <label>Review:</label>
          <input
            type='text'
            value={review}
            onChange={(e) => setReview(e.target.value)}
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
    </section>
  )
};

export default CreateReviewFormModal;
