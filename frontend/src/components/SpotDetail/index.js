//frontend/src/components/SpotDetail/index.js
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { thunkLoadSpot } from "../../store/spots";
import { thunkCreateBooking } from "../../store/bookings";
import { thunkLoadLikes, thunkCreateLike, thunkDeleteLike } from "../../store/likes";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import EditSpotFormModal from "../EditSpotFormModal";
import CreateReviewFormModal from "../CreateReviewFormModal";
import ConfirmDeleteSpot from "./ConfirmDeleteSpot";
import SpotReview from "../SpotReview";

import './SpotDetail.css'
import comingSoon from '../../Image/Image_Coming_Soon.png'


const SpotDetail = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [errors, setErrors] = useState([]);
  const [isActive, setIsActive] = useState();
  const spot = useSelector(state => state.spots.singleSpot);
  const { user } = useSelector(state => state.session);
  const likesData = useSelector(state => state.likes);
  let likes;
  let userLike;
  if (likesData) {
    likes = Object.values(likesData);
    if (user) {
      userLike = likes.filter(like => like.userId == user.id)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    let bookingData = {
      spotId,
      endDate,
      startDate
    }

    dispatch(thunkCreateBooking(bookingData))
      .then(() => setEndDate(''))
      .then(() => setStartDate(''))
      .then(() => history.push('/spots/current'))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      })


  }

  const handleClick = () => {
    if (userLike.length == 0) {
      dispatch(thunkCreateLike(spotId))
      setIsActive(true);
    } else {
      dispatch(thunkDeleteLike(userLike[0].id))
      setIsActive(false);
    }
  }

  useEffect(() => {
    dispatch(thunkLoadSpot(spotId))
    dispatch(thunkLoadLikes(spotId))
  }, [dispatch])

  useEffect(() => {
    if (userLike && userLike.length == 0) {
      setIsActive(false)
    } else if (userLike && userLike.length != 0) {
      setIsActive(true)
    }
  })

  if (spot.avgRating === undefined || Object.values(spot.Owner).length === 0) {
    return null;
  }
  return (
    <section className="spot-detail-main-section">
      <div className="spot-detail-title">
        <h1>{spot.name}</h1>
        <div className="spot-detail-nav">
          <div>
            <h4>{<i className="fas fa-solid fa-star"></i>} {spot.avgRating.toFixed(2)} | {spot.numReviews} reviews | {likes ? likes.length : 0} {<i className="fas fa-solid fa-heart"></i>} </h4>
            <h4>{spot.city}, {spot.state} {spot.country}</h4>
          </div>
          {!user || user.id !== spot.ownerId ? 
          (user ?
            (<button className={`heart-button ${isActive ? 'active' : ''}`}  onClick={handleClick} >
              <div className="heart-flip"></div>
              <span>Like<span>d</span></span>
            </button>)
            : ''
          )
           : (
            <div className="spot-detail-buttons">
              <OpenModalMenuItem
                className='edit-button'
                itemText='Edit Property'
                modalComponent={<EditSpotFormModal spot={spot} />}
              />
              <OpenModalMenuItem
                className='delete-button'
                itemText='Remove Property'
                modalComponent={<ConfirmDeleteSpot spotId={spotId} />}
              />
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
      <div className="spot-host-description">
        <div className="bold" >Hosted by {spot.Owner.firstName}</div>
        <div className="spot-description">{spot.description}</div>
      </div>
      <div className="spot-detail-div">
        <div className="spot-detail-hosts">
          <h4 className="spot-detail-hosts-item">{<i className="fa-sharp fa-solid fa-medal"></i>}  Hosted by a super host</h4>
          <p className="spot-detail-hosts-item">Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.</p>
          <h4 className="spot-detail-hosts-item">{<i className="fa-solid fa-location-dot"></i>}  Great location</h4>
          <p className="spot-detail-hosts-item">100% of recent guests gave the location a 5-star rating.</p>
          <h4 className="spot-detail-hosts-item">{<i class="fa-solid fa-check"></i>}  Great check-in experience</h4>
          <p className="spot-detail-hosts-item">100% of recent guests gave the check-in process a 5-star rating.</p>
          <div>
            <img className="aircover-img" src="https://a0.muscache.com/im/pictures/54e427bb-9cb7-4a81-94cf-78f19156faad.jpg"/>
            <p>Every booking includes free protection from Host cancellations, listing inaccuracies, and other issues like trouble checking in.</p>
            <p>Large private walkout basement Suite on Lake Keowee; fully appointed to make your stay a pleasure.</p>
          </div>
          <div className="reviewMainDiv">
            <h3>Reviews</h3>
            <SpotReview spotId={spotId} />
            {(!user || user.id == spot.ownerId) ? '' :
              <div className="review-button-container noL bold">
                <OpenModalMenuItem
                  itemText={'Leave Review'}
                  modalComponent={<CreateReviewFormModal spotId={spotId} user={user} />}
                />
              </div>
            }
          </div>
        </div>
        <div className="spot-detail-booking">
          <div className="spot-detail-price">
            <div className="bold">${spot.price} night</div>
            <div className="bold">{<i className="fas fa-solid fa-star"></i>}{spot.avgRating.toFixed(2)} | {spot.numReviews} reviews </div>
          </div>
          <div className="spotBookingDiv">
            <form onSubmit={handleSubmit} className="bookingForm">
              <ul>
                {errors.map((error, idx) => <li key={idx}>{error}</li>)}
              </ul>
              <div className="check-in-out">
                <div>
                  <label>Check in:</label>
                  <input
                    type='date'
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div style={{borderLeft: "1px black solid"}}>
                  <label>Check out:</label>
                  <input
                    type='date'
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              {user ?
                <div>
                  <button className='reserveButton' type="submit">Reserve</button>
                </div>
                : 
                <div style={{display: 'flex', justifyContent: 'center', paddingTop: '20px', color: 'red', fontWeight: '600'}}>Log in to Reserve</div>
              }
            </form>
          </div>
          <div className="bookingFee">
            <p>You won't be charged yet</p>
            <div className="total-fee">
              <div className="fee">
                <p>${spot.price} x 5 nights</p>
                <p>Cleaning fee</p>
                <p>Service fee</p>
              </div>
              <div className="total">
                <p>${spot.price * 5}</p>
                <p>${(spot.price * 10 / 100 + 50).toFixed(2)}</p>
                <p>${(spot.price * 7 / 100 + 100).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
};

export default SpotDetail;
