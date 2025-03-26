'use strict';

import {displayDailyMenu} from './lib/displayDailyMenu.js';
import {getMenu} from './lib/getMenu.js';
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
const restaurantIcon = L.icon({
  iconUrl: 'assets/restaurant-icon.png',
  iconSize: [30, 30],
});

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

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
    L.marker(restaurant.location.coordinates.reverse(), {icon: restaurantIcon})
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

// Create restaurant card
function createRestaurantCard(name, address, postalCode, city, provider, id) {
  // HTMl section for restaurants
  const restaurantSection = document.querySelector('#restaurants');

  // Card
  const restaurantCard = document.createElement('div');
  restaurantCard.classList.add('restaurant-card');

  restaurantCard.addEventListener('click', function () {});

  // Card-header
  const cardHeader = document.createElement('div');
  cardHeader.classList.add('restaurant-header');

  const restaurantName = document.createElement('h3');
  restaurantName.classList.add('restaurant-name');
  restaurantName.innerText = name;

  const favoriteBtn = document.createElement('button');
  favoriteBtn.classList.add('heart-btn');
  favoriteBtn.innerText = '♡';

  cardHeader.append(restaurantName, favoriteBtn);

  // Card actions
  const restaurantActions = document.createElement('div');
  restaurantActions.classList.add('restaurant-actions');

  const restaurantInfo = document.createElement('div');
  restaurantInfo.classList.add('restaurant-info');

  const restaurantAddress = document.createElement('p');
  restaurantAddress.classList.add('restaurant-address');
  restaurantAddress.innerText = `${address}, ${postalCode} ${city}`;

  const restaurantProvider = document.createElement('p');
  restaurantProvider.classList.add('restaurant-provider');
  restaurantProvider.innerText = provider;

  restaurantInfo.append(restaurantAddress, restaurantProvider);

  const menuBtn = document.createElement('button');
  menuBtn.classList.add('menu-btn');
  menuBtn.innerText = 'Ruokalista';
  menuBtn.addEventListener('click', async function () {
    const dailyMenu = await getMenu('daily', id);
    console.log(dailyMenu);
    if (dailyMenu) {
      displayDailyMenu(dailyMenu);
    }
  });

  restaurantActions.append(restaurantInfo, menuBtn);

  restaurantCard.append(cardHeader, restaurantActions);

  restaurantSection.appendChild(restaurantCard);
}

// Restaurants to display
for (let restaurant of restaurants) {
  createRestaurantCard(
    restaurant.name,
    restaurant.address,
    restaurant.postalCode,
    restaurant.city,
    restaurant.company,
    restaurant._id
  );
}

// Menu
let selectedRestaurant;

const weeklyBtn = document.querySelector('#weekly-menu');
const dailyBtn = document.querySelector('#daily-menu');

weeklyBtn.addEventListener('click', function () {
  if (!weeklyBtn.classList.contains('selected')) {
    weeklyBtn.classList.add('selected');
    dailyBtn.classList.remove('selected');
    console.log('Weekly selected');
  }
});

dailyBtn.addEventListener('click', function () {
  if (!dailyBtn.classList.contains('selected')) {
    dailyBtn.classList.add('selected');
    weeklyBtn.classList.remove('selected');
    console.log('Daily selected');
  }
});
