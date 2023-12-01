import "./Map.css";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Popup, Marker, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
interface Position {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
    // Add other properties if needed
  };
  // Add other properties if needed
}

const destionation = {
  lat: 41.8737696,
  lng: -87.650714,
};

const colorScheme = [
  "#FF2E2E",
  "#FF5B00",
  "#FF792E",
  "#E8833F",
  "#D18D50",
  "#BA9761",
  "#75B694",
  "#5EC0A5",
  "#47CAB6",
  "#30D5C8",
];

const getColorScale = (distance: number): string => {
  // Assuming blue for furthest distance, red for closest distance
  const maxDistance = 100; // Adjust this based on your scenario

  if (distance > maxDistance) {
    return colorScheme[colorScheme.length - 1];
  }

  return colorScheme[Math.floor((distance / maxDistance) * colorScheme.length)];
};

// to calculate the distance between two points in meters
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  // Radius of the Earth in meters
  const R = 6371000; // meters

  // Convert latitude and longitude from degrees to radians
  const radLat1 = (lat1 * Math.PI) / 180;
  const radLon1 = (lon1 * Math.PI) / 180;
  const radLat2 = (lat2 * Math.PI) / 180;
  const radLon2 = (lon2 * Math.PI) / 180;

  // Calculate differences
  const dLat = radLat2 - radLat1;
  const dLon = radLon2 - radLon1;

  // Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radLat1) *
      Math.cos(radLat2) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distance in meters
  const distance = R * c;

  return distance;
}

const Map = () => {
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>(
    colorScheme[colorScheme.length - 1]
  );
  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Your browser doesn't support geolocation feature!");
      return;
    }

    setInterval(() => {
      navigator.geolocation.watchPosition(
        (position) => {
          setCurrentPosition(position);
          console.log(position);
        },
        (error) => {
          console.log(error);
        },
        { enableHighAccuracy: true }
      );
    }, 2000);
  }, []);

  useEffect(() => {
    if (currentPosition) {
      const distance = haversineDistance(
        currentPosition.coords.latitude,
        currentPosition.coords.longitude,
        destionation.lat,
        destionation.lng
      );
      console.log(distance);
      const temp = getColorScale(distance);
      console.log(temp);
      setBackgroundColor(temp);
      if (distance < 5) {
        window.alert("You are close to the destination!");
      }
    }
  }, [currentPosition]);
  return (
    <div className="map">
      {currentPosition && (
        <MapContainer
          center={[
            currentPosition.coords.latitude,
            currentPosition.coords.longitude,
          ]}
          zoom={25}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker
            position={[
              currentPosition.coords.latitude,
              currentPosition.coords.longitude,
            ]}
          >
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
          <Marker position={[destionation.lat, destionation.lng]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
          <Circle
            center={[
              currentPosition.coords.latitude,
              currentPosition.coords.longitude,
            ]}
            radius={
              currentPosition.coords.accuracy > 50
                ? currentPosition.coords.accuracy / 10
                : currentPosition.coords.accuracy
            } // Use the accuracy value as the radius
            color={backgroundColor}
          />
        </MapContainer>
      )}
    </div>
  );
};
export default Map;
