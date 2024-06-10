import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useToast } from "../../Context/ToastContext";
import styles from "./ManageMerchantRack.module.css";

const ManageMerchantRack = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;
  const { showSuccessToast, showErrorToast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken?.id);
      if (!decodedToken.isMerchant) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        navigate("/login");
        return;
      }
      try {
        const response = await axios.get(`${API_URL}/api/prod/products`);
        const userProducts = response.data.filter(
          (product) => product.userId === userId
        );
        setProducts(userProducts);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [navigate, userId, API_URL]);

  const handleAvailability = async (productId, availability) => {
    try {
      await axios.put(`${API_URL}/api/prod/products/${productId}`, {
        availability,
      });
      const response = await axios.get(`${API_URL}/api/prod/products`);
      const userProducts = response.data.filter(
        (product) => product.userId === userId
      );
      setProducts(userProducts);
      showSuccessToast("Changed Availability Setting");
    } catch (error) {
      showErrorToast("Error Fetching Try Later");
      console.error("Error updating availability:", error);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`${API_URL}/api/prod/products/${productId}`);
      const response = await axios.get(`${API_URL}/api/prod/products`);
      const userProducts = response.data.filter(
        (product) => product.userId === userId
      );
      setProducts(userProducts);
      showSuccessToast("Product Deleted");
    } catch (error) {
      showErrorToast("Error Fetching Try Later");

      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className={styles.home_container}>
      {products.map((product) => (
        <div className={styles.card} key={product._id}>
          {product.image && product.image.startsWith("https://") ? (
            <img src={product.image} alt={product.productName} />
          ) : (
            <img
              src={`${API_URL}/${product.image.replace(/\\/g, "/")}`}
              alt={product.productName}
            />
          )}

          <div className={styles.card_details}>
            <h3>{product.productName}</h3>
            <p>Price: ₹{product.price}</p>
            <p>Days: {product.days}</p>
            <p>
              Location: {product.city}, {product.state}
            </p>
          </div>
          <div>
            <button
              className={styles.btn_availability}
              onClick={() =>
                handleAvailability(product._id, !product.availability)
              }
            >
              {product.availability ? "Make Unavailable" : "Make Available"}
            </button>
            <button
              className={styles.btn_delete_product}
              onClick={() => handleDelete(product._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManageMerchantRack;
