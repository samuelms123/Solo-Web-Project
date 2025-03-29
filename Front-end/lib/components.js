'use strict';

import {getMenu} from './api.js';
import {scrollToMenu} from './utils.js';
import {dailyBtn, weeklyBtn, menuType} from './variables.js';

const restaurantSection = document.querySelector('#restaurants');

export function initRestaurants(restaurants) {
  for (let restaurant of restaurants) {
    restaurantSection.appendChild(
      createRestaurantCard(
        restaurant.name,
        restaurant.address,
        restaurant.postalCode,
        restaurant.city,
        restaurant.company,
        restaurant._id
      )
    );
  }
}

function displayMenuNotFound(restaurantName) {
  const dailyMenuCard = document.querySelector('.daily-menu-card');
  dailyMenuCard.innerHTML = '';

  const notFoundElem = document.createElement('h3');
  notFoundElem.innerText = `Ravintola ${restaurantName} lista ei saatavilla.`;
  dailyMenuCard.append(notFoundElem);
}

function displayDailyMenu(restaurantName, dailyMenu) {
  const dailyMenuCard = document.querySelector('.daily-menu-card');

  dailyMenuCard.innerHTML = '';

  const restoNameElem = document.createElement('h3');
  restoNameElem.innerText = restaurantName;
  dailyMenuCard.append(restoNameElem);

  for (let item of dailyMenu.courses) {
    const food = document.createElement('div');
    food.classList.add('individual-course');

    const course = document.createElement('h4');
    course.innerText = item.name;

    const price = document.createElement('p');
    price.innerText = item.price;

    const diets = document.createElement('p');
    diets.innerText = item.diets;

    const separator = document.createElement('hr');

    food.append(course, price, diets, separator);
    dailyMenuCard.append(food);
  }
}

function createRestaurantCard(name, address, postalCode, city, provider, id) {
  // Card
  const restaurantCard = document.createElement('div');
  restaurantCard.classList.add('restaurant-card');

  restaurantCard.addEventListener('click', function () {
    // add event to move map to restaurant location
  });

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

  // MENU BUTTON
  const menuBtn = document.createElement('button');
  menuBtn.classList.add('menu-btn');
  menuBtn.innerText = 'Ruokalista';
  menuBtn.addEventListener('click', async function () {
    const menu = await getMenu(menuType.value, id);
    console.log(menu);
    if (menu.courses.length > 0) {
      displayDailyMenu(name, menu);
      scrollToMenu();
    } else {
      console.log('no menu found!');
      displayMenuNotFound(name);
      scrollToMenu();
    }
  });

  restaurantActions.append(restaurantInfo, menuBtn);

  restaurantCard.append(cardHeader, restaurantActions);

  return restaurantCard;
}

export function initUiEventListeners() {
  window.addEventListener('scroll', () => {
    let header = document.querySelector('header');
    if (window.scrollY > 10) {
      header.classList.add('header-moving');
    } else {
      header.classList.remove('header-moving');
    }
  });

  // WEEKLY / DAILY BTNS
  weeklyBtn.addEventListener('click', () => {
    if (!weeklyBtn.classList.contains('selected')) {
      weeklyBtn.classList.add('selected');
      dailyBtn.classList.remove('selected');
      menuType.value = 'weekly';
      console.log('Weekly selected');
    }
  });

  dailyBtn.addEventListener('click', () => {
    if (!dailyBtn.classList.contains('selected')) {
      dailyBtn.classList.add('selected');
      weeklyBtn.classList.remove('selected');
      menuType.value = 'daily';
      console.log('Daily selected');
    }
  });

  const signInBtn = document.querySelector('#sign-in');
  const signInModal = document.querySelector('#sign-in-modal');
  signInBtn.addEventListener('click', () => {
    signInModal.showModal();
  });

  const registerBtn = document.querySelector('#register');
  const registerModal = document.querySelector('#register-modal');
  registerBtn.addEventListener('click', () => {
    registerModal.showModal();
  });
}
