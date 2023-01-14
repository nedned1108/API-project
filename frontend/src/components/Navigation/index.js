// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import './Navigation.css';

function Navigation ({isLoaded}) {
  const sessionUser = useSelector((state) => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <li>
        <ProfileButton user={sessionUser} />
      </li>
    );
  } else {
    sessionLinks = (
      <li className='login-signup-nav'>
        <OpenModalButton 
          buttonText='Log In'
          modalComponent={<LoginFormModal />}
        />
        <NavLink className='signup-nav' to='/signup' >Sign Up</NavLink>
      </li>
    )
  }
  return (
    <ul className='nav-bar'>
      <li>
        <NavLink className='home-nav' exact to='/'>Home</NavLink>
      </li>
      {isLoaded && sessionLinks}
    </ul>
  )
};

export default Navigation;
