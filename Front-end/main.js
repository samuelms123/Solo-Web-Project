'use strict';

import {createRestaurantCard} from './lib/createRestaurantCard.js';
import {getRestaurants} from './lib/getRestaurants.js';

// Get restaurants
const restaurants = await getRestaurants();
console.log(restaurants);

// HEADER
window.addEventListener('scroll', function () {
  let header = document.querySelector('header');
  if (window.scrollY > 10) {
    header.classList.add('header-moving');
  } else {
    header.classList.remove('header-moving');
  }
});

// MAP
const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

// A function that is called when location information is retrieved
function success(pos) {
  const crd = pos.coords;

  // Printing location information to the console
  console.log('Your current position is:');
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);

  // Use the leaflet.js library to show the location on the map (https://leafletjs.com/)
  const map = L.map('map').setView([crd.latitude, crd.longitude], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker([crd.latitude, crd.longitude])
    .addTo(map)
    .bindPopup('I am here.')
    .openPopup();

  // Restaurants to map
  for (let restaurant of restaurants) {
    L.marker(restaurant.location.coordinates.reverse())
      .addTo(map)
      .bindPopup(
        `<h3>${restaurant.name}</h3><p>${restaurant.address}, ${restaurant.city}</p>`
      );
  }
}

// Function to be called if an error occurs while retrieving location information
function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

// Starts the location search
navigator.geolocation.getCurrentPosition(success, error, options);

// Restaurants to display

for (let restaurant of restaurants) {
  createRestaurantCard(
    restaurant.name,
    restaurant.address,
    restaurant.postalCode,
    restaurant.city,
    restaurant.company
  );
}
