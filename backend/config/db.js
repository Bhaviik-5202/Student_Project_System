const dns = require('dns');
const mongoose = require('mongoose');

// Configure DNS servers if custom servers are provided,
// or if Node's resolver defaults to loopback (common Windows issue) which fails SRV queries.
if (process.env.DNS_SERVERS) {
  try {
    const servers = process.env.DNS_SERVERS.split(',').map((s) => s.trim());
    dns.setServers(servers);
    console.log(`DNS servers configured from environment: ${servers.join(', ')}`);
  } catch (err) {
    console.warn('Failed to set custom DNS servers:', err.message);
  }
} else {
  const currentServers = dns.getServers();
  const isLoopbackOnly = currentServers.every((s) => s === '127.0.0.1' || s === '::1');
  if (isLoopbackOnly) {
    try {
      dns.setServers(['8.8.8.8', '1.1.1.1']);
      console.log('Loopback DNS detected. Fallback to public DNS (8.8.8.8, 1.1.1.1) for SRV resolution.');
    } catch (err) {
      console.warn('Failed to set fallback DNS servers:', err.message);
    }
  }
}


// Configure DNS resolution to bypass local/ISP DNS servers that fail to resolve MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
  if (typeof dns.setDefaultResultOrder === 'function') {
    dns.setDefaultResultOrder('ipv4first');
  }
} catch (dnsError) {
  console.warn('Warning: Failed to set custom DNS options:', dnsError.message);
}

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    if (process.env.NODE_ENV === 'test') {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
    }

    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    const maskedUri = mongoUri.replace(/:([^@]+)@/, ':****@');
    console.log(`Attempting to connect to MongoDB: ${maskedUri}`);

    await mongoose.connect(mongoUri, {
      autoIndex: true,
      serverSelectionTimeoutMS: process.env.NODE_ENV === 'test' ? 30000 : 5000,
      connectTimeoutMS: process.env.NODE_ENV === 'test' ? 30000 : 10000,
    });

    const dbName = mongoose.connection.name;
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`MongoDB Connected Successfully to: ${dbName}`);
    console.log(`Found ${collections.length} collections.`);
    
    // Check document counts for sanity
    const projectCount = await mongoose.connection.db.collection('projects').countDocuments();
    const userCount = await mongoose.connection.db.collection('users').countDocuments();
    console.log(`Data stats: ${projectCount} projects, ${userCount} users found.`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = connectDB;
