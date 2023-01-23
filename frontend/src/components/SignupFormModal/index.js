//frontend/src/components/SignupFormModal/index.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css'

function SignupFormModal() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors([]);
      return dispatch(sessionActions.signup({ email, username, firstName, lastName, password }))
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
    }
    return setErrors(['Confirm Password field must be the same as the Password field'])
  }

  return (
    <section className='centered'>
      <h1 className='signup-title modal-title'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='signup-form centered'>
        <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <div className="input-form">
          <label>Email:</label>
          <input
            type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='input-placeholder'
          />
        </div>
        <div className="input-form">
          <label>Username</label>
          <input
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className='input-placeholder'
          />
        </div>
        <div className="input-form">
          <label>First Name</label>
          <input
            type='text'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className='input-placeholder'
          />
        </div>
        <div className="input-form">
          <label>Last Name</label>
          <input
            type='text'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className='input-placeholder'
          />
        </div>
        <div className="input-form">
          <label>Password</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='input-placeholder'
          />
        </div>
        <div className="input-form">
          <label>Confirm Password</label>
          <input
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className='input-placeholder'
          />
        </div>
        <button className='submit-button' type='submit' >Sign Up</button>
      </form>
    </section>
  )
};

export default SignupFormModal;
