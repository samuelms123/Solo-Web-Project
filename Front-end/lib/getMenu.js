/*
daily: /api/v1/restaurants/daily/:id/:lang
weeky: /api/v1/restaurants/weekly/:id/:lang
*/

export async function getMenu(type, restaurant_id) {
  if (type === 'daily') {
    try {
      const response = await fetch(
        `https://media2.edu.metropolia.fi/restaurant//api/v1/restaurants/daily/${restaurant_id}/fi`
      );
      if (!response.ok) {
        throw new Error('Invalid input!');
      }
      const json = await response.json();
      return json;
    } catch (error) {
      console.log(error, ' Error happened while fetching daily menu data.');
    }
  } else {
    try {
      const response = await fetch(
        `https://media2.edu.metropolia.fi/restaurant//api/v1/restaurants/weekly/${restaurant_id}/fi`
      );
      if (!response.ok) {
        throw new Error('Invalid input!');
      }
      const json = await response.json();
      return json;
    } catch (error) {
      console.log(error, ' Error happened while fetching weekly menu data.');
    }
  }
}
