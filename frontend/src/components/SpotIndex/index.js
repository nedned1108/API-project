import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { thunkLoadAllSpots } from "../../store/spots";
import { useEffect } from "react";
import SpotCard from "../SpotCard/SpotCard";
import './SpotIndex.css'

const SpotsIndex = () => {
  const dispatch = useDispatch();
  const allSpotsData = useSelector(state => state.spots.allSpots);
  let allSpots = {};
  console.log("allSpotData ",allSpotsData)
  if (allSpotsData) allSpots = Object.values(allSpotsData);

  console.log("allSpots ",allSpots)

  
  useEffect(() => {
    dispatch(thunkLoadAllSpots())
  }, [dispatch])
  
  if (!allSpotsData) {
    return null;
  }

  return (
    <section>
      <div className="spots-main-div">
        {allSpots.map(spot => <SpotCard spot={spot} key={spot.id}/>)}
      </div>
    </section>
  )
};

export default SpotsIndex;
 