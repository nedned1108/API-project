// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Switch } from "react-router-dom";
import * as sessionActions from './store/session';
import Navigation from './components/Navigation';
import SpotsIndex from './components/SpotIndex';
import SpotDetail from './components/SpotDetail';
import OwnedSpot from './components/OwnedSpot';
import './index.css';
import Footer from './components/Footer';


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return isLoaded && (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path='/'>
            <SpotsIndex />
          </Route>
          <Route exact path='/spots/current' >
            <OwnedSpot />
          </Route>
          <Route path='/spots/:spotId'>
            <SpotDetail />
          </Route>
          <Route>
            Page not Found!
          </Route>
        </Switch>
      )}
      <Footer />
    </>
  );
}

export default App;
