//frontend/src/store/reviews.js
import { csrfFetch } from "./csrf";

const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS';
const LOAD_USERREVIEWS = 'reviews/LOAD_USERREVIEWS';
const CREATE_REVIEW = 'reviews/CREATE_REVIEW';
const UPDATE_REVIEW = 'reviews/UPDATE_REVIEW';
const DELETE_REVIEW = 'reviews/DELETE_REVIEW';

//Selector
export const loadReviews = (reviews) => {
  return {
    type: LOAD_REVIEWS,
    payload: reviews
  }
};

export const loadUserReviews = (reviews) => {
  return {
    type: LOAD_USERREVIEWS,
    payload: reviews 
  }
}

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

export const deleteReview = (id) => {
  return {
    type: DELETE_REVIEW,
    payload: id
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

export const thunkLoadUserReviews = () => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/current`);
  if (response.ok) {
    const data = await response.json();
    console.log("thunkLoadUserReviews ", data)
    dispatch(loadUserReviews(data))
  }
};

export const thunkCreateReview = (data) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${data.spotId}/reviews`, {
    method: "POST",
    body: JSON.stringify(data.reviewDetail)
  });
  if (response.ok) {
    const review = await response.json();
    console.log('thunkCreateReview ', review)
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
  console.log(id)
  const response = await csrfFetch(`/api/reviews/${id}`, {
    method: "DELETE"
  });

  if (response.ok) {
    const data = await response.json();
    console.log('thunkDeleteReview ', data)
    dispatch(deleteReview(id))
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
    case LOAD_USERREVIEWS:
      newState.user = normalize(action.payload.Reviews)
      return newState;
    case CREATE_REVIEW:
      newState.spot = {...state.spot, [action.payload.id]: action.payload}
      return newState;
    case UPDATE_REVIEW:
      return newState;
    case DELETE_REVIEW:
      delete newState.user[action.payload]
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
