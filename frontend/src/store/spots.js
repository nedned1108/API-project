import { csrfFetch } from "./csrf";

const LOAD_ALLSPOTS = 'allSpots/LOAD_ALLSPOTS';
const LOAD_SINGLESPOT = 'singleSpot/LOAD_SINGLESPOT';

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

export const thunkLoadAllSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots');

  if (response.ok) {
    const data = await response.json();
    console.log("thunkLoadAllSpots ", data.spots)
    dispatch(loadAllSpots(data.spots))
  }
};

export const thunkLoadSpot = () => async (dispatch) => {
  const response = await csrfFetch('/api/:spotId');

  if (response.ok) {
    const data = await response.json();
    console.log("thunkLoadSpot ",data.spot)
    dispatch(loadSingleSpot(data.spot))
    return data;
  }
}

const initialState = {};

const spotReducer = (state = initialState, action) => {
  const newState = {...state};
  switch (action.type) {
    case LOAD_ALLSPOTS:
      newState.allSpots = normalize(action.payload);
      console.log(newState)
      return newState;
    // case LOAD_SINGLESPOT:
    //   const singleSpotState = {...state, singleSpot: normalize(action.spot)}
    //   return singleSpotState;
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
