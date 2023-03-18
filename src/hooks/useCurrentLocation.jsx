import { useEffect, useState } from "react";

function useCurrentLocation() {
    const [lat, setLat] = useState();
    const [lng, setLng] = useState();

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setLat(position.coords.latitude);
                setLng(position.coords.longitude);
            })
        } else {
            console.log("Not Available");
        }
    }, [lat, lng]);

    return { lat, lng };
}

export default useCurrentLocation;