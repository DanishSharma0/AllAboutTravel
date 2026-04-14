const axios = require('axios');

const testRegister = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      email: `testuser${Math.random()}@gmail.com`,
      password: 'test123456',
      phone: '1234567890',
    });
    
    console.log('Registration successful:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Registration failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
  }
};

testRegister();
