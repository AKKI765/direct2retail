import React, { useEffect, useState } from 'react';
import { loginUser } from './Validators/BackendInterface';
import  styles  from './Login.module.css';

import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useToast } from '../../Context/ToastContext';

const Login = () => {
  const { showSuccessToast, showErrorToast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    const tokenMain = localStorage.getItem('token');
    if (tokenMain) {
      const decodedTokenMain = jwtDecode(tokenMain);
      if (decodedTokenMain.isAdmin) {
        navigate('/admin-home');
      } else if (decodedTokenMain.isMerchant) {
        navigate('/merchant-orders');
      } else if (decodedTokenMain.id && !decodedTokenMain.isAdmin && !decodedTokenMain.isMerchant) {
        navigate('/');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser(formData);

      if (response && response.token) {
        const token = response.token;
        localStorage.setItem('token', token);
        const decodedToken = jwtDecode(token);
        setFormData({
          email: '',
          password: '',
        });

        if (decodedToken.isAdmin) {
          navigate('/admin-home');
        } else if (decodedToken.isMerchant){
          navigate('/merchant-orders')
        } else if (decodedToken.id && !decodedToken.isAdmin && !decodedToken.isMerchant) {
          navigate('/');
        }

        setTimeout(() => {
          showSuccessToast('Login Successful');
        }, 600);
      } else {
        setTimeout(() => {
          showErrorToast('Check Credentials');
        }, 600);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        showErrorToast('Check your credentials');
      } else {
        console.error('Login error:', error);
      }
    }
  };

  return (
    <div className= {styles.login_container}>
      <h2>LOGIN TO YOUR ACCOUNT</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.form_group}>
          <label htmlFor="email">EMAIL</label>
          <div className= {styles.inputContainer}>
            <i className="fas fa-envelope"></i>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className= {styles.form_group}>
          <label htmlFor="password">PASSWORD</label>
          <div className={styles.inputContainer}>
            <i className="fas fa-lock"></i>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </div>
        <button type="submit" className={styles.btn_login}>
          LOGIN
        </button>
      </form>
      <div className={styles.member_login}>
        Not a Member? <Link className={styles.link_login_style}  to={'/signup'}>
          Signup
        </Link>
      </div>
    </div>
  );
};

export default Login;
