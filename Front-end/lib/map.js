let map;
//import restoIcon from '/restaurant-icon.png'; // VITE BUILD

const restaurantIcon = L.icon({
  iconUrl: 'public/restaurant-icon.png', // dev
  //iconUrl: restoIcon, // VITE BUILD
  iconSize: [30, 30],
});

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

export function initMap(restaurants) {
  navigator.geolocation.getCurrentPosition(
    (pos) => success(pos, restaurants),
    error,
    options
  );
}

function success(pos, restaurants) {
  const crd = pos.coords;

  localStorage.setItem(
    'user-coordinates',
    JSON.stringify([pos.coords.longitude, pos.coords.latitude])
  );

  // Use the leaflet.js library to show the location on the map (https://leafletjs.com/)
  map = L.map('map').setView([crd.latitude, crd.longitude], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker([crd.latitude, crd.longitude])
    .addTo(map)
    .bindPopup('Olet tässä!')
    .openPopup();

  // Restaurants to map
  for (let restaurant of restaurants) {
    L.marker(restaurant.location.coordinates.reverse(), {icon: restaurantIcon})
      .addTo(map)
      .bindPopup(
        `<h3>${restaurant.name}</h3><p>${restaurant.address}, ${restaurant.city}</p>`
      );
  }
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

let lastLocation;

export function moveMapTo(coordinates, zoom = 15) {
  if (lastLocation == coordinates) {
    return;
  }
  map.flyTo(coordinates, zoom, {
    duration: 1.5,
    easeLinearity: 0.25,
  });
  lastLocation = coordinates;
}
