//frontend/src/components/SpotDetail/index.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { thunkLoadSpot } from "../../store/spots";
import { thunkDeleteSpot } from "../../store/spots";
import { useParams } from "react-router-dom";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import EditSpotFormModal from "../EditSpotFormModal";
import CreateReviewFormModal from "../CreateReviewFormModal";
import SpotReview from "../SpotReview";

import './SpotDetail.css'
import comingSoon from '../../Image/Image_Coming_Soon.png'


const SpotDetail = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const spot = useSelector(state => state.spots.singleSpot);
  const { user } = useSelector(state => state.session)

  useEffect(() => {
    dispatch(thunkLoadSpot(spotId))
  }, [])

  if (!spot.Owner) {
    return null;
  }

  const deleteListing = () => {
    dispatch(thunkDeleteSpot(spotId))
    history.push('/')
  }
  return (
    <section>
      <div className="spot-detail-title">
        <h1>{spot.name}</h1>
        <div className="spot-detail-nav">
          <h4>{<i className="fas fa-solid fa-star"></i>} {spot.avgRating} | {spot.numReviews} reviews | {spot.city}, {spot.state} {spot.country}</h4>
          {!user || user.id !== spot.ownerId ? '' : (
            <div className="spot-detail-buttons">
              <OpenModalMenuItem
                className='edit-button'
                itemText={<i className="fas fa-solid fa-pen-to-square"></i>}
                modalComponent={<EditSpotFormModal spot={spot} />}
              />
              <button className="delete-button" onClick={deleteListing}>{<i className="fas fa-solid fa-trash"></i>}</button>
            </div>
          )}
        </div>
      </div>
      <div className="image-main-div">
        <div className="image-left-div">
          {spot.SpotImages.map((image, idx) => <img className={`spot-image-${idx}`} src={image.url} />)}
        </div>
        <div className="image-right-div">
          <img className="spot-image-1" src={comingSoon} />
          <img className="spot-image-2" src={comingSoon} />
          <img className="spot-image-3" src={comingSoon} />
          <img className="spot-image-4" src={comingSoon} />
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
        <div className="spot-detail-review">
          <div className="spot-detail-price">
            <div>${spot.price} night</div>
            <div> {spot.avgRating} | {spot.numReviews} reviews </div>
          </div>
          <div className="review-container">
            <h3>Reviews</h3>
            <div className="reviews-box">
              <SpotReview spotId={spotId} />
            </div>
            <div className="review-button-container">
              {/* <button className="review-button">Leave your Review</button> */}
              {(!user) ? '' : (
                <OpenModalMenuItem
                className=''
                itemText={'Leave your Review'}
                modalComponent={<CreateReviewFormModal spotId={spotId}/>}
              />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
};

export default SpotDetail;
