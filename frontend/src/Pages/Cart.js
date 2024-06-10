import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import styles from "./Style/Cart.module.css";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useCart } from "../Context/CartContext";
import { useToast } from "../Context/ToastContext";
import Loading from "../Components/Loading";
import { HiShoppingBag } from "react-icons/hi2";

const Cart = () => {
  const navigate = useNavigate();
  const { showSuccessToast, showErrorToast } = useToast();

  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userName, setUserName] = useState("");
  const [userAddress, setUserAddress] = useState("");

  const API_URL = process.env.REACT_APP_API_URL;
  const { fetchCartItemCount } = useCart();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      navigate("/login");
      return;
    }

    const decodedToken = jwtDecode(storedToken);
    setUserId(decodedToken.id);
    setUserName(decodedToken.name);
    setUserEmail(decodedToken.email);

    const fetchUserCart = async () => {
      try {
        if (userId) {
          const response = await axios.get(
            `${API_URL}/api/cart/user/${userId}`
          );
          const filteredCartItems = response.data.filter(
            (item) => item?.productId?.availability
          );
          setCartItems(filteredCartItems);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user cart:", error);
        setIsLoading(false);
      }
    };

    fetchUserCart();
  }, [navigate, API_URL, userId]);

  const handleDelete = async (itemId) => {
    try {
      await axios.delete(`${API_URL}/api/cart/${itemId}`);
      setCartItems((items) => items.filter((item) => item._id !== itemId));
      fetchCartItemCount();
      showSuccessToast("Item Deleted");
    } catch (error) {
      showErrorToast("Error deleting");
      console.error("Error deleting item:", error);
    }
  };

  const handleIncreaseQuantity = async (itemId) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item._id === itemId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCartItems(updatedCartItems);

    try {
      await axios.put(`${API_URL}/api/cart/increase/${itemId}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDecreaseQuantity = async (itemId) => {
    if (cartItems.find((item) => item._id === itemId)?.quantity > 1) {
      const updatedCartItems = cartItems.map((item) => {
        if (item._id === itemId) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });
      setCartItems(updatedCartItems);

      try {
        await axios.put(`${API_URL}/api/cart/decrease/${itemId}`);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const subTotal = cartItems.reduce(
    (acc, item) => acc + item.productId.price * item.quantity,
    0
  );

  const clearUserCart = async (userId, userDetails) => {
    try {
      const response = await axios.post(`${API_URL}/api/cart/clear/${userId}`, {
        userDetails,
      });
      return response.data;
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  };

  const handleCheckout = async () => {
    try {
      // Check if email, phone number, and address are provided
      if (!userName || !userEmail || !userPhone || !userAddress) {
        showErrorToast("Please provide email, phone number, and address");
        return;
      }

      const response = await axios.post(`${API_URL}/api/razorpay/checkout`, {
        subTotal,
      });

      const { data } = response;
      const { id, amount } = data;

      const options = {
        key: process.env.REACT_APP_RAZOR_KEY,
        amount: amount,
        currency: "INR",
        name: "Rack Rentals",
        description: "Place Your Rack With Ease",
        order_id: id,
        handler: async function (response) {
          console.log(response.razorpay_payment_id);

          const process = await axios.post(
            `${API_URL}/api/razorpay/capture/${response.razorpay_payment_id}`,
            {
              subTotal,
            }
          );

          console.log(process.data);
          setIsLoading(true);
          clearUserCart(userId, process.data);
          setIsLoading(false);

          showSuccessToast("Payment successful");
          navigate("/order-placed");
        },
        prefill: {
          name: userName,
          email: userEmail,
          contact: userPhone,
        },
        notes: {
          address: userAddress,
          name: userName,
        },
        theme: {
          color: "#000000",
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        console.error("Razorpay script is not loaded or available");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      showErrorToast("Error during checkout");
    }
  };

  return isLoading ? (
    <Loading />
  ) : (
    <div className={styles.cart_container}>
      <h2>Rack Cart</h2>
      {cartItems.length === 0 ? (
      <p className="flex flex-col justify-center items-center"><HiShoppingBag size={120}/> <span className="text-md text-gray-500 mt-5">No Racks in Cart</span></p>
    ) : (
      <section className="flex items-center justify-center w-full mt-4 lg:max-w-4xl lg:mx-auto">
        <div className="container">
          <table className="w-full flex flex-row flex-no-wrap sm:bg-white rounded-lg overflow-hidden sm:shadow-lg my-5">
            <thead className="text-white">
              {cartItems?.map(
                (item) =>
                  item?.productId?.availability && (
                    <tr className="bg-black flex flex-col flex-no wrap sm:table-row rounded-l-lg sm:rounded-none mb-2 sm:mb-0">
                      <th className="p-3 text-left">Product</th>
                      <th className="p-3 text-left">Price</th>
                      <th className="p-3 text-left">Quantity</th>
                      <th className="p-3 text-left">Action</th>
                    </tr>
                  )
              )}
            </thead>
            <tbody className="flex-1 sm:flex-none">
              {cartItems?.map(
                (cartItem) =>
                  cartItem?.productId?.availability && (
                    <tr
                      key={cartItem._id}
                      className="flex flex-col flex-no wrap sm:table-row mb-2 sm:mb-0"
                    >
                      <td className="border-grey-light border hover:bg-gray-100 p-3">
                        {cartItem?.productId?.productName}
                      </td>
                      <td className="border-grey-light border hover:bg-gray-100 p-3 truncate">
                        {cartItem?.productId?.price}
                      </td>
                      <td className="border-grey-light border hover:bg-gray-100 p-3">
                        {cartItem?.quantity}
                      </td>
                      <td className="border-grey-light border hover:bg-gray-100 p-3 flex justify-around">
                        <button
                          onClick={() => handleIncreaseQuantity(cartItem._id)}
                        >
                          <FaPlus />
                        </button>
                        <button
                          onClick={() => handleDecreaseQuantity(cartItem._id)}
                          disabled={cartItem?.quantity === 1}
                          className={`${
                            cartItem?.quantity === 1 ? "cursor-not-allowed" : ""
                          }`}
                        >
                          <FaMinus />
                        </button>
                        <button onClick={() => handleDelete(cartItem._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </div>
      </section>
    )}
      {cartItems.length > 0 && (
            <div className={styles.checkout_form}>
              <input
                type="text"
                placeholder="Enter Name"
                value={userName}
                className="h-10 border mt-4 rounded px-4 w-full bg-gray-50 focus:outline-none focus:border-gray-600"
                onChange={(e) => setUserName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Enter Email"
                value={userEmail}
                className="h-10 border mt-4 rounded px-4 w-full bg-gray-50 focus:outline-none focus:border-gray-600"
                onChange={(e) => setUserEmail(e.target.value)}
                required
              />
              <input
                type="tel"
                placeholder="Enter Phone Number"
                value={userPhone}
                className="h-10 border mt-4 rounded px-4 w-full bg-gray-50 focus:outline-none focus:border-gray-600"
                onChange={(e) => setUserPhone(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Enter Address"
                className="h-10 border mt-4 rounded px-4 w-full bg-gray-50 focus:outline-none focus:border-gray-600"
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
                required
              />
              <div className="flex justify-center">
                <button
                  className={styles.checkout_button_main}
                  onClick={handleCheckout}
                >
                  Checkout
                </button>
              </div>
            </div>
          )
          }
    </div>
  );
};

export default Cart;
