const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, './.env') });
const connectDB = require('./src/config/database');

const User = require('./src/models/User');
const Hostel = require('./src/models/Hostel');
const Rental = require('./src/models/Rental');
const TourGuide = require('./src/models/TourGuide');
const Product = require('./src/models/Product');

async function reassignProviders() {
  try {
    await connectDB();
    console.log("Reassigning providers...");

    // 1. Ensure Providers Exist
    const providerProfiles = [
      { name: "Danish Sharma", email: "ds7501243@gmail.com", phone: "9876543210", password: "password123", role: "PROVIDER", businessDetails: { businessName: "Danish Hotels", isApproved: true } },
      { name: "Aryan", email: "aryan@gmail.com", phone: "9876543211", password: "seed@123", role: "PROVIDER", businessDetails: { businessName: "Aryan Guides & Rentals", isApproved: true } },
      { name: "Provider", email: "provider@gmail.com", phone: "9876543212", password: "seed@123", role: "PROVIDER", businessDetails: { businessName: "Provider Shop", isApproved: true } }
    ];

    const providerDocs = {};
    for (const p of providerProfiles) {
      let user = await User.findOne({ email: p.email });
      if (!user) {
        user = await User.create(p);
      } else {
        // Update their names and business details just in case
        user.name = p.name;
        user.businessDetails = p.businessDetails;
        await user.save();
      }
      providerDocs[p.name] = user._id;
    }

    const danishId = providerDocs["Danish Sharma"];
    const aryanId = providerDocs["Aryan"];
    const genericProviderId = providerDocs["Provider"];

    // 2. Reassign Hostels to Danish
    await Hostel.updateMany({}, { $set: { providerId: danishId } });
    console.log(`Assigned all Hostels to Danish (${danishId})`);

    // 3. Reassign Guides & Rentals to Aryan
    await Rental.updateMany({}, { $set: { providerId: aryanId } });
    await TourGuide.updateMany({}, { $set: { providerId: aryanId } });
    console.log(`Assigned all Rentals and Guides to Aryan (${aryanId})`);

    // 4. Reassign Products to generic Provider
    await Product.updateMany({}, { $set: { providerId: genericProviderId } });
    console.log(`Assigned all Products to Provider (${genericProviderId})`);

    console.log("Migration Complete!");
    process.exit(0);
  } catch (error) {
    console.error("Migration Error:", error);
    process.exit(1);
  }
}

reassignProviders();
