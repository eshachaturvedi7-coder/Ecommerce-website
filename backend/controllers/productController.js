const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
// @desc    Get all products
// @route   GET /api/products
exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.status(200).json({ success: true, count: products.length, products });
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  res.status(200).json({ success: true, product });
};

// @desc    Create new product (Admin only)
// @route   POST /api/products
exports.createProduct = async (req, res) => {
  const { name, description, price, discountPrice, category, brand, stock } = req.body;

  let images = [];

  // Agar files upload hui hain to Cloudinary pe upload karo
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'ecommerce_products' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });

      images.push({ url: result.secure_url, public_id: result.public_id });
    }
  }

  const product = await Product.create({
    name,
    description,
    price,
    discountPrice,
    category,
    brand,
    stock,
    images
  });

  res.status(201).json({ success: true, product });
};

// @desc    Update product (Admin only)
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, product });
};

// @desc    Delete product (Admin only)
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // Cloudinary se saari images delete karo
  for (const image of product.images) {
    await cloudinary.uploader.destroy(image.public_id);
  }

  await product.deleteOne();

  res.status(200).json({ success: true, message: 'Product deleted successfully' });
};