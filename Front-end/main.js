'use strict';

import {getRestaurants} from './api/restaurant.js';
import {initRestaurants, initUiEventListeners} from './lib/components.js';
import {enableVPN} from './lib/enableVPN.js';
import {initMap} from './lib/map.js';
import {sortRestaurantsByDistance} from './lib/utils.js';

async function main() {
  const restaurants = await getRestaurants();
  if (restaurants === null) {
    enableVPN();
    return;
  }
  const sortedRestaurants = await sortRestaurantsByDistance(restaurants);
  localStorage.setItem('restaurants', JSON.stringify(sortedRestaurants));
  initMap(restaurants);
  initRestaurants(sortedRestaurants);
  initUiEventListeners();
}

main();
