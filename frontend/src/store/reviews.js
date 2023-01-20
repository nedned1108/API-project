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
    dispatch(loadReviews(data))
  }
};

export const thunkLoadUserReviews = () => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/current`);
  if (response.ok) {
    const data = await response.json();
    dispatch(loadUserReviews(data))
  }
};

export const thunkCreateReview = ({spotId, reviewDetail, ReviewImages, User}) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    body: JSON.stringify(reviewDetail)
  });
  if (response.ok) {
    const review = await response.json();
    const newReview = {ReviewImages, User, ...review}
    dispatch(createReview(newReview))
    return review;
  }
};

export const thunkUpdateReview = (data) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${data.id}`, {
    method: "PUT",
    body: JSON.stringify(data.reviewInfo)
  });
  if (response.ok) {
    const review = await response.json();
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
      newState.user = { ...state.user, [action.payload.id]: {...state.user[action.payload.id], ...action.payload}}
      newState.spot = { ...state.spot, [action.payload.id]: action.payload}
      return newState;
    case DELETE_REVIEW:
      newState.user = {...state.user}
      newState.spot = {...state.spot}
      delete newState.user[action.payload]
      delete newState.spot[action.payload]
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
