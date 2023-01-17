//frontend/src/components/CreateSpotForm/index.js
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { thunkCreateSpot } from "../../store/spots";

const CreateSpotForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {user} = useSelector(state => state.session)
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const createdSpot = {
      ownerId: user.id,
      address,
      city,
      state, 
      country,
      lat,
      lng,
      name,
      description,
      price
    };

    if (createdSpot) {
      dispatch(thunkCreateSpot(createdSpot))
    }
    reset();
    history.push('/spots/current')
  };

  const reset = () => {
    setAddress('')
    setCity('')
    setState('')
    setCountry('')
    setLat('')
    setLng('')
    setName('')
    setDescription('')
    setPrice(1)
  };

  const handleCancelClick = () => {
    reset();
    history.push('/spots/current')
  }

  return (
    <section>
      <h1>Create Spot</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Address:
          <input 
            type='text'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
        <label>
          City:
          <input 
            type='text'
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </label>
        <label>
          State:
          <input 
            type='text'
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </label>
        <label>
          Country:
          <input 
            type='text'
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </label>
        <label>
          Latitude:
          <input 
            type='number'
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
        </label>
        <label>
          Longitude:
          <input 
            type='number'
            value={lng}
            onChange={(e) => setLng(e.target.value)}
          />
        </label>
        <label>
          Name:
          <input 
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Description:
          <input 
            type='text'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          Price per night:
          <input 
            type='number'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </label>
        <button type="submit">Create New Listing</button>
        <button type="button" onClick={handleCancelClick}>Cancel</button>
      </form>
    </section>
  )
}

export default CreateSpotForm
