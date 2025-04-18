export async function login(username, password) {
  const userData = {
    username: username,
    password: password,
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
      'https://media2.edu.metropolia.fi/restaurant/api/v1/auth/login',
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
