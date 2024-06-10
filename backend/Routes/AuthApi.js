const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const axios = require('axios');

const User = require('../Models/User'); 

const jwt = require('jsonwebtoken');


router.post('/signup', async (req, res) => {
  try {
    const { name ,email ,gst ,password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    let GST = gst.toUpperCase()


    const newUser = new User({
      name,
      email,
      gst:GST,
      password: hashedPassword,
    });


    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.post('/signup-admin', async (req, res) => {
  try {
    const { name ,email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Hashed password:', hashedPassword);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin:true,
    });


    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: "An error occurred" });
  }
});


router.post('/signup-merchant', async (req, res) => {
  try {
    const { name ,email ,gst ,password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    let GST = gst.toUpperCase()

    console.log('Hashed password:', hashedPassword);

    const newUser = new User({
      name,
      email,
      gst:GST,
      password: hashedPassword,
      isMerchant:true,
    });


    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.get("/mapper",async(req,res)=>{
  try {
    const response = await axios.get('https://locator-main.vercel.app/key');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
})

router.get('/checkEmail', async(req, res)=>{
  const { email } = req.query;
  try {
    const existingUser = await User.findOne({ email });
    if(existingUser){

      res.json({ message: 'Email Already Exist' });
    }else{
      res.json({ message: 'Valid Email' });

    }
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, email: user.email, name:user.name, isAdmin:user.isAdmin, isMerchant:user.isMerchant}, process.env.JWT_SECRET);
    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = router;
