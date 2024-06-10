import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { MdSupportAgent } from "react-icons/md";
import { jwtDecode } from "jwt-decode";
import { IoSend } from "react-icons/io5";
import { debounce } from "lodash";
import { FaUser, FaUserTie } from "react-icons/fa";

const MerchantChat = ({ userType }) => {
  const [ws, setWs] = useState(null);
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;
  const messagesEndRef = useRef(null);

  const [Users, setUsers] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [sortedUsers, setSortedUsers] = useState(null);
  const [initialUsers, setInitialUsers] = useState([]);


  useEffect(() => {
    const token = localStorage.getItem("token");
    document.cookie = `token=${token}`;
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);

    async function fetchMessages() {
      try {
        if(selectedUser){

          const response = await axios.get(
            `${API_URL}/api/message/merchants/${decodedToken.id}/${selectedUser}`
          );
          setAllMessages(response.data);
        }
        } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }

    const throttledFetchMessages = debounce(fetchMessages, 200);

    throttledFetchMessages();
  
    return throttledFetchMessages.cancel;
  }, [API_URL,selectedUser, message, ws]);

  useEffect(() => {
    const ws = new WebSocket(`ws://${process.env.REACT_APP_WEBSOCKET_URL}`);

    setWs(ws);
    ws.addEventListener("message", handleMessage);

    return () => {
      ws.close();
    };
  }, [message, selectedUser]);

  async function handleMessage(event) {
    try {
      const data = await JSON.parse(event.data);
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      if (data.event === "new_message" && selectedUser) {
        async function fetchMessages() {
          try {
            const response = await axios.get(
              `${API_URL}/api/message/merchants/${decodedToken.id}/${selectedUser}`
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
    ws.send(JSON.stringify({ text: message, to: selectedUser, role : "merchant" }));
    setMessage("");
  }

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    let merchId;
    if (decodedToken) {
      merchId = decodedToken.id;
      fetchUsersName(merchId); // Pass merchId to fetchUsersName function
    } else {
      console.error("Error: Decoded token is undefined");
    }
  }, []);
  
  const fetchUsersName = async (merchId) => {
    try {
      const response = await axios.get(`${API_URL}/api/message/merchants/${merchId}`);
      setUsers(response.data)
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const selectedUserMessages = allMessages?.filter(
    (message) => message.from === selectedUser || message.to === selectedUser
  );

  const [searchQuery, setSearchQuery] = useState('');


  useEffect(() => {
    if (Users) {
      // Function to get the latest message timestamp for a user to the merchant
      const getLatestMessageTimestamp = (userId) => {
        const userMessages = allMessages.filter(
          (message) => (message.from === userId || message.to === userId) && message.to === selectedUser
        );
        if (userMessages.length > 0) {
          const latestMessage = userMessages.reduce((prev, current) =>
            new Date(prev.createdAt) > new Date(current.createdAt)
              ? prev
              : current
          );
          return new Date(latestMessage.createdAt);
        }
        return null;
      };
  
      // Sort users based on the latest message timestamp to the merchant
      const sortedUsers = [...Users].sort((a, b) => {
        const latestMessageTimestampA = getLatestMessageTimestamp(a._id);
        const latestMessageTimestampB = getLatestMessageTimestamp(b._id);
        if (!latestMessageTimestampA && !latestMessageTimestampB) return 0;
        if (!latestMessageTimestampA) return 1;
        if (!latestMessageTimestampB) return -1;
        return latestMessageTimestampB - latestMessageTimestampA;
      });
  
      setSortedUsers(sortedUsers);
      setInitialUsers(sortedUsers);
    }
  }, [allMessages, Users, selectedUser]);
  
  
  
  

  

  const handleSearchInputChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchQuery(searchTerm);
  
    let searchWords = [];
  
    if (searchTerm) {
      searchWords = searchTerm.split(' '); 
      const filtered = initialUsers.filter(item =>
        searchWords.some(word => item.name.toLowerCase().includes(word))
      );
      setSortedUsers(filtered);
    } else {
      setSortedUsers(initialUsers);
    }
  
    if (event.key === 'Backspace') {
      setSortedUsers(initialUsers);
  
      if (searchTerm) {
        searchWords = searchTerm.split(' '); 
        const filtered = initialUsers.filter(item =>
          searchWords.some(word => item.name.toLowerCase().includes(word))
        );
        setSortedUsers(filtered);
      }
    }
  };

  return (
    <div>
      <div class="container mx-auto shadow-sm rounded-sm">
        <div class="flex flex-row justify-between bg-white">
          <div class="flex flex-col w-2/5 border-r-2 overflow-y-auto h-[85vh]">
            <div class="border-b-2 py-4 px-2">
              <input
                type="text"
                onChange={handleSearchInputChange}
                placeholder="search chatting"
                class="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"
              />
            </div>
            {Users && sortedUsers && sortedUsers?.map(item =>
              <div onClick={()=>setSelectedUser(item._id)} class={`flex flex-col md:flex-row md:gap-6 py-4 px-2 justify-center items-center border-b-2 ${selectedUser === item._id ? 'bg-gray-200': 'bg-white'}`}>
              <div className="bg-slate-200 rounded-full p-2">
                <FaUser color="#000000" size={30} />
              </div>

              <div class="w-full text-center md:text-left">
                <div class="text-lg font-semibold">{item.name}</div>
              </div>
            </div>
            )}
          </div>

          {selectedUser && <div class="w-full px-5 flex flex-col justify-between h-[85vh]">
            <div class="flex flex-col mt-5 overflow-y-auto ">
              {selectedUserMessages?.map((item, index) => (
                <>
                  {item.role === "merchant" ? (
                    <div key={index} class="flex justify-end mb-4 items-center">
                      <div class="mr-2 py-3 px-4 bg-blue-500 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
                        {item.content}
                      </div>
                      <FaUserTie size={20} />
                    </div>
                  ) : (
                    <div key={index} class="flex justify-start mb-4">
                       <div className="object-cover h-10 w-10 font-mono rounded-full bg-gray-200 text-blue-800 flex items-center justify-center">
                        <img className="w-4 h-4" src="./avatar/avatar.png" alt="" />
                      </div>

                      <div class="ml-2 py-3 px-4 bg-slate-200 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-gray-800">
                        {item.content}
                      </div>
                    </div>
                  )}
                </>
              ))}
              <div ref={messagesEndRef}></div>
            </div>
            <div class="py-8 relative flex flex-col items-center">
              <input
                class="w-full bg-gray-100 py-5 px-3 rounded-xl focus:outline-none border focus:border-black focus:bg-white break-all"
                type="text"
                placeholder="Type your message here..."
                style={{ wordWrap: "break-word" }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                onClick={sendMessage}
                class="px-5 bg-blue-500 text-white rounded-xl py-4 mt-4 flex items-center justify-center gap-4"
              >
                Send <IoSend size={25} className="mt-[0.15rem]" />
              </button>
            </div>
          </div>}
        </div>
      </div>
    </div>
  );
};

export default MerchantChat;