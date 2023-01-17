//frontend/src/components/SpotForm/index.js
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Redirect } from 'react-router-dom';
import { thunkCreateSpot } from "../../store/spots";

const SpotForm = ({ spot, formType }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { user } = useSelector(state => state.session)
  const [address, setAddress] = useState(spot.address);
  const [city, setCity] = useState(spot.city);
  const [state, setState] = useState(spot.state);
  const [country, setCountry] = useState(spot.country);
  const [lat, setLat] = useState(spot.lat);
  const [lng, setLng] = useState(spot.lng);
  const [name, setName] = useState(spot.name);
  const [description, setDescription] = useState(spot.description);
  const [price, setPrice] = useState(spot.price);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    const newSpot = { ...spot, address, city, state, country, lat, lng, name, description, price }

    try {
      await dispatch(thunkCreateSpot(newSpot))
    } catch (error) {
      setErrors(error)
    }

    if (newSpot) {
      reset();
      history.push('/spots/current')
    }
  };

  if (!user) {
    <Redirect to='/'/>
  }

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
    setErrors([])
  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    reset();
    history.push('/spots/current')
  }

  return (
    <section className="create-spot-form centered">
      <h1>{formType}</h1>
      <form onSubmit={handleSubmit} className='centered'>
        <ul>
          {/* {errors.map((error, idx) => <li key={idx}>{error}</li>)} */}
        </ul>
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

export default SpotForm
