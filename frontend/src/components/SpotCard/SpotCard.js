import { useDispatch } from "react-redux";
import { useState } from "react";
import { Link } from "react-router-dom";
import './SpotCard.css'

const SpotCard = ({ spot }) => {
  const dispatch = useDispatch();
  
  return (
    <div className="spotCard-main-div">
      <img className="spot-previewImage" src={spot.previewImage} />
      <Link className="spot-city-state" to={`/${spot.id}`}>{spot.city}, {spot.state}</Link>
    </div>
  )
};

export default SpotCard;
