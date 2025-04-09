export function filterRestaurants(restaurants, city, provider) {
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const cityMatch = city ? restaurant.city.includes(city) : true;
    const providerMatch = provider
      ? restaurant.company.includes(provider)
      : true;
    return cityMatch && providerMatch;
  });

  return filteredRestaurants;
}
