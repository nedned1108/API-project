//frontend/src/store/likes.js
import { csrfFetch } from "./csrf";

const LOAD_LIKES = 'likes/LOAD_LIKES';
const LOAD_USERLIKES = 'likes/LOAD_USERLIKES';
const CREATE_LIKE = 'likes/CREATE_LIKE';
const DELETE_LIKE = 'likes/DELETE_LIKE';

//Selector
export const loadLikes = (likes) => {
  return {
    type: LOAD_LIKES,
    payload: likes
  }
};

export const loadUserLikes = (likes) => {
  return {
    type: LOAD_USERLIKES,
    payload: likes 
  }
}

export const createLike = (like) => {
  return {
    type: CREATE_LIKE,
    payload: like
  }
};

export const deleteLike = (id) => {
  return {
    type: DELETE_LIKE,
    payload: id
  }
};

//Thunk action
export const thunkLoadLikes = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/likes`);
  if (response.ok) {
    const data = await response.json();
    dispatch(loadLikes(data))
  }
};

export const thunkCreateLike = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/likes`, {
    method: "POST",
    body: JSON.stringify()
  });
  if (response.ok) {
    const like = await response.json();
    dispatch(createLike(like.Likes))
    return like;
  }
};

export const thunkDeleteLike = (id) => async (dispatch) => {
  const response = await csrfFetch(`/api/likes/${id}`, {
    method: "DELETE"
  });
  if (response.ok) {
    const data = await response.json();
    dispatch(deleteLike(id))
    return data;
  }
};

// initialState
const initialState = {};

//Reducer
const likeReducer = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case LOAD_LIKES:
      newState = normalize(action.payload.Likes)
      return newState;
    case CREATE_LIKE:
      newState = {...state, [action.payload.id]: action.payload}
      return newState;
    case DELETE_LIKE:
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

export default likeReducer;
