//frontend/src/components/OwnedSpot/index.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { thunkLoadCurrentSpots } from "../../store/spots";
import { Redirect, Link } from "react-router-dom";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import CreateSpotFormModal from "../CreateSpotFormModal";
import SpotCard from "../SpotCard/SpotCard";
import './OwnedSpot.css'

const OwnedSpot = () => {
  const { user } = useSelector(state => state.session);
  const dispatch = useDispatch();
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
          <OpenModalMenuItem
            itemText='New Listing'
            modalComponent={<CreateSpotFormModal />}
          />
        </div>
      </div>
      <div className="owned-spots-main-div">
        {currentSpots.map(spot => (
          <div>
            <SpotCard spot={spot} key={spot.id} />
            <button>Edit</button>
          </div>
        ))}
      </div>
    </div>
  )
};

export default OwnedSpot;
