/*
<div class="daily-menu-card">
              <h3 class="menu-day">Maanantai</h3>
              <h4 class="menu-name">
                Paahdettua kesäkurpitsaa, tomaatti-linssimuhennosta ja Ras
                elHanout -kikherneitä
              </h4>
              <p class="menu-price">2,95e / 9,80e</p>
              <p class="menu-diets">diets: L</p>
            </div>

    const menuItems = document.createElement('div');
    menuItems.classList.add('menu-items');

    for (let item of dailyMenu.courses) {
      const food = document.createElement('div');
      const name = document.createElement('h4');
      const price = document.createElement('p');
      const diets = document.createElement('p');

      name.innerText = item.name;
      price.innerText = item.price;
      diets.innerText = item.diets;

      food.append(name, price, diets);
      menuItems.append(food);
*/

export function displayDailyMenu(dailyMenu) {
  const dailyMenuCard = document.querySelector('.daily-menu-card');
  const selectRestaurantPrompt = document.querySelector(
    '#select-restaurant-prompt'
  );

  if (dailyMenu) {
    selectRestaurantPrompt.classList.add('hidden');
  }

  for (let item of dailyMenu.courses) {
    const food = document.createElement('div');
    food.classList.add('individual-course');

    const course = document.createElement('h4');
    course.innerText = item.name;

    const price = document.createElement('p');
    price.innerText = item.price;

    const diets = document.createElement('p');
    diets.innerText = item.diets;

    food.append(course, price, diets);
    dailyMenuCard.append(food);
  }
}
