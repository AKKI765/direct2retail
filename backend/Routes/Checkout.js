const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();
const axios = require('axios')


const razorInstance = new Razorpay({
    key_id: process.env.RAZOR_KEY,
    key_secret: process.env.RAZOR_SECRET
});

router.post("/checkout", async (req, res) => {
    const { subTotal } = req.body;

    try {
        const options = {
            amount: subTotal * 100,
            currency: "INR",
            receipt: "receipt#1",
            payment_capture: 0, // 0 - to capture payment later, 1 - to capture payment instantly
        };

        razorInstance.orders.create(options, async function (err, order) {
            if (err) {
                return res.status(500).json({
                    message: "Error creating Razorpay order"
                });
            }
            return res.status(200).json(order);
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error processing checkout"
        });
    }
});
router.post("/capture/:paymentId", async (req, res) => {
    const { subTotal } = req.body;
    try {
      const response = await axios.post(`https://${process.env.RAZOR_KEY}:${process.env.RAZOR_SECRET}@api.razorpay.com/v1/payments/${req.params.paymentId}/capture`, {
        amount: subTotal * 100,
        currency: "INR"
      });
  
      return res.status(200).json(response.data);
    } catch (err) {
      return res.status(500).json({
        message: err.message
      });
    }
  });


module.exports = router;
