/*
            <div class="restaurant-card">
              <div class="restaurant-header">
                <h3 class="restaurant-name">Ravintola 1</h3>
                <button class="heart-btn">♡</button>
              </div>
              <div class="restaurant-actions">
                <div class="restaurant-info">
                  <p class="restaurant-address">
                    Myllypurontie 53, 00810 Helsinki
                  </p>
                  <p class="restaurant-provider">Sodexo</p>
                </div>
                <button class="menu-btn">Ruokalista</button>
              </div>
            </div>

  {
    "location": {
      "type": "Point",
      "coordinates": [25.018456, 60.228982]
    },
    "_id": "6470d38ecb12107db6fe24c1",
    "companyId": 68,
    "name": "Ravintola Ladonlukko",
    "address": "Latokartanonkaari 9 A",
    "postalCode": "00790",
    "city": "Helsinki",
    "phone": "+358 50 4653899 Ravintolan esimies +358 50 435 8072 Kokoustarjoilut /ravintola",
    "company": "Sodexo",
    "__v": 0
  },
*/

export function createRestaurantCard(
  name,
  address,
  postalCode,
  city,
  provider
) {
  // HTMl section for restaurants
  const restaurantSection = document.querySelector('#restaurants');

  // Card
  const restaurantCard = document.createElement('div');
  restaurantCard.classList.add('restaurant-card');

  restaurantCard.addEventListener('click', function () {
    alert('testi');
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

  const menuBtn = document.createElement('button');
  menuBtn.classList.add('menu-btn');
  menuBtn.innerText = 'Ruokalista';
  // add event listener

  restaurantActions.append(restaurantInfo, menuBtn);

  restaurantCard.append(cardHeader, restaurantActions);

  restaurantSection.appendChild(restaurantCard);
}
