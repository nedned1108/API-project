import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { thunkLoadAllSpots } from "../../store/spots";
import { useEffect } from "react";

const SpotsIndex = () => {
  const dispatch = useDispatch();
  const allSpotsData = useSelector(state => state.spots.allSpots);
  let allSpots = {};
  console.log("allSpotData ",allSpotsData)
  if (allSpotsData) allSpots = Object.values(allSpotsData);

  console.log("allSpots ",allSpots)

  
  useEffect(() => {
    dispatch(thunkLoadAllSpots())
  }, [])
  
  if (!allSpotsData) {
    return null;
  }

  return (
    <section>
      <ul>
        <h1>Spot Index</h1>
        {allSpots.map((spot) => <li key={spot.id}>{spot.address}</li>)}
      </ul>
    </section>
  )
};

export default SpotsIndex;
 