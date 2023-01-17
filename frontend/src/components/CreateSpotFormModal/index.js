//frontend/src/components/SpotForm/index.js
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from "../../context/Modal";
import { thunkCreateSpot } from "../../store/spots";

const CreateSpotFormModal = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.session)
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(1);
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const spot = {
      ownerId: user.id,
      address,
      city, 
      state, 
      country,
      lat: 123.1234567,
      lng: 123.1234567,
      name, 
      description, 
      price
    }

    setErrors([]);
    return dispatch(thunkCreateSpot(spot))
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
      </form>
    </section>
  )
}

export default CreateSpotFormModal;
