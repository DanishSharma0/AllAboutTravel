const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');

const resetProvider = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find the provider user
    const user = await User.findOne({ email: 'provider@demo.com' });
    if (!user) {
      console.log('Provider user not found. Creating one...');
      const newUser = new User({
        name: 'Demo Provider',
        email: 'provider@demo.com',
        password: 'password123',
        phone: '1234567890',
        role: 'PROVIDER',
        businessDetails: {
          businessName: 'Demo Travel Services',
          location: 'Delhi',
          description: 'Demo description for provider dashboard test'
        }
      });
      await newUser.save();
      console.log('Demo provider created successfully');
    } else {
      console.log('Resetting password for provider@demo.com...');
      user.password = 'password123'; // The pre-save hook will hash this
      user.role = 'PROVIDER';
      await user.save();
      console.log('User updated successfully');
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

resetProvider();
