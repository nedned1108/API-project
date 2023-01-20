import { useDispatch } from "react-redux";
import { useState } from "react";
import { Link } from "react-router-dom";
import './SpotCard.css'
import comingSoon from '../../Image/Image_Coming_Soon.png'

const SpotCard = ({ spot }) => {
  const dispatch = useDispatch();

  return (
    <div className="spotCard-main-div">
      <Link className="spot-city-state" to={`/spots/${spot.id}`}>
        <img className="spot-previewImage" src={(spot.previewImage) ? spot.previewImage : comingSoon} />
        <div className="spot-card-info">
          <div className="spot-card-bottom-left">
          <div>{spot.city}, {spot.state}</div>
          <div>{spot.name}</div>
          <div className="price-div">
            <div>${spot.price}</div>
            <div className="price-night" >night</div>
          </div>
          </div>
          <div>
            <p>{<i className="fas fa-solid fa-star"></i>} {spot.avgRating.toFixed(2)}</p>
          </div>
        </div>
      </Link>
    </div>
  )
};

export default SpotCard;
