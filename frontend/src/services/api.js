// import axios from 'axios';

// const API = axios.create({
//   baseURL: 'http://localhost:8000', // Django server
// });

// export default API;
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api', // (✅ Good: more specific baseURL)
});

// Helper to set token easily
export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common['Authorization'] = `Token ${token}`;
  } else {
    delete API.defaults.headers.common['Authorization'];
  }
};

export default API;
