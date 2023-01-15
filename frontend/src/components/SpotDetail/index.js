//frontend/src/components/SpotDetail/index.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { thunkLoadSpot } from "../../store/spots";
import { useParams } from "react-router-dom";


const SpotDetail = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector(state => state.spots.singleSpot);
  console.log(spot)

  useEffect(() => {
    dispatch(thunkLoadSpot(spotId))
  }, [spotId])
  
  if (!spot) {
    return null;
  }

  return (
    <section>
      <h1>Spot Detail</h1>
      <h2>{spot.address}</h2>
    </section>
  )
};

export default SpotDetail;
