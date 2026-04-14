const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * @desc    Create a new Razorpay order
 * @route   POST /api/payment/create-order
 * @access  Private
 */
const createOrder = async (req, res) => {
  try {
    const { amount, receipt } = req.body;
    const userId = req.user.userId;

    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise for INR)
      currency: 'INR',
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).json({ message: 'Failed to create Razorpay order' });
    }

    // Save initial payment record
    await Payment.create({
      userId,
      orderId: order.id,
      amount: amount,
      currency: 'INR',
      receipt: order.receipt,
      status: 'Created',
    });

    res.status(200).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create order', 
      error: error.message 
    });
  }
};

/**
 * @desc    Verify Razorpay payment signature
 * @route   POST /api/payment/verify
 * @access  Private
 */
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment details' });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (isSignatureValid) {
      // Update payment record in database
      await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        {
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
          status: 'Success',
        },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
      });
    } else {
      // Mark as failed
      await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { status: 'Failed' }
      );

      res.status(400).json({
        success: false,
        message: 'Invalid signature, payment verification failed',
      });
    }
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Verification failed', 
      error: error.message 
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};
