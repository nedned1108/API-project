//frontend/src/store/spots.js
import { csrfFetch } from "./csrf";

const LOAD_ALLSPOTS = 'allSpots/LOAD_ALLSPOTS';
const LOAD_SINGLESPOT = 'singleSpot/LOAD_SINGLESPOT';
const CREATE_SPOT = 'singleSpot/CREATE_SPOT';
const UPDATE_SPOT = 'singleSpot/UPDATE_SPOT';
const DELETE_SPOT = 'singleSpot/DELETE_SPOT';

// action
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

export const createSpot = (spot) => {
  return {
    type: CREATE_SPOT,
    payload: spot
  }
};

export const updateSpot = (spot) => {
  return {
    type: UPDATE_SPOT,
    payload: spot
  }
};

export const deleteSpot = (spot) => {
  return {
    type: DELETE_SPOT,
    payload: spot
  }
};

// thunk action
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
    console.log('thunkLoadAllSpots', data)
    dispatch(loadAllSpots(data.spots))
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
    throw error
  }
};

export const thunkUpdateSpot = (data) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${data.id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      let error;
      error = await response.json();
      throw new Error(error)
    }

    const spot = await response.json();
    console.log('thunkUpdateSpot', spot)
    dispatch(updateSpot(spot))
    return spot;
  } catch (error) {
    throw error
  }
};

export const thunkDeleteSpot = (id) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      let error;
      error = await response.json();
      throw new Error(error)
    }

    const data = await response.json();
    console.log('thunkDeleteSpot ',data )
    dispatch(deleteSpot(data))
    return data;
  } catch (error) {
    throw error
  }
};


// initialState
const initialState = {
  allSpots: {},
  singleSpot: {
    SpotImages: [],
    Owner: {}
  }
};

// Reducer
const spotReducer = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case LOAD_ALLSPOTS:
      newState.allSpots = normalize(action.payload);
      return newState;
    case LOAD_SINGLESPOT:
      newState.singleSpot = {...action.payload};
      return newState;
    case CREATE_SPOT:
      newState.allSpots = {...state.allSpots, [action.payload.id]: action.payload}
      return newState;
    case UPDATE_SPOT:
      newState.singleSpot = {...state.singleSpot, ...action.payload}
      return newState;
    case DELETE_SPOT:
      delete newState.allSpots[action.payload]
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

export default spotReducer;
