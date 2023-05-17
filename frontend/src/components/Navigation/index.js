// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import SearchBar from './SearchBar';
import Logo from '../../Image/mybnb-logo.png'
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul className='nav-bar'>
      <NavLink className='home-nav' exact to='/'>
        <img className='logo' src={Logo} alt='logo' />
      </NavLink>
      
      <SearchBar />
      
      {isLoaded && (
        <ProfileButton user={sessionUser} />
      )}
    </ul>
  )
};

export default Navigation;
