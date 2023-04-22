//frontend/src/components/OwnedSpot/index.js
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { thunkLoadCurrentSpots } from "../../store/spots";
import { Redirect } from "react-router-dom";
import { thunkLoadUserBookings } from "../../store/bookings";
import { thunkLoadUserReviews } from "../../store/reviews";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import CreateSpotFormModal from "../CreateSpotFormModal";
import SpotCard from "../SpotCard/SpotCard";
import UpdateBooking from "./UpdateBooking";
import DeleteBooking from "./DeleteBooking";
import './OwnedSpot.css'

const OwnedSpot = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [yourBooking, setYourBooking] = useState(true);
  const [yourReview, setYourReview] = useState(false);
  const { user } = useSelector(state => state.session);
  const currentSpotsData = useSelector(state => state.spots.allSpots);
  const currentBookingData = useSelector(state => state.bookings.user)
  const reviewsData = useSelector((state) => state.reviews.user);
  let reviews;
  if (reviewsData) {
    reviews = Object.values(reviewsData)
  }

  useEffect(() => {
    dispatch(thunkLoadCurrentSpots())
    dispatch(thunkLoadUserBookings())
    dispatch(thunkLoadUserReviews())
  }, [dispatch]);

  let currentSpots;
  let userBookings;
  if (currentSpotsData) currentSpots = Object.values(currentSpotsData);
  if (currentBookingData) userBookings = Object.values(currentBookingData);

  const toSpot = (e) => {
    history.push(`/spots/${e}`)
  }

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
      <div>
        <div className="title-bar">
          <h1>Your Properties</h1>
          <div className="new-listing-div">
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
            </div>
          ))}
        </div>
      </div>
      <div className="bookingMainDiv">
        <div className="bookingDiv">
          <h1>Your Booking</h1>
          <div>
            {userBookings && userBookings.map(booking => {
              const start = new Date(booking.startDate)
              const end = new Date(booking.endDate)

              return (
                <div className="singleBooking">
                  <h3 onClick={() => toSpot(booking.spotId)} >{booking.Spot.name} - {booking.Spot.address}, {booking.Spot.city}, {booking.Spot.state}</h3>
                  <p>Check in: {start.getUTCMonth() + 1} - {start.getUTCDate()} - {start.getUTCFullYear()}</p>
                  <p>Check out: {end.getUTCMonth() + 1} - {end.getUTCDate()} - {end.getUTCFullYear()}</p>
                  <div className="hiddenDiv">
                    <div className="bookingButton">
                      <div className="updateButton">
                        <OpenModalMenuItem
                          itemText='Update'
                          modalComponent={<UpdateBooking booking={booking} />}
                        />
                      </div>
                      <div className="cancelButton">
                        <OpenModalMenuItem
                          itemText='Cancel'
                          modalComponent={<DeleteBooking booking={booking} />}
                        />
                      </div>
                  </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
};

export default OwnedSpot;
