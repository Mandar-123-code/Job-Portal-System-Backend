const mongoose = require("mongoose");

const connectDB = async () => {
  const primary = process.env.MONGO_URI;
  const fallback = "mongodb://localhost:27017/jobportal";

  const tryConnect = async (uri) => {
    try {
      const conn = await mongoose.connect(uri, {
        // use unified topology and new URL parser by default in recent mongoose
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return true;
    } catch (err) {
      console.error(`Failed to connect to ${uri}:`, err.message);
      return false;
    }
  };

  // In development prefer local DB to keep seeded data consistent.
  const forceLocal = process.env.FORCE_LOCAL_DB === 'true' || process.env.NODE_ENV !== 'production';

  if (forceLocal) {
    const okFallback = await tryConnect(fallback);
    if (okFallback) return;
    console.warn('Local MongoDB failed, attempting primary at', primary);
    if (primary) {
      const ok = await tryConnect(primary);
      if (ok) return;
    }
  } else {
    if (primary) {
      const ok = await tryConnect(primary);
      if (ok) return;
      console.warn('Falling back to local MongoDB at', fallback);
    }

    const okFallback = await tryConnect(fallback);
    if (!okFallback) {
      console.error('Both primary and fallback MongoDB connections failed. Exiting.');
      process.exit(1);
    }
  }
};

module.exports = connectDB;