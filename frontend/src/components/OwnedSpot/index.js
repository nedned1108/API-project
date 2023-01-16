//frontend/src/components/OwnedSpot/index.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { thunkLoadCurrentSpots } from "../../store/spots";
import SpotCard from "../SpotCard/SpotCard";
import './OwnedSpot.css'

const OwnedSpot = () => {
  const dispatch = useDispatch();
  const currentSpotsData = useSelector(state => state.spots.currentSpot);

  useEffect(() => {
    dispatch(thunkLoadCurrentSpots())
  }, [])

  let currentSpots;
  if (currentSpotsData) currentSpots = Object.values(currentSpotsData);

  if (!currentSpotsData) {
    return null;
  }
  
  return (
    <section>
      <h1>Your Properties</h1>
      <div className="owned-spots-main-div">
        {currentSpots.map(spot => <SpotCard spot={spot} key={spot.id}/>)}
      </div>
    </section>
  )
};

export default OwnedSpot;
