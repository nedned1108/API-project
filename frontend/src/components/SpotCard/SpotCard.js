import { useDispatch } from "react-redux";
import { useState } from "react";
import { Link } from "react-router-dom";
import './SpotCard.css'
import comingSoon from '../../Image/Image_Coming_Soon.png'

const SpotCard = ({ spot }) => {
  const dispatch = useDispatch();

  return (
    <div className="spotCard-main-div">
      <Link className="spot-city-state" to={`/${spot.id}`}>
        <img className="spot-previewImage" src={(spot.previewImage) ? spot.previewImage : comingSoon} />
        <p>{spot.city}, {spot.state}</p>
        <div className="price-div">
          <p>${spot.price}</p>
          <p className="price-night" >night</p>
        </div>
      </Link>
    </div>
  )
};

export default SpotCard;
