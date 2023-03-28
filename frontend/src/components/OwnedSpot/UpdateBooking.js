//frontend/src/components/OwnedSpot/UpdateBooking.js
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from "../../context/Modal";
import { thunkUpdateBooking } from "../../store/bookings";
import './OwnedSpot.css';


const UpdateBooking = ({booking}) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const dateConvert = (data) => {
    const dateData = new Date(data).toISOString().split('T')[0];
    return dateData
  }
  const [startDate, setStartDate] = useState(dateConvert(booking.startDate))
  const [endDate, setEndDate] = useState(dateConvert(booking.endDate))
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    let bookingData = {
      ...booking,
      endDate,
      startDate
    }
    return dispatch(thunkUpdateBooking(bookingData))
      .then(() => closeModal())
      .catch(async (res) => {
        const data = await res.json();
        setEndDate('')
        setStartDate('')
        if (data && data.errors) setErrors(data.errors);
      })
  }

  return (
    <section className="centered">
      <h1 className="modal-title">Update Booking</h1>
      <form onSubmit={handleSubmit} className='centered'>
        <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <div className="input-form">
          <label>Check in Date:</label>
          <input
            type='date'
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className='input-placeholder'
            required
          />
        </div>
        <div className="input-form">
          <label>Check out Date:</label>
          <input
            type='date'
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className='input-placeholder'
            required
          />
        </div>
        <button className="submit-button" type="submit">Update Booking</button>
      </form>
    </section>
  )
}

export default UpdateBooking;
