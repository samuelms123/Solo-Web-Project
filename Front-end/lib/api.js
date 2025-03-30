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

export async function checkUsernameAvailability(username) {
  try {
    const response = await fetch(
      `https://media2.edu.metropolia.fi/restaurant/api/v1/users/available/${username}`
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

export async function createUser(username, password, email) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      password: password,
      email: email,
    }),
  };

  try {
    const response = await fetch(
      'https://media2.edu.metropolia.fi/api/v1/users',
      options
    );

    if (!response.ok) {
      throw new Error('Invalid input!');
    }

    const json = await response.json();
    console.log(json);
    return json;
  } catch (error) {
    console.log(error, ' Error happened while creating user.');
  }
}
