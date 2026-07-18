const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get logged-in user's cart
// @route   GET /api/cart
exports.getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.id }).populate('items.product', 'name price images stock');

  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [], totalAmount: 0 });
  }

  res.status(200).json({ success: true, cart });
};

// @desc    Add item to cart
// @route   POST /api/cart
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  // Check karo product cart mein already hai ya nahi
  const existingItem = cart.items.find(item => item.product.toString() === productId);

  if (existingItem) {
    existingItem.quantity += quantity || 1;
  } else {
    cart.items.push({
      product: productId,
      quantity: quantity || 1,
      price: product.discountPrice > 0 ? product.discountPrice : product.price
    });
  }

  // Total amount calculate karo
  cart.totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  await cart.save();
  await cart.populate('items.product', 'name price images stock');

  res.status(200).json({ success: true, cart });
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/:productId
exports.updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return res.status(404).json({ success: false, message: 'Cart not found' });
  }

  const item = cart.items.find(item => item.product.toString() === productId);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found in cart' });
  }

  if (quantity <= 0) {
    cart.items = cart.items.filter(item => item.product.toString() !== productId);
  } else {
    item.quantity = quantity;
  }

  cart.totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  await cart.save();
  await cart.populate('items.product', 'name price images stock');

  res.status(200).json({ success: true, cart });
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return res.status(404).json({ success: false, message: 'Cart not found' });
  }

  cart.items = cart.items.filter(item => item.product.toString() !== productId);
  cart.totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  await cart.save();
  await cart.populate('items.product', 'name price images stock');

  res.status(200).json({ success: true, cart });
};