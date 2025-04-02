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
  console.log(options);

  try {
    const response = await fetch(
      'https://media2.edu.metropolia.fi/restaurant/api/v1/auth/login',
      options
    );

    if (!response.ok) {
      throw new Error('Invalid input!');
    }

    const json = await response.json();
    console.log(json);
    return json;
  } catch (error) {
    console.log(error, ' Error happened while creating user.');
  }
}
