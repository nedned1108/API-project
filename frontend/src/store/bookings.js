//frontend/src/store/bookings.js
import { csrfFetch } from "./csrf";

const LOAD_USERBOOKINGS = 'bookings/LOAD_USERBOOKINGS';
const LOAD_SPOTBOOKING = 'bookings/LOAD_SPOTBOOKING';
const CREATE_BOOKING = 'bookings/CREATE_BOOKING';
const UPDATE_BOOKING = 'bookings/UPDATE_BOOKING';
const DELETE_BOOKING = 'bookings/DELETE_BOOKING';


//Action
export const loadUserBookings = (bookings) => {
  return {
    type: LOAD_USERBOOKINGS,
    payload: bookings
  }
};

export const loadSpotBookings = (bookings) => {
  return {
    type: LOAD_SPOTBOOKING,
    payload: bookings 
  }
}

export const createBooking = (booking) => {
  return {
    type: CREATE_BOOKING,
    payload: booking
  }
};

export const updateBooking = (booking) => {
  return {
    type: UPDATE_BOOKING,
    payload: booking
  }
};

export const deleteBooking = (id) => {
  return {
    type: DELETE_BOOKING,
    payload: id
  }
};

//Thunk action
export const thunkLoadUserBookings = () => async (dispatch) => {
  const response = await csrfFetch(`/api/bookings/current`);
  if (response.ok) {
    const data = await response.json();
    dispatch(loadUserBookings(data))
  }
};

export const thunkLoadSpotBookings = ({ spotId }) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/bookings`);
  if (response.ok) {
    const data = await response.json();
    dispatch(loadSpotBookings(data))
  }
};

export const thunkCreateBooking = (bookingData) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${bookingData.spotId}/bookings`, {
    method: "POST",
    body: JSON.stringify(bookingData)
  });
  if (response.ok) {
    const booking = await response.json();
    dispatch(createBooking(booking))
    return booking;
  }
};

export const thunkUpdateBooking = (bookingData) => async (dispatch) => {
  const response = await csrfFetch(`/api/bookings/${bookingData.id}`, {
    method: "PUT",
    body: JSON.stringify(bookingData)
  });
  if (response.ok) {
    const booking = await response.json();
    dispatch(updateBooking(booking))
    return booking;
  }
};

export const thunkDeleteBooking = (id) => async (dispatch) => {
  const response = await csrfFetch(`/api/bookings/${id}`, {
    method: "DELETE"
  });
  if (response.ok) {
    const data = await response.json();
    dispatch(deleteBooking(id))
    return data;
  }
};

// initialState
const initialState = {
  user: {},
  spot: {}
};

//Reducer
const bookingReducer = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case LOAD_SPOTBOOKING:
      newState.spot = normalize(action.payload.Bookings)
      return newState;
    case LOAD_USERBOOKINGS:
      newState.user = normalize(action.payload.Bookings)
      return newState;
    case CREATE_BOOKING:
      newState.spot = {...state.spot, [action.payload.id]: action.payload}
      newState.user = {...state.user, [action.payload.id]: action.payload}
      return newState;
    case UPDATE_BOOKING:
      newState.user = { ...state.user, [action.payload.id]: {...state.user[action.payload.id], ...action.payload}}
      newState.spot = { ...state.spot, [action.payload.id]: {...state.spot[action.payload.id], ...action.payload}}
      return newState;
    case DELETE_BOOKING:
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

export default bookingReducer;
