import { Loader } from "@googlemaps/js-api-loader";

const googleMapsLoader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
});

export default googleMapsLoader;
