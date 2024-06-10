import React, { useEffect } from 'react';
import { CgCloseO } from "react-icons/cg";
import styles from './Style/OrderPlaced.module.css';
import { Link, useNavigate } from 'react-router-dom';

const ErrorTransaction = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if(!token){
            navigate('/login')
        }
    }, [navigate])

  return (
    <div className={styles.order_placed_container}>
    <div className={styles.order_success}>
      <div className="bg-white p-4 rounded-full my-4">
        <CgCloseO color="#FF0000" size={60} />
      </div>
      <h2>OOPS!!! There was a Error Processing</h2>
      <p>Please Try Again in Sometime.</p>
      <div className={styles.home_button}> 
      <Link to="/rack-store">Home</Link>
      </div>
    </div>
  </div>
  )
}

export default ErrorTransaction