const express = require('express');
const router = express.Router();


const User = require('../Models/User'); 
const Product = require('../Models/Products');
const History = require('../Models/History');




router.get('/', async(req,res)=>{
    try {
    const data = await User.find({})
    res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
})

router.delete('/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully", deletedUser });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});


router.get('/analyze-history', async (req, res) => {
    try {
      const historyData = await History.find();
      const uniqueUserIds = new Set(historyData.map(entry => entry.userId));
      const uniqueUserIdsCount = uniqueUserIds.size;
      // Counting unique productIds
      const uniqueProductIds = new Set();
      historyData.forEach(entry => {
        entry.cartItems.forEach(item => {
          uniqueProductIds.add(item.productId.toString());
        });
      });
      const uniqueProductIdsCount = uniqueProductIds.size;
  
      res.status(200).json({
        uniqueUserIdsCount: uniqueUserIdsCount,
        uniqueProductIdsCount: uniqueProductIdsCount
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;