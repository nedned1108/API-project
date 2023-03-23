//frontend/src/components/OwnedSpot/DeleteBooking.js
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from "../../context/Modal";
import { thunkDeleteBooking } from "../../store/bookings";
import './OwnedSpot.css';

const DeleteBooking = ({booking}) => {
  console.log(booking)
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const cancel = () => {
    closeModal()
  }

  const confirm = () => {
    dispatch(thunkDeleteBooking(booking.id))
    closeModal()
  }

  return (
    <div className="centered">
      <h1 className="modal-title">Cancel Booking</h1>
      <div className="confirm-cancel">
        <button onClick={confirm} >Confirm</button>
        <button onClick={cancel} >Cancel</button>
      </div>
    </div>
  )
}

export default DeleteBooking;
