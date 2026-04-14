const Product = require('../models/Product');
const Order = require('../models/Order');

// Get products by city
const getProductsByCity = async (req, res) => {
  try {
    const { cityId } = req.params;
    const { category } = req.query;

    let query = { cityId };

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query).populate('cityId', 'name state');

    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

// Get product details
const getProductDetails = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId)
      .populate('cityId', 'name state')
      .populate('reviews.userId', 'name avatar');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product details error:', error);
    res.status(500).json({ message: 'Failed to fetch product details', error: error.message });
  }
};

// Create order (protected)
const createOrder = async (req, res) => {
  try {
    const { items } = req.body; // items: [{productId, quantity}, ...]
    const userId = req.user.userId;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart items are required' });
    }

    // Calculate total price and prepare order items
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Create order
    const order = new Order({
      userId,
      items: orderItems,
      totalAmount,
      status: 'Pending',
    });

    await order.save();

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: order._id,
        totalAmount,
        status: 'Pending',
      },
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

// Get user orders (protected)
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await Order.find({ userId })
      .populate('items.productId', 'name image')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

module.exports = {
  getProductsByCity,
  getProductDetails,
  createOrder,
  getUserOrders,
};
