import { useDispatch } from "react-redux";
import { useState } from "react";
import './SpotCard.css'

const SpotCard = ({ spot }) => {
  const dispatch = useDispatch();
  
  return (
    <div className="spotCard-main-div">
      <h4>{spot.address}</h4>
    </div>
  )
};

export default SpotCard;
