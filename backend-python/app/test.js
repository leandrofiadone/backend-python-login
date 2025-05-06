fetch('http://localhost:8000/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'test1',
    password: 'test'
  })
})
.then(response => {
  if (!response.ok) {
    throw new Error('Failed to login');
  }
  return response.json();
})
.then(data => {
  const token = data.token;
  fetch('http://localhost:8000/secure_endpoint', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(errorData => {
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.detail}`);
      });
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('There was a problem with your fetch operation:', error);
  });
})
.catch(error => {
  console.error('There was a problem with your fetch operation:', error);
});
