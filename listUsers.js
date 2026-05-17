const connectDB = require('./config/db');
const User = require('./models/User');

(async () => {
  try {
    await connectDB();
    const users = await User.find({}, 'name email role');
    console.log('Users:');
    users.forEach(u => console.log(u));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
