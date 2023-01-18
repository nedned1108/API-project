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
    <>
      <button onClick={openMenu} className='menu-button'>
        <i className="fas fa-solid fa-bars"></i>
        <i className="fas fa-duotone fa-circle-user"></i>
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li>{user.username}</li>
            <li>{user.firstName} {user.lastName}</li>
            <li>{user.email}</li>

            <li>
              <Link to='/spots/current' >Account</Link>
            </li>
            <li>
              <button onClick={logout} >Log Out</button>
            </li>
          </>
        ) : (
          <>
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
            >
              Demo User
            </button>
          </>
        )}
      </ul>
    </>
  );
};

export default ProfileButton;
