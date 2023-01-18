//frontend/src/components/CreateSpotFormModal/index.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from "../../context/Modal";
import { thunkCreateSpot } from "../../store/spots";
import { Redirect, useHistory } from 'react-router-dom';

const CreateSpotFormModal = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.session)
  const history = useHistory();
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(1);
  const [previewImage, setPreviewImage] = useState('')
  const [errors, setErrors] = useState([]);
  const [newSpot, setNewSpot] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    let spot = {
      spotData: {
        ownerId: user.id,
        address,
        city,
        state,
        country,
        lat: 123.1234567,
        lng: 123.1234567,
        name,
        description,
        price,
      },
      spotImage: {
        url: previewImage
      }
    };


      dispatch(thunkCreateSpot(spot))
        // .then((res) => setNewSpot(res))
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        })
  }

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
        <div className="input-form">
          <label>Add your place's photo</label>
          <input
            type='url'
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
            placeholder="https://example.com"
            className='input-placeholder'
          />
        </div>
        <button className="submit-button" type="submit">Create New Listing</button>
      </form>
    </section>
  )
}

export default CreateSpotFormModal;
