const express = require("express");
require("dotenv").config();
const connectDB = require("./Middleware/DB");
const port = process.env.PORT || 6000;
const cors = require("cors");
const authenticate = require("./Routes/AuthApi");
const cartList = require("./Routes/CartApi");
const product = require("./Routes/ProductApi");
const orders = require("./Routes/Orders");
const checkout = require("./Routes/Checkout");
const users = require("./Routes/Users");
const MessageRoute = require("./Routes/MessageRoute")
const ws = require("ws");
const jwt = require("jsonwebtoken");
const Message = require("./Models/Message");
const WebSocket = require("ws");
const multer = require('multer');
const path = require('path');


const app = express();
app.use(express.json());

const corsOptions = {
  origin: [
    "https://rack-store-frontend-three.vercel.app",
    "https://rack-store-backend-ten.vercel.app",
    "http://localhost:3000",
    "https://rack-store-frontend.vercel.app",
    "https://rack-store-backend.vercel.app",
    "https://direct2-retail.vercel.app",
  ],
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB();

app.get("/", (req, res) => {
  res.json("Rack Api");
});

app.use("/api/auth", authenticate);
app.use("/api/prod", product);
app.use("/api/cart", cartList);
app.use("/api/orders", orders);
app.use("/api/razorpay", checkout);
app.use("/api/user", users);
app.use("/api/message", MessageRoute);



const server = app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});

const wss = new ws.WebSocketServer({ server ,pingInterval: 30000, pingTimeout: 3600000,});


wss.on("connection", (connection, req) => {
  const cookies = req.headers.cookie;

  if (cookies) {
    const tokenCookieString = cookies
      .split(";")
      .map((str) => str.trim())
      .find((str) => str.startsWith("token="));

    if (tokenCookieString) {
      const token = tokenCookieString.split("=")[1];
      if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, userData) => { 
          if (err) {
            console.error("Error verifying JWT token:", err);
            return;
          }
          const { id, name, isAdmin, isMerchant } = userData;
          connection.id = id;
          connection.name = name;
          connection.isAdmin = isAdmin;
          connection.isMerchant = isMerchant;
        });
        console.log(token);
      }
    }
  }

  connection.on("message", async (message) => {
    try {
      const { toAdmin,to, text, role} = JSON.parse(message);
      
      if (toAdmin === "isAdmin") {
        const messageReceived = new Message({
          from: connection.id,
          role:"user",
          toAdmin: true,
          content: text,
        });
        await messageReceived.save();
      } else if (role === "admin") {
        const messageReceived = new Message({
          from: connection.id,
          role:"admin",
          to,
          content: text,
        });
        await messageReceived.save();

      } else if (role === "user") {

        const messageReceived = new Message({
          from: connection.id,
          role:"user",
          to,
          content: text,
        });
        await messageReceived.save();

      } else if (role === "merchant") {

        const messageReceived = new Message({
          from: connection.id,
          role:"merchant",
          to,
          content: text, 
        });
        await messageReceived.save();
        
      } else {
        throw new Error("Invalid recipient type");
      }

      // Broadcast the message to all clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ event: "new_message" }));
        }
      });
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });


});








  // Send online user data to all clients
  // wss.clients.forEach((client) => {
  //   client.send(
  //     JSON.stringify({
  //       online: [...wss.clients].map((cli) => ({
  //         id: cli.id,
  //         name: cli.name,
  //         isAdmin: cli.isAdmin,
  //         isMerchant: cli.isMerchant,
  //       })),
  //     })
  //   );
  // });