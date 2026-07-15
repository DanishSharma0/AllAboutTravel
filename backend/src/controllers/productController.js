const Product = require('../models/Product');
const Order = require('../models/Order');
const City = require('../models/City');

/**
 * @desc Get all products with advanced filtering
 */
const getAllProducts = async (req, res) => {
  try {
    const { city, category, minPrice, maxPrice, sortBy } = req.query;
    let query = {};

    // City Filter
    if (city) {
      const cityDoc = await City.findOne({ name: { $regex: new RegExp(city, 'i') } });
      if (cityDoc) {
        query.cityId = cityDoc._id;
      } else {
        return res.json([]);
      }
    }

    // Category Filter
    if (category) {
      query.category = { $regex: new RegExp(category, 'i') };
    }

    // Price Filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Initialize Find Query
    let findQuery = Product.find(query).populate('cityId', 'name state');

    // Sorting
    if (sortBy === 'price_asc') {
      findQuery = findQuery.sort({ price: 1 });
    } else if (sortBy === 'price_desc') {
      findQuery = findQuery.sort({ price: -1 });
    } else if (sortBy === 'popular') {
      findQuery = findQuery.sort({ rating: -1 });
    } else {
      findQuery = findQuery.sort({ createdAt: -1 });
    }

    const products = await findQuery;
    res.json(products);
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

const getProductsByCity = async (req, res) => {
  try {
    const { cityId } = req.params;
    const { category } = req.query;
    let query = { cityId };
    if (category) query.category = category;

    const products = await Product.find(query).populate('cityId', 'name state');
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

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

const createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.userId;
    if (!items || items.length === 0) return res.status(400).json({ message: 'Cart items are required' });

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const order = new Order({
      userId,
      items: orderItems,
      totalAmount,
      status: 'Pending',
    });

    await order.save();
    res.status(201).json({
      message: 'Order created successfully',
      order: { id: order._id, totalAmount, status: 'Pending' },
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

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
  getAllProducts,
  getProductsByCity,
  getProductDetails,
  createOrder,
  getUserOrders,
};
