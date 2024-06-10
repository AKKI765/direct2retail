import React, { useEffect } from 'react';
import { MdCheckCircle } from 'react-icons/md';
// import './Style/OrderPlaced.css';
import styles from './Style/OrderPlaced.module.css';
import { Link, useNavigate } from 'react-router-dom';

const OrderPlaced = () => {
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
        <div className={styles.icon}>
          <MdCheckCircle color="#fffff" size={60} />
        </div>
        <h2>Order Placed Successfully</h2>
        <p>Thank you for your order. Your order has been successfully placed.</p>
        <div className={styles.home_button}> 
        <Link to="/rack-store">Home</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderPlaced;
