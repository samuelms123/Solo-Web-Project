export async function modifyUserData(data, token) {
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  };
  try {
    const response = await fetch(
      `https://media2.edu.metropolia.fi/restaurant/api/v1/users`,
      options
    );
    const json = await response.json();
    if (!response.ok) {
      return null;
    }
    return json;
  } catch (error) {
    return null;
  }
}

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

  try {
    const response = await fetch(
      'https://media2.edu.metropolia.fi/restaurant/api/v1/users',
      options
    );

    if (!response.ok) {
      throw new Error('Invalid input!');
    }

    const json = await response.json();
    return json;
  } catch (error) {
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
    console.log(error);
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
      `https://media2.edu.metropolia.fi/restaurant/api/v1/users/token`,
      options
    );
    if (!response.ok) {
      throw new Error('Invalid input!');
    }
    const json = await response.json();
    return json;
  } catch (error) {
    return null;
  }
}
