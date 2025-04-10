import axios from 'axios';

export const fetchUserProfile = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:4001/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Fetch User Profile Error:', error);
    return null;
  }
};
