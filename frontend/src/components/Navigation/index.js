import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
// import * as sessionActions from '../../store/session';
import './Navigation.css';

function Navigation ({isLoaded}) {
  const sessionUser = useSelector((state) => state.session.user);
  // const dispatch = useDispatch();

  // const logout = (e) => {
  //   e.preventDefault();
  //   dispatch(sessionActions.logout());
  // };

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <li>
        <ProfileButton user={sessionUser} />
        {/* <button onClick={logout}>Log Out</button> */}
      </li>
    );
  } else {
    sessionLinks = (
      <li className='login-signup-nav'>
        <NavLink className='login-nav' to='/login' >Log In</NavLink>
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
