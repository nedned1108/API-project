//frontend/src/components/SpotForm/index.js
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from "../../context/Modal";
import { thunkUpdateSpot } from "../../store/spots";
import './EditSpotFormModal.css'

const EditSpotFormModal = ({ spot }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.session)
  const [address, setAddress] = useState(spot.address);
  const [city, setCity] = useState(spot.city);
  const [state, setState] = useState(spot.state);
  const [country, setCountry] = useState(spot.country);
  const [name, setName] = useState(spot.name);
  const [description, setDescription] = useState(spot.description);
  const [price, setPrice] = useState(spot.price);
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    let updatedSpot = {
      ...spot,
      address,
      city,
      state,
      country,
      lat: spot.lat,
      lng: spot.lng,
      name,
      description,
      price
    }

    setErrors([]);
    return dispatch(thunkUpdateSpot(updatedSpot))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  };

  return (
    <section className="create-spot-form centered">
      <h1>Create Listing</h1>
      <form onSubmit={handleSubmit} className='centered'>
        <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <div className="input-form">
          <label>Address:</label>
          <input
            type='text'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className='input-placeholder'
          />
        </div>
        <div className="input-form">
          <label>City:</label>
          <input
            type='text'
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className='input-placeholder'
          />
        </div>
        <div className="input-form">
          <label>State:</label>
          <input
            type='text'
            value={state}
            onChange={(e) => setState(e.target.value)}
            className='input-placeholder'
          />
        </div>
        <div className="input-form">
          <label>Country:</label>
          <input
            type='text'
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className='input-placeholder'
          />
        </div>
        <div className="input-form">
          <label>Name:</label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='input-placeholder'
          />
        </div>
        <div className="input-form">
          <label>Description:</label>
          <input
            type='text'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='input-placeholder'
          />
        </div>
        <div className="input-form">
          <label>Price per night:</label>
          <input
            type='number'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className='input-placeholder'
          />
        </div>
        <button className="submit-button" type="submit">Update Listing</button>
      </form>
    </section>
  )
}

export default EditSpotFormModal;
