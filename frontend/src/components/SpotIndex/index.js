//frontend/src/components/SpotIndex/index.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { thunkLoadAllSpots } from "../../store/spots";
import SpotCard from "../SpotCard/SpotCard";
import './SpotIndex.css'

const SpotsIndex = () => {
  const dispatch = useDispatch();
  const allSpotsData = useSelector(state => state.spots.allSpots);
  let allSpots;
  if (allSpotsData) allSpots = Object.values(allSpotsData);
 
  useEffect(() => {
    dispatch(thunkLoadAllSpots())
  }, [dispatch])
  
  if (!allSpots) {
    return null;
  }

  return (
    <section>
      <div className="spots-main-div">
        {allSpots.map(spot => <SpotCard spot={spot} key={spot.id}/>)}
      </div>
    </section>
  )
};

export default SpotsIndex;
 