const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

(async () => {
  try {
    await connectDB();

    const users = [
      {
        name: 'Candidate',
        email: 'candidate@example.com',
        password: 'password123',
        role: 'candidate',
      },
      {
        name: 'Recruiter',
        email: 'recruiter@example.com',
        password: 'password123',
        role: 'recruiter',
      },
    ];

    for (const u of users) {
      const existing = await User.findOne({ email: u.email });
      if (existing) {
        console.log(`User exists: ${u.email}`);
        continue;
      }

      const hashed = await bcrypt.hash(u.password, 10);

      const newUser = new User({
        name: u.name,
        email: u.email,
        password: hashed,
        role: u.role,
      });

      await newUser.save();
      console.log(`Created user: ${u.email}`);
    }

    console.log('Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed', err);
    process.exit(1);
  }
})();
