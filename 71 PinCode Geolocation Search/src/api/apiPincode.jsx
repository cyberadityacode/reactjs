import axios from "axios";

// create instance of axios

const api = axios.create({
  baseURL: "https://api.zippopotam.us/in",
});

// Fetch Data

export const fetchPincodeDetails = (pincode) => {
  return api.get(`/${pincode}`);
};
