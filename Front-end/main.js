'use strict';

import {getRestaurants} from './api/restaurant.js';
import {initRestaurants} from './lib/components.js';
import {initMap} from './lib/map.js';
import {sortRestaurantsByDistance} from './lib/utils.js';

async function main() {
  const restaurants = await getRestaurants();
  const sortedRestaurants = await sortRestaurantsByDistance(restaurants);
  localStorage.setItem('restaurants', JSON.stringify(sortedRestaurants));
  initMap(restaurants);
  initRestaurants(sortedRestaurants);
}

main();
