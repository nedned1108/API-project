// frontend/src/components/LoginFormPage/index.js
import React, { useState } from 'react'
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux'
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
  }

  return (
    <section className='centered'>
      <h1 className='login-title modal-title'>Log In</h1>
      <form onSubmit={handleSubmit} className='login-form centered'>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <div className="input-form">
        <label>Username or Email:</label>
          <input
            type='text'
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            className='input-placeholder'
          />
        </div>
        <div className="input-form">
        <label>Password:</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='input-placeholder'
          />
        </div>
        
        <button className='submit-button' type='submit' >Log In</button>
      </form>
    </section>
  )
};

export default LoginFormModal;
