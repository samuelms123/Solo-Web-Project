'use strict';

import {login} from '../api/auth.js';
import {getMenu, getRestaurantById} from '../api/restaurant.js';
import {
  checkUsernameAvailability,
  createUser,
  getUserInfo,
  modifyUserData,
} from '../api/user.js';
import {filterRestaurants} from './filter.js';
import {moveMapTo} from './map.js';
import {comparePasswords} from './password.js';
import {
  calculateDistance,
  scrollToMenu,
  scrollToRestaurants,
  scrollToTop,
} from './utils.js';
import {dailyBtn, weeklyBtn, menuType, loggedIn} from './variables.js';

let header = document.querySelector('header');
let currentRestaurantName;
let currentWeeklyMenu;
let currentDailyMenu;

const registerBtn = document.querySelector('#register');
const registerModal = document.querySelector('#register-modal');

const signInBtn = document.querySelector('#sign-in');
const signInModal = document.querySelector('#sign-in-modal');

const restaurantSection = document.querySelector('#restaurants');
const menuCard = document.querySelector('.menu-card');
// User info
const infoUsername = document.querySelector('#info-username');
const infoEmail = document.querySelector('#info-email');
const infoFavRestaurant = document.querySelector('#info-restaurant');
const editButton = document.querySelector('#edit-info');
const saveButton = document.querySelector('#save-info');
const infoOutputMessage = document.querySelector('#userinfo-message');
const changePasswordBtn = document.querySelector('#change-password-btn');

// Change password
const passwordModal = document.querySelector('#password-modal');
// const submitNewPassword = document.querySelector('#submit-new-password');
const passwordExitBtn = document.querySelector('#password-exit');
const oldPassword = document.querySelector('#change-password-old-password');
const newPassword = document.querySelector('#change-password-new-password');
const newPasswordRetype = document.querySelector(
  '#change-password-new-password-retype'
);
const passwordForm = document.querySelector('#password-form');
const passwordOutputMessage = document.querySelector('#password-message');

const favouriteRestaurantSection = document.querySelector(
  '#favourite-restaurant'
);

const signInUserForm = document.querySelector('#sign-in-user');
const signInUsernameElem = document.querySelector('#username');
const signInPasswordElem = document.querySelector('#password');
const inputMessageElem = document.querySelector('#message');
const loginExitBtn = document.querySelector('#sign-in-exit');
const signBtn = document.querySelector('#sign-in-user-btn');

const registerUserForm = document.querySelector('#register-user');
const usernameElem = document.querySelector('#new-username');
const passwordElem = document.querySelector('#new-password');
const emailElem = document.querySelector('#email');
const userTakenElem = document.querySelector('#user-taken');
const registerExitBtn = document.querySelector('#register-exit');

const UserInfoBtn = document.querySelector('#user-info');
const infoExitBtn = document.querySelector('#userdata-exit');
const userDataModal = document.querySelector('#userdata-modal');

const cityFilter = document.querySelector('#city-filter');
const providerFilter = document.querySelector('#provider-filter');
const filterBtn = document.querySelector('#filter-button');

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
        restaurant.location.coordinates,
        restaurant.distanceFromUser,
        false
      )
    );
  }
}

function displayMenuNotFound(restaurantName) {
  menuCard.innerHTML = '';

  const notFoundElem = document.createElement('h4');
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
      course.price
        ? (coursePrice.innerText = course.price)
        : (coursePrice.innerText = 'hinta ei saatavilla');

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
    item.price
      ? (price.innerText = item.price)
      : (price.innerText = 'hinta ei saatavilla');

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
  coordinates,
  distanceFromUser,
  isFavouriteRestaurant
) {
  // Card
  const restaurantCard = document.createElement('div');
  restaurantCard.classList.add('restaurant-card');
  const coordinatesFlipped = [coordinates[1], coordinates[0]];

  restaurantCard.addEventListener('click', function () {
    if (window.innerWidth >= 1200) {
      moveMapTo(coordinatesFlipped);
    }
    return;
  });

  // Card-header
  const cardHeader = document.createElement('div');
  cardHeader.classList.add('restaurant-header');

  const restaurantName = document.createElement('h3');
  restaurantName.classList.add('restaurant-name');
  restaurantName.innerText = name;

  const favoriteBtn = document.createElement('button');
  if (isFavouriteRestaurant) {
    favoriteBtn.classList.add('heart-btn-favorited');
    favoriteBtn.disabled = true;
  } else {
    favoriteBtn.classList.add('heart-btn');
  }
  favoriteBtn.innerText = '♡';

  favoriteBtn.addEventListener('click', async () => {
    if (loggedIn.value) {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const favouriteRestaurant = userData.favouriteRestaurant;
      if (id == favouriteRestaurant) {
        return;
      } else {
        const authToken = localStorage.getItem('authToken');
        const result = await modifyUserData(
          {favouriteRestaurant: id},
          authToken
        );
        if (result) {
          updateFavoriteRestaurant(id);
          userData.favouriteRestaurant = id;
          scrollToTop();
          localStorage.setItem('userData', JSON.stringify(userData));
        }
      }
    } else {
      signInModal.showModal();
      return;
    }
  });

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

  const distance = document.createElement('p');
  distance.innerText = `${distanceFromUser} km`;

  restaurantInfo.append(restaurantAddress, restaurantProvider, distance);

  // MENU BUTTON
  const menuBtn = document.createElement('button');
  menuBtn.classList.add('menu-btn');
  menuBtn.innerText = 'Ruokalista';
  menuBtn.addEventListener('click', async function () {
    const menu = await getMenu(menuType.value, id);
    currentRestaurantName = name;
    if (menuType.value === 'daily') {
      currentDailyMenu = menu;
      if (menu.courses.length > 0) {
        displayDailyMenu(name, menu);
        scrollToMenu();
        // get weekly menu in advance
        currentWeeklyMenu = await getMenu('weekly', id);
      } else {
        displayMenuNotFound(name);
        scrollToMenu();
      }
    } else {
      currentWeeklyMenu = menu;
      if (menu.days.length > 0) {
        displayWeeklyMenu(name, menu);
        scrollToMenu();
        // get daily menu in advance
        currentDailyMenu = await getMenu('daily', id);
      } else {
        displayMenuNotFound(name);
        scrollToMenu();
      }
    }
  });

  restaurantActions.append(restaurantInfo, menuBtn);

  restaurantCard.append(cardHeader, restaurantActions);

  return restaurantCard;
}

async function updateFavoriteRestaurant(id) {
  const userInfoRestaurant = document.querySelector('#info-restaurant');

  favouriteRestaurantSection.innerText = '';
  favouriteRestaurantSection.classList.contains('hidden') &&
    favouriteRestaurantSection.classList.remove('hidden');

  const restaurantInfo = await getRestaurantById(id);

  const distance = calculateDistance(
    JSON.parse(localStorage.getItem('user-coordinates')),
    restaurantInfo.location.coordinates
  ).toFixed(0);

  const restaurantCard = createRestaurantCard(
    restaurantInfo.name,
    restaurantInfo.address,
    restaurantInfo.postalCode,
    restaurantInfo.city,
    restaurantInfo.company,
    restaurantInfo._id,
    restaurantInfo.location.coordinates,
    distance,
    true
  );

  favouriteRestaurantSection.appendChild(restaurantCard);

  userInfoRestaurant.placeholder = restaurantInfo.name;
}

async function changeToLoggedIn(info) {
  loggedIn.value = true;
  registerBtn.classList.add('hidden');
  document.querySelector('#favorite-header').classList.remove('hidden');
  UserInfoBtn.classList.remove('hidden');
  signInBtn.innerText = 'Kirjaudu ulos';
  localStorage.setItem('userData', JSON.stringify(info));
  let restaurantInfo;
  if (info.favouriteRestaurant) {
    favouriteRestaurantSection.classList.remove('hidden');

    restaurantInfo = await getRestaurantById(info.favouriteRestaurant);

    const distance = calculateDistance(
      JSON.parse(localStorage.getItem('user-coordinates')),
      restaurantInfo.location.coordinates
    ).toFixed(0);

    const restaurantCard = createRestaurantCard(
      restaurantInfo.name,
      restaurantInfo.address,
      restaurantInfo.postalCode,
      restaurantInfo.city,
      restaurantInfo.company,
      restaurantInfo._id,
      restaurantInfo.location.coordinates,
      distance,
      true
    );

    favouriteRestaurantSection.appendChild(restaurantCard);
  }

  UserInfoBtn.addEventListener('click', async () => {
    // modal auki
    const info = JSON.parse(localStorage.getItem('userData'));
    infoUsername.value = info.username;
    infoEmail.value = info.email;

    if (info.favouriteRestaurant) {
      const restaurantInfo = await getRestaurantById(info.favouriteRestaurant);
      infoFavRestaurant.value = restaurantInfo.name;
    }
    userDataModal.showModal();
  });

  infoExitBtn.addEventListener('click', () => {
    userDataModal.close();
    infoOutputMessage.innerText = '';
    infoUsername.disabled = true;
    infoEmail.disabled = true;
    saveButton.disabled = true;
    editButton.disabled = false;
  });
}

// EDIT USER INFO

editButton.addEventListener('click', () => {
  infoUsername.disabled = false;
  infoEmail.disabled = false;
  saveButton.disabled = false;
  editButton.disabled = true;
});

async function checkIfModified(username, email) {
  let data = {};
  const previousUserData = JSON.parse(localStorage.getItem('userData'));
  const previousUsername = previousUserData.username;
  const previousEmail = previousUserData.email;

  if (previousUsername !== username) {
    const available = await checkUsernameAvailability(username);
    if (!available.available) return null;
    data.username = username;
  }

  if (previousEmail !== email) {
    data.email = email;
  }
  return data;
}
// USER INFO
userDataModal.addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = infoUsername.value;
  const email = infoEmail.value;
  const token = localStorage.getItem('authToken');
  const newData = await checkIfModified(username, email);
  if (newData === null) {
    infoOutputMessage.innerText = 'Käyttäjätunnus varattu';
    return;
  } else if (Object.keys(newData).length === 0) {
    return;
  } else {
    const result = await modifyUserData(newData, token);
    if (result != null) {
      infoOutputMessage.innerText = 'Muokkaus tallennettu';
      const newInfo = await getUserInfo(token);
      localStorage.setItem('userData', JSON.stringify(newInfo));
      setTimeout(() => {
        userDataModal.close();
        infoOutputMessage.innerText = '';
        infoUsername.disabled = true;
        infoEmail.disabled = true;
        saveButton.disabled = true;
        editButton.disabled = false;
      }, 1500);
    } else {
      infoOutputMessage.innerText = 'Sähköposti varattu';
    }
  }
});

// CHANGE PASSWORD
changePasswordBtn.addEventListener('click', () => {
  passwordModal.showModal();
});

function clearPasswordFields() {
  oldPassword.value = '';
  newPassword.value = '';
  newPasswordRetype.value = '';
}

passwordExitBtn.addEventListener('click', () => {
  clearPasswordFields();
  passwordOutputMessage.innerText = '';
  passwordModal.close();
});

passwordForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const userData = JSON.parse(localStorage.getItem('userData'));

  const logInResult = await login(userData.username, oldPassword.value);

  if (logInResult === null) {
    passwordOutputMessage.innerText = 'Väärä salasana!';
    clearPasswordFields();
    return;
  }

  if (!comparePasswords(newPassword.value, newPasswordRetype.value)) {
    passwordOutputMessage.innerText = 'Salasanat ei täsmää!';
    clearPasswordFields();
    return;
  }

  if (newPassword.value.length < 5 || newPasswordRetype.value < 5) {
    passwordOutputMessage.innerText = 'Uusi salasana liian lyhyt! (min 5)';
    clearPasswordFields();
    return;
  }

  const token = localStorage.getItem('authToken');
  const newData = {
    password: newPassword.value,
  };

  const result = await modifyUserData(newData, token);

  if (result != null) {
    passwordOutputMessage.innerText = 'Salasana vaihdettu!';
    clearPasswordFields();
    setTimeout(() => {
      passwordModal.close();
    }, 1000);
  } else {
    passwordOutputMessage.innerText = 'Epäonnistui..';
    clearPasswordFields();
  }
});

export function initUiEventListeners() {
  window.addEventListener('scroll', () => {
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
      if (currentRestaurantName && currentDailyMenu) {
        displayDailyMenu(currentRestaurantName, currentDailyMenu);
      }
    }
  });

  signInBtn.addEventListener('click', () => {
    if (!loggedIn.value) {
      signInModal.showModal();
    } else {
      //kirjaudu ulos
      localStorage.clear();
      loggedIn.value = false;
      location.reload();
    }
  });

  registerBtn.addEventListener('click', () => {
    registerModal.showModal();
  });

  // LOGIN

  signInUserForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = signInUsernameElem.value;
    const password = signInPasswordElem.value;

    const result = await login(username, password);

    if (result && result.token && result.data) {
      localStorage.setItem('authToken', result.token);
      inputMessageElem.innerText = `Tervetuloa, ${result.data.username}`;
      signBtn.disabled = true;
      changeToLoggedIn(result.data);
      setTimeout(() => {
        signInModal.close();
        signInBtn.disabled = false;
      }, 1000);
    } else {
      inputMessageElem.innerText = 'Väärä käyttäjätunnus/salasana';
      signInPasswordElem.value = '';
    }
  });

  loginExitBtn.addEventListener('click', () => {
    signInUsernameElem.value = '';
    signInPasswordElem.value = '';
    signBtn.disabled = false;
    signInModal.close();
  });

  // REGISTER

  registerUserForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = usernameElem.value;
    const password = passwordElem.value;
    const email = emailElem.value;

    const checkUsername = await checkUsernameAvailability(username);
    if (password.length < 5) {
      userTakenElem.innerText = 'Salasana liian lyhyt (min 5)';
      passwordElem.value = '';
      return;
    }

    if (checkUsername.available) {
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
        setTimeout(() => {
          registerModal.close();
          signInModal.showModal();
          userTakenElem.innerText = '';
        }, 1000);
      }
    } else {
      userTakenElem.innerText = 'Käyttäjätunnus varattu!';
      usernameElem.value = '';
      return;
    }
  });

  registerExitBtn.addEventListener('click', () => {
    usernameElem.value = '';
    passwordElem.value = '';
    emailElem.value = '';
    registerModal.close();
  });

  // FILTERING

  filterBtn.addEventListener('click', () => {
    const city = cityFilter.value;
    const provider = providerFilter.value;
    const restaurants = JSON.parse(localStorage.getItem('restaurants'));

    const filteredRestaurants = filterRestaurants(restaurants, city, provider);
    restaurantSection.innerText = '';

    for (let restaurant of filteredRestaurants) {
      restaurantSection.appendChild(
        createRestaurantCard(
          restaurant.name,
          restaurant.address,
          restaurant.postalCode,
          restaurant.city,
          restaurant.company,
          restaurant._id,
          restaurant.location.coordinates,
          restaurant.distanceFromUser,
          false
        )
      );
    }
    scrollToRestaurants();
  });

  const hamburgerBtn = document.querySelector('.hamburger-menu');
  const navMenu = document.querySelector('.full-width');

  hamburgerBtn.addEventListener('click', () => {
    navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
  });
}
