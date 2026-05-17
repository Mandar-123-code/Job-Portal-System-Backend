const connectDB = require('../config/db');
const mongoose = require('mongoose');
const User = require('../models/User');

(async () => {
  try {
    await connectDB();

    // match any name containing the marker word (case-insensitive)
    const users = await User.find({ name: { $regex: 'Demo', $options: 'i' } });
    if (!users.length) {
      console.log('No users with the target prefix found.');
      process.exit(0);
    }

    for (const u of users) {
      const newName = u.name.replace(/Demo\s*/i, '');
      console.log(`Updating ${u.email}: '${u.name}' -> '${newName}'`);
      u.name = newName;
      await u.save();
    }

    console.log('Migration complete.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed', err);
    process.exit(1);
  }
})();
