const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require("../Models/Products");



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + ext); // Generate unique filename for uploaded file
  }
});

const upload = multer({ storage: storage });

// Create a new product
router.post("/products", async (req, res) => {
  try {
    const {
      productName,
      price,
      days,
      image,
      state,
      city,
      pincode,
      details,
      lati,
      longi,
      userId,
    } = req.body;
    const product = new Product({
      productName,
      price,
      days,
      image,
      state,
      city,
      pincode,
      details,
      latlng: [lati, longi],
      availability: true,
      userId,
    });
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post('/image/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageUrl = req.file.path; // Assuming the file path will serve as the image URL
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a specific product by ID
router.get("/products/:productId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a product by ID
router.put("/products/:id", async (req, res) => {
  try {
    const { availability } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { availability },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a product by ID
router.delete("/products/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

module.exports = router;
