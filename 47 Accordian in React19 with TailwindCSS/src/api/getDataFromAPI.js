import { URL } from "../lib/constants";

export const getDataFromAPI = async () => {
  try {
    const res = await fetch(URL);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};
