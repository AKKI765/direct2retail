const express = require('express');
const router = express.Router();
const Cart = require('../Models/Cart');
const History = require('../Models/History');
const Orders = require('../Models/Orders')
const Product = require('../Models/Products');
const MerchantHistory = require('../Models/MerchantHistory');

// Route to add a product to the cart
router.post('/add-to-cart', async (req, res) => {
    const { userId, productId } = req.body;

    try {
        // Check if the product is already in the cart for the user
        const existingCartItem = await Cart.findOne({ userId, productId });

        if (existingCartItem) {
            // If the product exists in the cart, update the quantity
            existingCartItem.quantity += 1;
            await existingCartItem.save();
        } else {
            // If the product is not in the cart, create a new cart item
            const newCartItem = new Cart({
                userId,
                productId,
                quantity: 1,
            });
            await newCartItem.save();
        }

        res.status(200).json({ message: 'Product added to cart' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error adding product to cart' });
    }
});

// Route to remove a product from the cart
router.post('/remove-from-cart', async (req, res) => {
    const { userId, productId } = req.body;

    try {
        await Cart.findOneAndDelete({ userId, productId });

        res.status(200).json({ message: 'Product removed from cart' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error removing product from cart' });
    }
});


router.get('/user/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const userCart = await Cart.find({ userId }).populate('productId');

        res.status(200).json(userCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching user cart' });
    }
});




router.delete('/:itemId', async (req, res) => {
    const itemId = req.params.itemId;
    try {
        const cartItem = await Cart.findById(itemId);
        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        await Cart.findByIdAndDelete(itemId); // Use findByIdAndDelete
        res.status(200).json({ message: 'Cart item removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting cart item' });
    }
});




router.put('/decrease/:itemId', async (req, res) => {
    const itemId = req.params.itemId;
    try {
        const cartItem = await Cart.findById(itemId);
        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
            await cartItem.save();
            res.status(200).json(cartItem);
        } else {
            // If quantity is 1, remove the cart item
            await Cart.findByIdAndRemove(itemId);
            res.status(200).json({ message: 'Cart item removed' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error decreasing cart item quantity' });
    }
});



router.put('/increase/:itemId', async (req, res) => {
    const itemId = req.params.itemId;
    try {
        const cartItem = await Cart.findById(itemId);
        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        cartItem.quantity += 1;
        await cartItem.save();

        res.status(200).json(cartItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error increasing cart item quantity' });
    }
});


router.get('/count/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
  
      const totalCount = await Cart.countDocuments({ userId });
  
      res.status(200).json({ totalCount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/clear/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        const cartItems = await Cart.find({ userId: userId });


        await Promise.all(cartItems.map(async (cartItem) => {
            // Create a new order for the current cart item
            await Orders.create({
                userDetails: req.body.userDetails,
                cartItems: [cartItem], // Create an array with a single cart item
                userId: userId,
            });

            await MerchantHistory.create({
                userDetails: req.body.userDetails,
                cartItems: [cartItem], // Create an array with a single cart item
                userId: userId,
            });
            // Set product availability to false
            const productId = cartItem.productId;
            await Product.findByIdAndUpdate(productId, { availability: false });
        }));



        await History.create({
            userDetails: req.body.userDetails,
            cartItems: cartItems,
            userId: userId,
        });



        await Promise.all(cartItems.map(async (cartItem) => {
            const productId = cartItem.productId;
            await Product.findByIdAndUpdate(productId, { availability: false });
        }));


        await Cart.deleteMany({ userId: userId });

        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
