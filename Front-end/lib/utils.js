// Scroll to the bottom menu section
export function scrollToMenu() {
  const target = document.querySelector('#menu');
  const offset = 100;

  const targetPosition = target.getBoundingClientRect().top + window.scrollY;

  window.scrollTo({
    top: targetPosition - offset,
    behavior: 'smooth',
  });
}

/**
 *
 * @param {number[]} start geoJSON point 1
 * @param {number[]} finish geoJSON point 2
 * @returns distance between point 1 - 2
 */

export function calculateDistance(start, finish) {
  return (
    105 *
    Math.sqrt(
      Math.pow(finish[0] - start[0], 2) + Math.pow(finish[1] - start[1], 2)
    )
  );
}

function getUserLocation() {
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = position.coords;
          resolve([coords.longitude, coords.latitude]);
        },
        (error) => {
          reject('Error getting location: ' + error.message);
        }
      );
    } else {
      reject('Geolocation is not supported by this browser.');
    }
  });
}

export async function sortRestaurantsByDistance(restaurants) {
  try {
    const userCoords = await getUserLocation();
    const sortedRestaurants = restaurants
      .map((restaurant) => {
        const distance = calculateDistance(
          userCoords,
          restaurant.location.coordinates
        );

        return {
          ...restaurant,
          distanceFromUser: distance.toFixed(0),
        };
      })
      .sort((a, b) => a.distanceFromUser - b.distanceFromUser);

    console.log('sorting done!');
    return sortedRestaurants;
  } catch (error) {
    console.log('error in sorting restaurants!', error);
    return restaurants;
  }
}

// const d = calculateDistance([24.950631, 60.169096], [24.946847, 60.194701]);
// console.log('distance', d);
