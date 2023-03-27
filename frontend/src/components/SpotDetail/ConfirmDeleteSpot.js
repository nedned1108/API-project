//frontend/src/components/SpotDetail/ConfirmDeleteSpot.js
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from "../../context/Modal";
import { thunkDeleteSpot } from "../../store/spots";

const ConfirmDeleteSpot = ({spotId}) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const cancel = () => {
    closeModal()
  }

  const confirm = () => {
    dispatch(thunkDeleteSpot(spotId))
    closeModal()
  }

  return (
    <div className="centered">
      <h1 className="modal-title">Delete Property</h1>
      <div className="confirm-cancel">
        <button onClick={confirm} >Confirm</button>
        <button onClick={cancel} >Cancel</button>
      </div>
    </div>
  )
}

export default ConfirmDeleteSpot;
