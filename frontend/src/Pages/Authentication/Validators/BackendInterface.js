import axios from 'axios';


const API_URL=process.env.REACT_APP_API_URL;


export async function signUpUser(userData) {
  try {
    const response = await axios.post(`${API_URL}/api/auth/signup`, userData);
    return response.data;
  } catch (error) {
    console.error('Error signing up user:', error);
    throw error;
  }
}

export async function adminSignup(userData) {
  try {
    const response = await axios.post(`${API_URL}/api/auth/signup-admin`, userData);
    return response.data;
  } catch (error) {
    console.error('Error signing up user:', error);
    throw error;
  }
}

export async function merchantSignup(userData) {
  try {
    const response = await axios.post(`${API_URL}/api/auth/signup-merchant`, userData);
    return response.data;
  } catch (error) {
    console.error('Error signing up user:', error);
    throw error;
  }
}


export async function loginUser(userData){
    try {
        const response = await axios.post(`${API_URL}/api/auth/login`, userData);
        return response.data;
      } catch (error) {
        console.error('Error Login user:', error);
        throw error;
      }
}