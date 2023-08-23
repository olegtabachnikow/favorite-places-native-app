import axios from 'axios';
const API_KEY = {some_api_key};

export function getMapPreview(lat: number, lng: number): string {
  const imagePreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=400x200&markers=color:red%7Clabel:S%7C${lat},${lng}&key=${API_KEY}`;
  return imagePreviewUrl;
}

export async function getAdress(lat: number, lng: number) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
  );
  return response.data.results[0].formatted_address;
}
