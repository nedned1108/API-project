//frontend/src/components/CreateSpotForm/index.js
import SpotForm from "../SpotForm";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

const CreateSpotForm = () => {
  const { user } = useSelector(state => state.session);
  if (!user) {
    return (
      <Redirect to='/' />
    )
  }
  const spot = {
    ownerId: user.id,
    address: '',
    city: '',
    state: '',
    country: '',
    lat: '',
    lng: '',
    name: '',
    description: '',
    price: 1
  };
  return (
    <SpotForm spot={spot} formType="Create Listing" />
  )
}

export default CreateSpotForm
