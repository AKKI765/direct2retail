import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { MdSupportAgent } from "react-icons/md";
import { jwtDecode } from "jwt-decode";
import { IoSend } from "react-icons/io5";
import { debounce } from "lodash";

const UserSupportChat = ({ userType }) => {
  const [ws, setWs] = useState(null);
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;
  const messagesEndRef = useRef(null);


  useEffect(()=>{
    const fetchMerchants = async ()=>{
      try {
        const response = await axios.get(
          `${API_URL}/api/message/merchants`
        );
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }

    fetchMerchants()
  },[API_URL])

  useEffect(() => {
    const token = localStorage.getItem("token");
    document.cookie = `token=${token}`;
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);

    async function fetchMessages() {
      try {
        const response = await axios.get(
          `${API_URL}/api/message/toAdmin/${decodedToken.id}`
        );
        setAllMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }

    const throttledFetchMessages = debounce(fetchMessages, 200);

    throttledFetchMessages();
  
    return throttledFetchMessages.cancel;
  }, [API_URL, message, ws]);

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
      if (data.event === "new_message") {
        async function fetchMessages() {
          try {
            const response = await axios.get(
              `${API_URL}/api/message/toAdmin/${decodedToken.id}`
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
    ws.send(JSON.stringify({ text: message, toAdmin: "isAdmin" }));
    setMessage(""); 
  }

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div>
      <div class="container mx-auto shadow-sm rounded-sm">
        <div class="flex flex-row justify-between bg-white">
          <div class="flex flex-col w-2/5 border-r-2 overflow-y-auto h-[85vh]">
            <div class="border-b-2 py-4 px-2">
              <input
                type="text"
                placeholder="search chatting"
                class="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"
              />
            </div>
            <div class="flex flex-col md:flex-row md:gap-6 py-4 px-2 justify-center items-center border-b-2">
              <div className="bg-slate-200 rounded-full p-2">
                <MdSupportAgent color="#000000" size={36} />
              </div>

              <div class="w-full text-center md:text-left">
                <div class="text-lg font-semibold">Contact Support</div>
              </div>
            </div>
          </div>

          <div class="w-full px-5 flex flex-col justify-between h-[85vh]">
            <div class="flex flex-col mt-5 overflow-y-auto ">
              {allMessages.map((item, index) => (
                <>
                  {item.role === "user" ? (
                    <div key={index} class="flex justify-end mb-4">
                      <div class="mr-2 py-3 px-4 bg-blue-500 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
                        {item.content}
                      </div>
                      <div className="object-cover h-10 w-10 font-mono rounded-full bg-gray-200 text-blue-800 flex items-center justify-center">
                        <img className="w-4 h-4" src="./avatar/avatar.png" alt="" />
                      </div>
                    </div>
                  ) : (
                    <div key={index} class="flex justify-start mb-4">
                      <div className="object-cover h-10 w-10 p-2 font-mono rounded-full bg-gray-200 text-blue-800 flex items-center justify-center">
                        <MdSupportAgent size={28} />
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSupportChat;
