'use strict';

import {getMenu} from '../api/restaurant.js';
import {checkUsernameAvailability, createUser} from '../api/user.js';
import {moveMapTo} from './map.js';
import {scrollToMenu} from './utils.js';
import {dailyBtn, weeklyBtn, menuType} from './variables.js';

let currentRestaurantName;
let currentWeeklyMenu;
let currentDailyMenu;

const restaurantSection = document.querySelector('#restaurants');
const menuCard = document.querySelector('.menu-card');

export function initRestaurants(restaurants) {
  for (let restaurant of restaurants) {
    restaurantSection.appendChild(
      createRestaurantCard(
        restaurant.name,
        restaurant.address,
        restaurant.postalCode,
        restaurant.city,
        restaurant.company,
        restaurant._id,
        restaurant.location.coordinates
      )
    );
  }
}

function displayMenuNotFound(restaurantName) {
  menuCard.innerHTML = '';

  const notFoundElem = document.createElement('h3');
  notFoundElem.innerText = `Ravintola ${restaurantName} lista ei saatavilla.`;
  menuCard.append(notFoundElem);
}

function displayWeeklyMenu(restaurantName, weeklyMenu) {
  menuCard.innerHTML = '';

  const restoNameElem = document.createElement('h3');
  restoNameElem.innerText = restaurantName;
  menuCard.append(restoNameElem);

  for (let day of weeklyMenu.days) {
    const dayElem = document.createElement('h4');
    dayElem.classList.add('menu-day');

    dayElem.innerText = day.date;
    const daySeparator = document.createElement('hr');
    daySeparator.classList.add('day-separator');

    menuCard.append(daySeparator, dayElem);

    for (let course of day.courses) {
      // refactor this to function
      const food = document.createElement('div');
      food.classList.add('individual-course');

      const courseName = document.createElement('h5');
      courseName.innerText = course.name;

      const coursePrice = document.createElement('p');
      coursePrice.innerText = course.price;

      const courseDiets = document.createElement('p');
      courseDiets.innerText = course.diets;

      const courseSeparator = document.createElement('hr');
      courseSeparator.classList.add('course-separator');

      food.append(courseName, coursePrice, courseDiets);
      menuCard.append(food);
    }
  }
}

function displayDailyMenu(restaurantName, dailyMenu) {
  menuCard.innerHTML = '';

  const restoNameElem = document.createElement('h3');
  restoNameElem.innerText = restaurantName;
  menuCard.append(restoNameElem);

  for (let item of dailyMenu.courses) {
    const food = document.createElement('div');
    food.classList.add('individual-course');

    const course = document.createElement('h5');
    course.innerText = item.name;

    const price = document.createElement('p');
    price.innerText = item.price;

    const diets = document.createElement('p');
    diets.innerText = item.diets;

    const separator = document.createElement('hr');
    separator.classList.add('course-separator');

    food.append(course, price, diets, separator);
    menuCard.append(food);
  }
}

function createRestaurantCard(
  name,
  address,
  postalCode,
  city,
  provider,
  id,
  coordinates
) {
  // Card
  const restaurantCard = document.createElement('div');
  restaurantCard.classList.add('restaurant-card');

  restaurantCard.addEventListener('click', function () {
    moveMapTo(coordinates);
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
    currentRestaurantName = name;
    console.log(menu);
    if (menuType.value === 'daily') {
      currentDailyMenu = menu;
      if (menu.courses.length > 0) {
        displayDailyMenu(name, menu);
        scrollToMenu();
        // get weekly menu in advance
        currentWeeklyMenu = await getMenu('weekly', id);
      } else {
        console.log('no menu found!');
        displayMenuNotFound(name);
        scrollToMenu();
      }
    } else {
      currentWeeklyMenu = menu;
      if (menu.days.length > 0) {
        displayWeeklyMenu(name, menu);
        console.log('Displaying weekly menu!');
        scrollToMenu();
        // get daily menu in advance
        currentDailyMenu = await getMenu('daily', id);
      } else {
        console.log('no menu found!');
        displayMenuNotFound(name);
        scrollToMenu();
      }
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

  // WEEKLY / DAILY BUTTONS
  weeklyBtn.addEventListener('click', () => {
    if (!weeklyBtn.classList.contains('selected')) {
      weeklyBtn.classList.add('selected');
      dailyBtn.classList.remove('selected');
      menuType.value = 'weekly';
      console.log('Weekly selected');
      if (currentRestaurantName && currentWeeklyMenu) {
        displayWeeklyMenu(currentRestaurantName, currentWeeklyMenu);
      }
    }
  });

  dailyBtn.addEventListener('click', () => {
    if (!dailyBtn.classList.contains('selected')) {
      dailyBtn.classList.add('selected');
      weeklyBtn.classList.remove('selected');
      menuType.value = 'daily';
      console.log('Daily selected');
      if (currentRestaurantName && currentDailyMenu) {
        displayDailyMenu(currentRestaurantName, currentDailyMenu);
      }
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

  const registerUserForm = document.querySelector('#register-user');
  const usernameElem = document.querySelector('#new-username');
  const passwordElem = document.querySelector('#new-password');
  const emailElem = document.querySelector('#email');
  const userTakenElem = document.querySelector('#user-taken');

  registerUserForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = usernameElem.value;
    const password = passwordElem.value;
    const email = emailElem.value;

    const checkUsername = await checkUsernameAvailability(username);

    if (checkUsername.available) {
      console.log('käyttäjä vapaa!');
      const result = await createUser(username, password, email);
      if (result == null) {
        userTakenElem.innerText = 'Sähköposti varattu!';
        emailElem.value = '';
        return;
      } else {
        userTakenElem.innerText = 'Rekisteröinti onnistui!';
        usernameElem.value = '';
        emailElem.value = '';
        passwordElem.value = '';
      }
    } else {
      console.log('käyttäjä varattu!');
      userTakenElem.innerText = 'Käyttäjätunnus varattu!';
      usernameElem.value = '';
      return;
    }
  });
}
