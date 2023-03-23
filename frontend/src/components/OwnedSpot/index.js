//frontend/src/components/OwnedSpot/index.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { thunkLoadCurrentSpots } from "../../store/spots";
import { Redirect } from "react-router-dom";
import { thunkLoadUserBookings } from "../../store/bookings";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import CreateSpotFormModal from "../CreateSpotFormModal";
import SpotCard from "../SpotCard/SpotCard";
import UpdateBooking from "./UpdateBooking";
import './OwnedSpot.css'

const OwnedSpot = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { user } = useSelector(state => state.session);
  const currentSpotsData = useSelector(state => state.spots.allSpots);
  const currentBookingData = useSelector(state => state.bookings.user)

  useEffect(() => {
    dispatch(thunkLoadCurrentSpots())
    dispatch(thunkLoadUserBookings())
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
  if (!currentSpotsData || !currentBookingData) {
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
            {userBookings.map(booking => {
              const start = new Date(booking.startDate)
              const end = new Date(booking.endDate)

              return (
                <div className="singleBooking">
                  <h3 onClick={() => toSpot(booking.spotId)} >{booking.Spot.name} - {booking.Spot.address}, {booking.Spot.city}, {booking.Spot.state}</h3>
                  <p>Check in: {start.getUTCDate()}/{start.getUTCMonth() + 1}/{start.getUTCFullYear()}</p>
                  <p>Check out: {end.getUTCDate()}/{end.getUTCMonth() + 1} /{end.getUTCFullYear()}</p>
                  <div className="hidden">
                    <div className="updateButton">
                      <OpenModalMenuItem
                        itemText='Update Book'
                        modalComponent={<UpdateBooking booking={booking} />}
                      />
                    </div>
                    <div className="cancelButton">
                      <button>Cancel Book</button>
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
