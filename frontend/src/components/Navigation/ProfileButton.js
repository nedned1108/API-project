// frontend/src/components/Navigation/ProfileButton.js
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { Link } from 'react-router-dom';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false)
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  }

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };

  const LoginDemoUser = (e) => {
    e.preventDefault();
    closeMenu();
    return dispatch(sessionActions.login({ credential: 'JohnSmith', password: 'johnsmith' }))
  }

  const ulClassName = 'profile-dropdown' + (showMenu ? "" : " hidden");

  return (
    <div className='profile-menu'>
      <button onClick={openMenu} className='menu-button'>
        <i className="fas fa-solid fa-bars"></i>
        <i className="fas fa-duotone fa-circle-user"></i>
      </button>
      <ul className={`${ulClassName}`} ref={ulRef}>
        {user ? (
          <div className='dropdown-div'>
            <div>{user.username}</div>
            <div>
              <Link onClick={closeMenu} className='noU' to='/spots/current' >Profile</Link>
            </div>
            <div>
              <button className='logout-button' onClick={logout} >Log Out</button>
            </div>
          </div>
        ) : (
          <div className='dropdown-div'>
            <OpenModalMenuItem
              itemText='Log In'
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText='Sign Up'
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
            <button
              onClick={LoginDemoUser}
              className='demo-user-button'
            >
              Demo User
            </button>
          </div>
        )}
      </ul>
    </div>
  );
};

export default ProfileButton;
