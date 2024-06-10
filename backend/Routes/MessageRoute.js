const express = require("express");
const router = express.Router();
const Message = require("../Models/Message");
const History = require("../Models/History");
const Product = require("../Models/Products");
const User = require("../Models/User");

// Endpoint to fetch messages for admin user
router.get("/toAdmin/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const userMessages = await Message.find({
      from: userId,
      toAdmin: true,
    }).sort({ createdAt: 1 });

    const adminMessages = await Message.find({
      role: "admin",
      to: userId,
    }).sort({ createdAt: 1 });

    const allMessages = [...userMessages, ...adminMessages].sort(
      (a, b) => a.createdAt - b.createdAt
    );

    res.json(allMessages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/admin/support", async (req, res) => {
  try {
    // Find user messages sent to admin
    const userMessages = await Message.find({ toAdmin: true }).sort({
      createdAt: 1,
    });

    // Group user messages by user ID
    const userMessagesGrouped = userMessages.reduce((acc, message) => {
      const userId = message.from;
      if (!acc[userId]) {
        acc[userId] = [];
      }
      acc[userId].push(message);
      return acc;
    }, {});

    // Find admin responses to user messages
    const adminMessages = await Message.find({ role: "admin" }).sort({
      createdAt: 1,
    });

    // Group admin responses by user ID
    const adminMessagesGrouped = adminMessages.reduce((acc, message) => {
      const userId = message.to;
      if (!acc[userId]) {
        acc[userId] = [];
      }
      acc[userId].push(message);
      return acc;
    }, {});

    // Combine user messages and admin responses
    const allMessages = Object.keys(userMessagesGrouped)
      .flatMap((userId) => {
        const userMsgs = userMessagesGrouped[userId] || [];
        const adminMsgs = adminMessagesGrouped[userId] || [];
        return [...userMsgs, ...adminMsgs];
      })
      .concat(
        adminMessages.filter((msg) => !msg.to || !userMessagesGrouped[msg.to])
      );

    // Sort all messages by createdAt timestamp
    allMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    res.json(allMessages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.get("/merchants/:userId/:merchId", async (req, res) => {
  try {
    const { userId, merchId } = req.params;

    const MerchantMessages = await Message.find({ from: merchId, to: userId });
    const UserMessages = await Message.find({ to: merchId, from: userId });

    const allMessages = [...MerchantMessages, ...UserMessages];

    const sortedMessages = allMessages.sort((a, b) => a.createdAt - b.createdAt);

    res.status(200).json(sortedMessages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get("/merchants/:merchId", async (req, res) => {
  try {
    const { merchId } = req.params;

    // Find all messages sent to the merchant
    const allUserMessages = await Message.find({ to: merchId });

    // Extract unique sender user IDs
    const fromUserIds = new Set(allUserMessages.map((message) => message.from));

    // Fetch users based on their IDs
    const users = await User.find({ _id: { $in: Array.from(fromUserIds) } });

    // Sort users based on the timestamp of their latest message to the merchant
    users.sort((a, b) => {
      // Find the latest message sent by each user to the merchant
      const latestMessageA = allUserMessages.find((message) => message.from.toString() === a._id.toString());
      const latestMessageB = allUserMessages.find((message) => message.from.toString() === b._id.toString());

      // If no messages found for user A, prioritize user B
      if (!latestMessageA) return 1;
      // If no messages found for user B, prioritize user A
      if (!latestMessageB) return -1;

      // Compare the timestamps of the latest messages
      return new Date(latestMessageB.createdAt) - new Date(latestMessageA.createdAt);
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});





router.get("/merchants", async (req, res) => {
    try {
        const merchants = await Product.find({}).populate('userId'); // Populate the 'userId' field

        console.log(merchants)
        // Initialize a set to store unique user details
        const userDetailsSet = new Set();

        // Extract userId and associated user details from each product
        merchants.forEach(product => {
            const userDetails = {
                id: product.userId._id,
                name: product.userId.name,
                email: product.userId.email,
            };
            userDetailsSet.add(userDetails);
        });

        res.json([...userDetailsSet]);
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



module.exports = router;
