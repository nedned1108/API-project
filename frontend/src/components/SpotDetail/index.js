//frontend/src/components/SpotDetail/index.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { thunkLoadSpot } from "../../store/spots";
import { useParams } from "react-router-dom";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import EditSpotFormModal from "../EditSpotFormModal";

import './SpotDetail.css'
import comingSoon from '../../Image/Image_Coming_Soon.png'


const SpotDetail = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector(state => state.spots.singleSpot);
  const  { user } = useSelector(state => state.session)

  useEffect(() => {
    dispatch(thunkLoadSpot(spotId))
  }, [spotId])

  if (!spot) {
    return null;
  }
  const editListing = () => {

  }

  const deleteListing = () => {

  }
  return (
    <section>
      <div className="spot-detail-title">
        <h1>{spot.name}</h1>
        <div className="spot-detail-nav">
          <h4>{spot.avgRating} | {spot.numReviews} reviews | {spot.city}, {spot.state} {spot.country}</h4>
          {!user || user.id !== spot.Owner.id ? '' : (
          <div>
            <OpenModalMenuItem
              itemText={<i class="fas fa-solid fa-pen-to-square"></i>}
              modalComponent={<EditSpotFormModal spot={spot} />}
            />
            <button>{<i class="fas fa-solid fa-trash"></i>}</button>
          </div>
          )} 
        </div>
      </div>
      <div className="spot-detail-main-div">
        <div className="spot-detail-image-div">
          {spot.SpotImages.map((image, idx) => <img className={`spot-image-${idx}`} src={image.url} />)}
        </div>
      </div>
      <div className="bold" >Hosted by {spot.Owner.firstName}</div>
      <div className="spot-detail-div">
        <div className="spot-detail-hosts">
          <h4>Hosted by a super host</h4>
          <p>Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.</p>
          <h4>Great location</h4>
          <p>100% of recent guests gave the location a 5-star rating.</p>
          <h4>Great check-in experience</h4>
          <p>100% of recent guests gave the check-in process a 5-star rating.</p>
        </div>
        <div className="spot-detail-extra-info">
          <div className="spot-detail-price">
            <div>${spot.price} night</div>
            <div> {spot.avgRating} | {spot.numReviews} reviews </div>
          </div>
        </div>
      </div>
    </section>
  )
};

export default SpotDetail;
