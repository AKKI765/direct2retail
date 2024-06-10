import React, { useEffect, useRef, useState } from "react";
import { IoIosSend, IoIosClose } from "react-icons/io";
import { FaUserTie, FaUser } from "react-icons/fa";
import axios from "axios";
import { debounce } from "lodash";
import { jwtDecode } from "jwt-decode";

const ProductDetails = ({ product, setModelDetails, handleAddToCart }) => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [ws, setWs] = useState(null);
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null)
  const messagesEndRef = useRef(null);

  const [ChatVisible, setChatVisible] = useState(false);

  useEffect(() => { 
    const fetchMessage = async (userId, merchId) => {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      setSelectedUser(decodedToken.id)
      merchId = product.userId
      if(decodedToken){  
        userId = decodedToken.id
      }
      try {
        const response = await axios.get(
          `${API_URL}/api/message/merchants/${userId}/${merchId}`
        );
        setAllMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessage();
  }, [API_URL,product.userId,message, ws]);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      document.cookie = `token=${token}`;
    } catch (e) {
      const cookies = document.cookie.split("; ");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i]; 
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      }
    }
  }, []);

  useEffect(() => {
    const ws = new WebSocket(`ws://${process.env.REACT_APP_WEBSOCKET_URL}`);

    setWs(ws);
    ws.addEventListener("message", handleMessage);

    return () => {
      ws.close();
    };
  }, [message]);

  async function handleMessage(event) {
    try {
      const data = await JSON.parse(event.data);
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      if (data.event === "new_message" && product?.userId) {
        async function fetchMessages() {
          try {
            const response = await axios.get(
              `${API_URL}/api/message/merchants/${product.userId}/${decodedToken.id}`
            );
            setAllMessages(response.data);
          } catch (error) {
            console.error("Error fetching messages:", error);
          }
        }
        const throttledFetchMessages = debounce(fetchMessages, 200);

        throttledFetchMessages();
      }
    } catch (error) {
      console.error("Error parsing JSON data:", error);
    }
  }

  function sendMessage() {
    ws.send(JSON.stringify({ text: message, to: product.userId.toString(), role : "user" }));
    setMessage("");
  }

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function handleCloseChat() {
    setChatVisible(false);
  }

  const selectedUserMessages = allMessages?.filter(
    (message) => message.from === selectedUser || message.to === selectedUser
  );

  return (
    <>
      <div className="">
        <div class="bg-gray-100 dark:bg-gray-800 py-8 relative">
          <div
            className="md:right-10 absolute cursor-pointer top-0 right-0"
            onClick={() => setModelDetails(null)}
          >
            <IoIosClose size={40} />
          </div>
          <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col md:flex-row -mx-4">
              <div class="md:flex-1 px-4">
                <div class="h-[460px] rounded-lg bg-gray-300 dark:bg-gray-700 mb-4">
                  {product.image && product.image.startsWith("https://") ? (
                    <img
                      class="w-full h-full object-cover"
                      src={product.image}
                      alt={product.productName}
                    />
                  ) : (
                    <img
                      class="w-full h-full object-cover"
                      src={`${API_URL}/${product.image.replace(/\\/g, "/")}`}
                      alt={product.productName}
                    />
                  )}
                </div>
                <div class="flex -mx-2 mb-4">
                  <div class="w-full px-2 gap-2 flex">
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      class="w-1/2 bg-gray-900 dark:bg-gray-600 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-700"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => setChatVisible(true)}
                      class="w-1/2 bg-blue-900  text-white py-2 px-4 rounded-full font-bold hover:bg-blue-800 "
                    >
                      Contact
                    </button>
                  </div>
                </div>
              </div>
              <div class="md:flex-1 px-4">
                <h2 class="text-2xl flex justify-center mb-8 font-bold text-gray-800 dark:text-white">
                  {product.productName}
                </h2>

                <div class="flex mb-4 justify-around">
                  <div class="mr-4 ">
                    <span class="font-bold text-gray-700 dark:text-gray-300">
                      Price:
                    </span>
                    <span class="text-gray-600 dark:text-gray-300 ml-1">
                      ₹{product.price}
                    </span>
                  </div>
                  <div>
                    <span class="font-bold text-gray-700 dark:text-gray-300">
                      Availability:
                    </span>
                    <span class=" bg-green-500 rounded-full ml-2 px-3 mt-2"></span>
                  </div>
                </div>
                <div class="mb-4 flex gap-2 justify-center">
                  <span class="font-bold text-gray-700 dark:text-gray-300">
                    Days:
                  </span>
                  <div class="flex items-center">{product.days}</div>
                </div>
                <div class="mb-4 flex justify-around">
                  <div>
                    <span class="font-bold  text-gray-700 dark:text-gray-300">
                      Address:
                    </span>
                    <div class="flex items-center mt-2">
                      {product.city}, {product.state}, {product.pincode}
                    </div>
                  </div>
                  <div></div>
                </div>
                <div className="mb-4 -ml-6 flex justify-center">
                  <div>
                    <span class="font-bold text-gray-700 dark:text-gray-300">
                      Rack Description
                    </span>
                  </div>
                </div>
                <div class="mb-4 flex justify-around">
                  <div>
                    <p class="text-gray-600 flex items-center dark:text-gray-300 text-sm mt-2">
                      {product.details}
                    </p>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {ChatVisible && (
        <div>
          <div class="absolute right-0 bottom-0 w-1/4 h-3/5 flex flex-col border shadow-md bg-white">
            <div class="flex items-center justify-between border-b p-2">
              <div class="flex items-center">
                <div class="pl-2">
                  <div class="font-semibold">
                    <span class="hover:underline" href="#">
                      {product.productName}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <button
                  class="inline-flex hover:bg-indigo-50 rounded-full p-2"
                  type="button"
                  onClick={handleCloseChat}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div class="flex-1 px-4 py-4 overflow-y-auto">
            {selectedUserMessages?.map((item, index) => (
              <>
              {item.role === "merchant" ? (
              
              <div class="flex items-center mb-4">
                <div class="flex-none flex flex-col items-center space-y-1 mr-4">
                <FaUserTie size={18} />
                  
                </div>
                <div class="flex-1 bg-indigo-100 text-gray-800  p-2 rounded-lg mb-2 relative">
                  <div>
                  {item.content}
                  </div>

                  <div class="absolute left-0 top-1/2 transform -translate-x-1/2 rotate-45 w-2 h-2 bg-indigo-100"></div>
                </div>
              </div>
              ):(
              <div class="flex items-center flex-row-reverse mb-4">
                <div class="flex-none flex flex-col items-center space-y-1 ml-4">
                  <FaUser size={18} />
                </div>
                <div class="flex-1 bg-indigo-400 text-white p-2 rounded-lg mb-2 relative">
                  <div>
                  {item.content}
                  </div>

                  <div class="absolute right-0 top-1/2 transform translate-x-1/2 rotate-45 w-2 h-2 bg-indigo-400"></div>
                </div>
              </div>
            )}
          </>
          ))}
          <div ref={messagesEndRef}></div>
            </div>

            <div class="flex items-center border-t p-2">
              <div class="w-full mx-2">
                <input
                  class="w-full rounded-full border border-gray-200 p-2"
                  type="text"
                  placeholder="Aa"
                  autofocus
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div>
                <button
                  class="inline-flex items-center hover:bg-indigo-50 rounded-full p-2"
                  type="button"
                  onClick={sendMessage}
                >
                  <IoIosSend size={28} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
