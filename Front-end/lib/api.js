'use strict';
/**
 *
 * @param {string} type
 * @param {Number} restaurant_id
 * @returns
 */
export async function getMenu(type, restaurant_id) {
  try {
    const response = await fetch(
      `https://media2.edu.metropolia.fi/restaurant//api/v1/restaurants/${type}/${restaurant_id}/fi`
    );
    if (!response.ok) {
      throw new Error('Invalid input!');
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(error, ' Error happened while fetching menu data.');
  }
}

export async function getRestaurants() {
  try {
    const response = await fetch(
      'https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants'
    );
    if (!response.ok) {
      throw new Error('Invalid input!');
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(error, ' Error happened while fetching restaurant data.');
  }
}
