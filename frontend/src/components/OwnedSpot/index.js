//frontend/src/components/OwnedSpot/index.js
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { thunkLoadCurrentSpots } from "../../store/spots";
import { Redirect, Link } from "react-router-dom";
import SpotCard from "../SpotCard/SpotCard";
import './OwnedSpot.css'

const OwnedSpot = () => {
  const { user } = useSelector(state => state.session);
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const currentSpotsData = useSelector(state => state.spots.currentSpot);

  useEffect(() => {
    dispatch(thunkLoadCurrentSpots())
  }, []);

  let currentSpots;
  if (currentSpotsData) currentSpots = Object.values(currentSpotsData);
  if (!user) {
    return (
      <Redirect to='/' />
    )
  }
  if (!currentSpotsData) {
    return null
  }

  return (
    <div className="owned-spots-div">
      <div className="title-bar">
        <h1>Your Properties</h1>
        <div>
          <Link to='/spots/new'>New Listing</Link>
        </div>
      </div>
      <div className="owned-spots-main-div">
        {currentSpots.map(spot => <SpotCard spot={spot} key={spot.id} />)}
      </div>
    </div>
  )
};

export default OwnedSpot;
