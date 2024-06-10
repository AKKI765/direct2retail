import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./MerchantOrder.module.css";

import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../Context/ToastContext";

const MerchantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;
  const { showSuccessToast, showErrorToast } = useToast();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const decodedToken = jwtDecode(token);
        if (decodedToken.isMerchant) {
          const response = await axios.get(
            `${API_URL}/api/orders/get-orders/${decodedToken.id}`
          );

          setOrders(response.data);

          const productIds = [
            ...new Set(
              response.data.flatMap((order) =>
                order.cartItems.map((item) => item.productId)
              )
            ),
          ];

          const productDetails = {};
          for (const productId of productIds) {
            const productResponse = await axios.get(
              `${API_URL}/api/prod/products/${productId}`
            );
            productDetails[productId] = productResponse.data;
          }
          setProducts(productDetails);
        } else {
          navigate("/login");
        }
      } catch (error) {
        showErrorToast("Server Busy");
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [API_URL, showErrorToast, navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      if (!decodedToken.isMerchant) {
        navigate("/login");
      }
    }
  }, [navigate]);

  const handleDeliveredClick = async (orderId) => {
    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 800));

      await axios.delete(`${API_URL}/api/orders/delete-order/${orderId}`);

      // Update the orders list
      const updatedOrders = orders.filter((order) => order._id !== orderId);
      setOrders(updatedOrders);
      showSuccessToast("Delivered Success");
    } catch (error) {
      console.error("Error marking as delivered:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log(products)
  return (
    // <div className= {styles.body}>
    <div className={styles.order_list}>
      <h2 className="flex justify-center items-center ml-0">ORDER LIST</h2>
      {orders.map((order) => (
        <div className={styles.order_card} key={order._id}>
          {order.cartItems.map((item, index) => (
            <div className={styles.product_details} key={index}>
              <div className={styles.product_image}>
                {products && products[item.productId] && products[item.productId].image &&
                products[item.productId].image.startsWith("https://") ? (
                  <img
                    src={products[item.productId].image}
                    alt={products[item.productId].productName}
                  />
                ) : (
                  products && products[item.productId] && (<img
                    src={`${API_URL}/${products[item.productId].image.replace(
                      /\\/g,
                      "/"
                    )}`}
                    alt={products[item.productId].productName}
                  />)
                )}
              </div>

              <div className={styles.order_details}>
                <div className={styles.order_id}>
                  <span> Order ID: </span> {order.userDetails[0].order_id}
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
                  Product Name:{" "}
                  {products[item.productId]?.productName || "Product Not Found"}
                </div>
                <div className={styles.product_price}>
                  Price: ₹{products[item.productId]?.price || "N/A"}
                </div>
                <div className={styles.product_days}>
                  Days: {products[item.productId]?.days || "N/A"}
                </div>
                <div className={styles.product_days}>
                  Qty: {order.cartItems[0]?.quantity || "1"}
                </div>
              </div>
            </div>
          ))}
          <button
            className={styles.deliver_button}
            onClick={() => handleDeliveredClick(order._id)}
            disabled={loading}
          >
            {loading ? "Processing..." : "Delivered"}
          </button>
        </div>
      ))}
    </div>
    // </div>
  );
};

export default MerchantOrders;
