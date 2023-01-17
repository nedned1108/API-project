//frontend/src/store/spots.js
import { csrfFetch } from "./csrf";

const LOAD_ALLSPOTS = 'allSpots/LOAD_ALLSPOTS';
const LOAD_SINGLESPOT = 'singleSpot/LOAD_SINGLESPOT';
const LOAD_CURRENTSPOT = 'currentSpot/LOAD_CURRENTSPOT';
const CREATE_SPOT = 'singleSpot/CREATE_SPOT';

export const loadAllSpots = (allSpots) => {
  return {
    type: LOAD_ALLSPOTS,
    payload: allSpots
  }
};

export const loadSingleSpot = (spot) => {
  return {
    type: LOAD_SINGLESPOT,
    payload: spot
  }
};

export const loadCurrentSpots = (currentSpot) => {
  return {
    type: LOAD_CURRENTSPOT,
    payload: currentSpot
  }
};

export const createSpot = (spot) => {
  return {
    type: CREATE_SPOT,
    payload: spot
  }
};

export const thunkLoadAllSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots');

  if (response.ok) {
    const data = await response.json();
    console.log("thunkLoadAllSpots ", data.spots)
    dispatch(loadAllSpots(data.spots))
  }
};

export const thunkLoadSpot = (id) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${id}`);
  if (response.ok) {
    const spot = await response.json();
    console.log("thunkLoadSpot ", spot)
    dispatch(loadSingleSpot(spot))
    return spot;
  }
};

export const thunkLoadCurrentSpots = () => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/current`);
  if (response.ok) {
    const data = await response.json();
    console.log('thunkLoadCurrentSpots', data)
    dispatch(loadCurrentSpots(data.spots))
    return data;
  }
};

export const thunkCreateSpot = (data) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots`, {
      method: "POST",
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      let error;
      error = await response.json();
      throw new Error(error)
    }

    const spot = await response.json();
    console.log('thunkCreateSpot', spot)
    dispatch(createSpot(spot))
    return spot;
  } catch (error) {
    console.log('thunkCreateSpot error ',error)
    throw error
  }
};

const initialState = {};

const spotReducer = (state = initialState, action) => {
  const newState = { ...state };
  switch (action.type) {
    case LOAD_ALLSPOTS:
      newState.allSpots = normalize(action.payload);
      return newState;
    case LOAD_SINGLESPOT:
      const singleSpotState = { ...state, singleSpot: action.payload }
      return singleSpotState;
    case LOAD_CURRENTSPOT:
      newState.currentSpot = normalize(action.payload);
      return newState;
    case CREATE_SPOT:
      newState[action.payload.id] = action.payload;
      return newState;
    default:
      return state;
  }
};

const normalize = (array) => {
  const obj = {}
  array.forEach((el) => {
    obj[el.id] = el
  });
  return obj;
}

export default spotReducer;
