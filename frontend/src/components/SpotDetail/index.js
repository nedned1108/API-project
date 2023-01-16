//frontend/src/components/SpotDetail/index.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { thunkLoadSpot } from "../../store/spots";
import { useParams } from "react-router-dom";
import './SpotDetail.css'
import comingSoon from '../../Image/Image_Coming_Soon.png'


const SpotDetail = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector(state => state.spots.singleSpot);
  
  if (spot) console.log("spot ",spot.SpotImages)

  useEffect(() => {
    dispatch(thunkLoadSpot(spotId))
  }, [spotId])
  
  if (!spot) {
    return null;
  }

  return (
    <section>
      <div className="spot-detail-title">
        <h1>{spot.name}</h1>
      </div>
      <div className="spot-detail-main-div">
        <div className="spot-detail-image-div">
          {spot.SpotImages.map((image, idx) => <img className={`spot-image-${idx}`} src={image.url} />)}
        </div>
        <div>

        </div>
      </div>
    </section>
  )
};

export default SpotDetail;
