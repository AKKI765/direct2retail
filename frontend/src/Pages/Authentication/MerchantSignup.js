import React, { useState } from 'react';
import { merchantSignup } from './Validators/BackendInterface';
import { handleEmail, handlePassword, handleConfirmPass } from './Validators/EmailAndPassword';
import styles from './MerchantSignup.module.css';
import { Link } from 'react-router-dom';
import { useToast } from '../../Context/ToastContext';

const MerchantSignup = () => {
  const { showSuccessToast, showErrorToast } = useToast();

  const [formData, setFormData] = useState({  
    name: '',
    company: '',
    email: '',
    gst:'',
    password: '',
    confirmPass: '',
  });

  const [validation, setValidation] = useState({
    isValidEmail: false,
    isValidPass: false,
    isConfirmPass: false,
    spanEmail: '',
    spanPass: '',
    spanCPass: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEmailValidation = async (email) => {
    const message = await handleEmail(email, (isValid) => {
      setValidation((prevValidation) => ({
        ...prevValidation,
        spanEmail: isValid,
        isValidEmail: isValid,
      }));
    });

    setValidation((prevValidation) => ({
      ...prevValidation,
      spanEmail: message,
    }));
  };

  const handlePasswordValidation = (password) => {
    const message = handlePassword(password, (isValid) => {
      setValidation((prevValidation) => ({
        ...prevValidation,
        spanPass: isValid,
        isValidPass: isValid,
      }));
    });

    setValidation((prevValidation) => ({
      ...prevValidation,
      spanPass: message,
    }));
  };

  const handleConfirmPasswordValidation = (confirmPass) => {
    const message = handleConfirmPass(
      formData.password,
      confirmPass,
      (isValid) => {
        setValidation((prevValidation) => ({
          ...prevValidation,
          spanCPass: isValid,
          isConfirmPass: isValid,
        }));
      }
    );

    setValidation((prevValidation) => ({
      ...prevValidation,
      spanCPass: message,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValidEmail, isValidPass, isConfirmPass } = validation;

    if (isValidEmail && isValidPass && isConfirmPass) {
      const response = await merchantSignup(formData);
      if (response) {
        // Signup successful
        setFormData({
          name: '',
          company: '',
          email: '',
          gst:'',
          password: '',
          confirmPass: '',
        })
        setValidation({
          isValidEmail: false,
          isValidPass: false,
          isConfirmPass: false,
          spanEmail: '',
          spanPass: '',
          spanCPass: '',
        })
        showSuccessToast('Signup successful')
      } else {
        // Error signing up
        showErrorToast('Check Credentials')
      }
    } else {
      // Form validation failed
      showErrorToast('Form validation failed')
    }
  };

  return (
    <div className={styles.signup_container}>
      <h2>CREATE MERCHANT ACCOUNT</h2>
      <form className={styles.form_container_signup} onSubmit={handleSubmit}>
        <div className={styles.form_group_signup}>
          <label htmlFor="name">USERNAME</label>
          <div className={styles.inputContainer}>
          <i className="fas fa-user"></i>

          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        </div>

        

        <div className={styles.form_group_signup}>
          <label htmlFor="email">EMAIL </label>
 <div className={styles.inputContainer}>
          <i className="fas fa-envelope"></i>

          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              handleEmailValidation(e.target.value);
            }}
          />
        </div>
          {validation.spanEmail && <span className={styles.error}>{validation.spanEmail}</span>}
        </div>


        <div className={styles.form_group_signup}>
          <label htmlFor="gst">GST Number </label>
 <div className={styles.inputContainer}>
          <i className="fas fa-percent"></i>

          <input
            type="text"
            id="gst"
            name="gst"
            value={formData.gst.toUpperCase()}
            onChange={(e) => {
              setFormData({ ...formData, gst: e.target.value });
            }}
          />
          </div>
          </div>

        <div className={styles.form_group_signup}>
          <label htmlFor="password">PASSWORD</label>
          <div className={styles.inputContainer}>
          <i className="fas fa-lock"></i>

          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              handlePasswordValidation(e.target.value);
            }}
          />
        </div>
          {validation.spanPass && <span className={styles.error}>{validation.spanPass}</span>}
        </div>

        <div className={styles.form_group_signup}>
          <label htmlFor="confirmPass">CONFIRM PASSWORD</label>
          <div className={styles.inputContainer}>
          <i className="fas fa-lock"></i>

          <input
            type="password"
            id="confirmPass"
            name="confirmPass"
            value={formData.confirmPass}
            onChange={(e) => {
              setFormData({ ...formData, confirmPass: e.target.value });
              handleConfirmPasswordValidation(e.target.value);
            }}
          />
        </div>
          {validation.spanCPass && <span className={styles.error}>{validation.spanCPass}</span>}
        </div>

        <button type="Submit" className={styles.btn_signup}>
          SIGN UP
        </button>

        <div className={styles.flexCenter_member_signup}>Already have a account? <Link className={styles.link_signup_style} to={'/login'}>Login</Link></div>
      </form>
    </div>
  );
};

export default MerchantSignup;
