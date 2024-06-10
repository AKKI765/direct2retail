import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import styles from './Style/History.module.css';

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [products, setProducts] = useState({});
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;


  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(!token){
        navigate('/login')
    }
  },[navigate])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          const decodedToken = jwtDecode(storedToken);
          const response = await axios.get(`${API_URL}/api/orders/history/${decodedToken.id}`);
          setHistoryData(response.data);
          const productIds = [...new Set(response.data.flatMap(order => order.cartItems.map(item => item.productId)))];

          const productDetails = {};
          for (const productId of productIds) {
            const productResponse = await axios.get(`${API_URL}/api/prod/products/${productId}`);
            productDetails[productId] = productResponse.data;
          }
          setProducts(productDetails);
        }
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchData();
  }, [API_URL]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={styles.order_list}>
      <h2 className='flex justify-center items-center ml-0'>Purchase History</h2>
      {historyData.map((order) => (
        <div className={styles.order_card} key={order._id}>
          {order.cartItems.map((item, index) => (
            <div className={styles.product_details} key={index}>
              <div className={styles.product_image}>
                {products[item.productId]?.image && products[item.productId]?.image.startsWith("https://") ? (
                <img src={products[item.productId]?.image} alt={products[item.productId]?.productName} />
              ) : (
                <img
                  src={`${API_URL}/${products[item.productId]?.image.replace(/\\/g, "/")}`}
                  alt={products[item.productId]?.productName}
                />
              )}
              </div>
              <div className={styles.order_details}>
                <div className={styles.order_id}>
                  Order ID: {order.userDetails[0]?.id}
                </div>
                <div className="order-date">
                  Order Date: {formatDate(order.createdAt)}
                </div>
                <div className={styles.customer_details}>
                  <div className={styles.customer_name}>
                    Name: {order.userDetails[0]?.notes?.name}
                  </div>
                  <div className={styles.customer_email}>
                    Email: {order.userDetails[0]?.email}
                  </div>
                  <div className={styles.customer_phone}>
                    Phone: {order.userDetails[0]?.contact}
                  </div>
                  <div className={styles.customer_address}>
                    Address: {order.userDetails[0]?.notes?.address}
                  </div>
                </div>
                <div className={styles.product_name}>
                  Product Name: {products[item.productId]?.productName || 'Product Not Found'}
                </div>
                <div className={styles.product_price}>
                  Price: ₹{products[item.productId]?.price || 'N/A'}
                </div>
                <div  className={styles.product_days}>
                  Quantity: {item.quantity || 0}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default History;
