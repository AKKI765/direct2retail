import {jwtDecode} from 'jwt-decode';
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cart, setCart] = useState([]);

  const fetchCartItemCount = async () => {
    try {
      const token = localStorage.getItem('token');

      if(token){

        const decodeToken = jwtDecode(token);
        
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/cart/count/${decodeToken.id}`);
        const data = await response.json();
        const totalCount = data?.totalCount || 0;
        setCartCount(totalCount);
      }
    } catch (error) {
      console.error('Error fetching cart items count:', error);
    }
  };

  useEffect(() => {
    fetchCartItemCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, fetchCartItemCount, cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
