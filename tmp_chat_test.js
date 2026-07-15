const axios = require('axios');
(async () => {
  try {
    console.log('sending');
    const response = await axios.post('http://localhost:5000/api/recommendations/chat', {
      message: 'Test AI response',
      cityId: '69f72a628f49f7edda919bd4'
    }, {
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTQ4YjQ1YzUwN2EyODU4Y2QyYmQ4NjIiLCJlbWFpbCI6ImFpLXRlc3QtdXNlcisyMDI2LTJAYWxsYWJvdXR0cmF2ZWwuYXBwIiwiaWF0IjoxNzgzMTQ5NjYwLCJleHAiOjE3ODM3NTQ0NjB9.eOSH1jGVVvnc8juTo6-562Z2w300Isfsl9qditvRLJE'
      },
      timeout: 15000
    });
    console.log('status', response.status);
    console.log(JSON.stringify(response.data, null, 2));
  } catch (err) {
    if (err.response) {
      console.log('status', err.response.status);
      console.log(JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }
  }
})();
