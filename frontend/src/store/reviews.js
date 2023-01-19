//frontend/src/store/reviews.js
import { csrfFetch } from "./csrf";

const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS';
const CREATE_REVIEW = 'reviews/CREATE_REVIEW';
const UPDATE_REVIEW = 'reviews/UPDATE_REVIEW';
const DELETE_REVIEW = 'reviews/DELETE_REVIEW';

export const loadReviews = (reviews) => {
  return {
    type: LOAD_REVIEWS,
    payload: reviews
  }
};

//Selector
export const createReview = (review) => {
  return {
    type: CREATE_REVIEW,
    payload: review
  }
};

export const updateReview = (review) => {
  return {
    type: UPDATE_REVIEW,
    payload: review
  }
};

export const deleteReview = (review) => {
  return {
    type: DELETE_REVIEW,
    payload: review
  }
};

//Thunk action
export const thunkLoadReviews = ({spotId}) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
  if (response.ok) {
    const data = await response.json();
    console.log("thunkLoadReviews ", data)
    dispatch(loadReviews(data))
  }
};

export const thunkCreateSpot = (data) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${data.id}/reviews`, {
    method: "POST",
    body: JSON.stringify(data)
  });
  if (response.ok) {
    const review = await response.json();
    dispatch(createReview(review))
    return review;
  }
};

export const thunkUpdateReview = (data) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${data.id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });

  if (response.ok) {
    const review = await response.json();
    console.log('thunkUpdateReview', review)
    dispatch(updateReview(review))
    return review;
  }
}

export const thunkDeleteReview = (id) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${id}`, {
    method: "DELETE"
  });

  if (response.ok) {
    const data = await response.json();
    console.log('thunkDeleteReview ', data)
    dispatch(deleteReview(data))
    return data;
  }
};

// initialState
const initialState = {
  spot: {},
  user: {}
};

//Reducer
const reviewReducer = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case LOAD_REVIEWS:
      newState.spot = normalize(action.payload.Reviews)
      return newState;
    case CREATE_REVIEW:
      return newState;
    case UPDATE_REVIEW:
      return newState;
    case DELETE_REVIEW:
      return newState;
    default:
      return state;
  }
};

// helper function
const normalize = (array) => {
  const obj = {}
  array.forEach((el) => {
    obj[el.id] = el
  });
  return obj;
}

export default reviewReducer;
