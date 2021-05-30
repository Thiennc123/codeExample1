import axios from "axios";
import { authHeader } from '@iso/lib/helpers/authHeader';

export const googleService = {
  getLatLng
};

function getLatLng(address){
  return (
    axios
    .get(
      `https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.REACT_APP_GOOGLE_API_KEY}&address=${address}`,
      { crossdomain: true },
      {
        headers: authHeader()
      }
    )
    .then(res => {
      if(res && res.status === 200){
        return res.data;
      }
    })
  );
}