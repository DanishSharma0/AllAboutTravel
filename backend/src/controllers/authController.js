const User = require('../models/User');
const { generateToken } = require('../utils/tokenUtils');


const register = async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { name, email, password, phone, role, businessDetails } = req.body;


    if (!name || !email || !password || !phone) {
      console.log('Validation failed: missing fields');
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (role === 'PROVIDER' && (!businessDetails || !businessDetails.businessName)) {
      return res.status(400).json({ message: 'Business Name is required for Providers' });
    }


    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'Email already registered' });
    }


    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      role: role || 'CUSTOMER',
      businessDetails: role === 'PROVIDER' ? businessDetails : undefined,
    });


    console.log('Saving user to database...');
    await user.save();
    console.log('User saved successfully:', user._id);

    const token = generateToken(user._id, user.email);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        businessDetails: user.businessDetails,
        paymentDetails: user.paymentDetails

      },
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Registration failed', 
      error: error.message,
      details: error.stack
    });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }


    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }


    const isPasswordValid = await user.matchPassword(password);
    console.log(`Login attempt for ${email}: Password valid? ${isPasswordValid}`);

    if (!isPasswordValid) {
      console.log(`Login failed: Password mismatch for ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.email);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        businessDetails: user.businessDetails,
        paymentDetails: user.paymentDetails

      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};


const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
};


const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and phone are required' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, phone },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user,
    });
    
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};


module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
};
