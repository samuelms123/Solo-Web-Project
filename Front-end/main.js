'use strict';

import {getRestaurants} from './lib/api.js';
import {initRestaurants, initUiEventListeners} from './lib/components.js';
import {initMap} from './lib/map.js';

async function main() {
  const restaurants = await getRestaurants();
  initMap(restaurants);
  initRestaurants(restaurants);
  initUiEventListeners();
}

main();
