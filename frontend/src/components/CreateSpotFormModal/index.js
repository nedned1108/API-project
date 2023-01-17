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
        <label>Address:</label>
          <input
            type='text'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        
        <label>City:</label>
          <input
            type='text'
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        
        <label>State:</label>
          <input
            type='text'
            value={state}
            onChange={(e) => setState(e.target.value)}
          />

        <label>Country:</label>
          <input
            type='text'
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        
        <label>Name:</label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        
        <label>Description:</label>
          <input
            type='text'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        
        <label>Price per night:</label>
          <input
            type='number'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        
        <button type="submit">Create New Listing</button>
      </form>
    </section>
  )
}

export default CreateSpotFormModal;
