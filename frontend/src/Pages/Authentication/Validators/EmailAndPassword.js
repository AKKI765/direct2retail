import axios from 'axios';
import './EmailAndPassword.css'


const API_URL = process.env.REACT_APP_API_URL;

export async function checkEmailExist(email) {
  try {
    const response = await axios.get(`${API_URL}/api/auth/checkEmail?email=${email}`);
    const data = response.data;
    return data.message === 'Valid Email';
  } catch (error) {
    console.error('Error checking email in the database:', error);
    return false;
  }
}

export function isValidEmailFormat(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
}



export async function handleEmail(email, setValidEmail) {
    try {
      if (isValidEmailFormat(email)) {
        const isValidEmail = await checkEmailExist(email);
  
        if (isValidEmail) {
          setValidEmail(true);
          return <span className='valid'>&#x2713;Email is valid and available</span>
        } else {
          setValidEmail(false);
          return <span className='invalid'>&#x274C;Email already exists</span>
        }
      } else {
        setValidEmail(false);
        return <span className='invalid'>&#x274C;Invalid email format</span>
      }
    } catch (error) {
      setValidEmail(false);
      return <span className='invalid'>&#x274C;An error occurred while checking the email</span>
    }
  }


 export function isPasswordValid(password) {
    // Regular expression to check if password contains a symbol, a number, and is at least 8 characters long
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*[a-zA-Z]).{8,}$/;

    return passwordRegex.test(password);
  }

 export function handlePassword(password, setValidPass) {
    const isValid = isPasswordValid(password);
    
    if (isValid) {
      setValidPass(true);
      return <span className='valid'>&#x2713;Valid Password</span>
    } else {
      setValidPass(false);
      return ( <span className='invalid'>
      &#x274C; Password must meet the following criteria:
      <ul className='invalid-password-container'>
        <li>Contain at least one letter</li>
        <li>Contain at least one number</li>
        <li>Contain at least one symbol (e.g., !@#$%^&*)</li>
        <li>Be a minimum of 8 characters long</li>
      </ul>
    </span>);
    }
  }

  export function confirmPasswordsMatch(password, confirmPass) {
    return password === confirmPass;
  }
  
  export function handleConfirmPass(password, confirmPassword, setConfirmPass) {
    const confirm = confirmPasswordsMatch(password, confirmPassword)
    if(confirm){
      setConfirmPass(true);
      return <span className='valid'>&#x2713;Passwords match</span>
    }
    else{
      setConfirmPass(false);
    return <span className='invalid'>&#x274C;Passwords doesn't match</span>
    }
  }

  