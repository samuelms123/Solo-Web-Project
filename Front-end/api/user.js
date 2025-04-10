/*
TESTIUKKO
    'samuelms123',
    'salasana',
    'sam.sar@metropolia.fi'
*/

export async function createUser(username, password, email) {
  const userData = {
    username: username,
    password: password,
    email: email,
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  };
  console.log(options);

  try {
    const response = await fetch(
      'https://media2.edu.metropolia.fi/restaurant/api/v1/users',
      options
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log('Server error response:', errorData);
      throw new Error('Invalid input!');
    }

    const json = await response.json();
    console.log(json);
    return json;
  } catch (error) {
    console.log(error, ' Error happened while creating user.');
    return null;
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

export async function getUserInfo(token) {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await fetch(
      `https://media2.edu.metropolia.fi/restaurant//api/v1/users/token`,
      options
    );
    if (!response.ok) {
      throw new Error('Invalid input!');
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(error, ' Error happened while fetching menu data.');
    return null;
  }
}
