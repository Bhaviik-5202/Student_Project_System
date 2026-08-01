const dns = require('dns');
const mongoose = require('mongoose');
const logger = require('../utils/logger');

// Configure DNS servers if custom servers are provided,
// or if Node's resolver defaults to loopback (common Windows issue) which fails SRV queries.
if (process.env.DNS_SERVERS) {
  try {
    const servers = process.env.DNS_SERVERS.split(',').map((s) => s.trim());
    dns.setServers(servers);
    logger.info(
      `DNS servers configured from environment: ${servers.join(', ')}`
    );
  } catch (err) {
    logger.warn('Failed to set custom DNS servers', { error: err.message });
  }
} else {
  const currentServers = dns.getServers();
  const isLoopbackOnly = currentServers.every(
    (s) => s === '127.0.0.1' || s === '::1'
  );
  if (isLoopbackOnly) {
    try {
      dns.setServers(['8.8.8.8', '1.1.1.1']);
      logger.info(
        'Loopback DNS detected. Fallback to public DNS (8.8.8.8, 1.1.1.1) for SRV resolution.'
      );
    } catch (err) {
      logger.warn('Failed to set fallback DNS servers', { error: err.message });
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
  logger.warn('Failed to set custom DNS options', { error: dnsError.message });
}

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    const isPlaceholder =
      !mongoUri ||
      mongoUri.includes('<username>') ||
      mongoUri.includes('replace_with') ||
      mongoUri.includes('127.0.0.1') ||
      mongoUri.includes('localhost') ||
      mongoUri === 'memory';

    if (process.env.NODE_ENV === 'test' || isPlaceholder) {
      try {
        logger.info('Using MongoMemoryServer for database instance...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        mongoUri = mongoServer.getUri();
      } catch (memServerErr) {
        logger.warn(`MongoMemoryServer spawn failed (${memServerErr.message}). Falling back to MONGO_URI...`);
        if (!process.env.MONGO_URI) {
          throw memServerErr;
        }
        mongoUri = process.env.MONGO_URI;
      }
    }

    const maskedUri = mongoUri.replace(/:([^@]+)@/, ':****@');
    logger.info(`Connecting to MongoDB: ${maskedUri}`);

    try {
      await mongoose.connect(mongoUri, {
        autoIndex: true,
        maxPoolSize: 50,
        minPoolSize: 5,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 8000,
        connectTimeoutMS: 8000,
        family: 4,
      });
    } catch (connErr) {
      if (!isPlaceholder) {
        logger.warn(
          `Primary MongoDB connection failed (${connErr.message}). Falling back to MongoMemoryServer...`
        );
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri, {
          autoIndex: true,
          maxPoolSize: 50,
          minPoolSize: 5,
          socketTimeoutMS: 45000,
          family: 4,
        });
      } else {
        throw connErr;
      }
    }

    mongoose.connection.on('disconnected', () => {
      logger.warn(
        'MongoDB connection lost. Mongoose will attempt to reconnect...'
      );
    });

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error', { error: err.message });
    });

    const dbName = mongoose.connection.name;
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();

    // Check document counts for sanity
    const projectCount = await mongoose.connection.db
      .collection('projects')
      .countDocuments();
    const userCount = await mongoose.connection.db
      .collection('users')
      .countDocuments();

    // Log the professional DB status box
    logger.db({
      status: 'connected',
      dbName,
      collections: collections.length,
      users: userCount,
      projects: projectCount,
    });
  } catch (error) {
    logger.error('MongoDB connection failed', { err: error });
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = connectDB;
