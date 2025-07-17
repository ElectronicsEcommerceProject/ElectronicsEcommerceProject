import { createClient } from 'redis';

async function createRedisClient() {
  let localAttempts = 0;
  const maxLocalAttempts = parseInt(process.env.REDIS_MAX_LOCAL_ATTEMPTS || '3');
  let redisClient;

  // Try to connect to local Redis first
  while (localAttempts < maxLocalAttempts) {
    try {
      redisClient = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      });

      redisClient.on('error', (err) => {
        console.error(`Local Redis connection error (attempt ${localAttempts + 1}/${maxLocalAttempts}):`, err);
      });

      await redisClient.connect();
      console.log('Successfully connected to local Redis');
      return redisClient;
    } catch (error) {
      console.error(`Failed to connect to local Redis (attempt ${localAttempts + 1}/${maxLocalAttempts}):`, error.message);
      localAttempts++;

      if (localAttempts < maxLocalAttempts) {
        console.log('Retrying local Redis connection...');
      }
    }
  }

  // If local connection failed twice, connect to Redis Cloud
  console.log('Local Redis connection failed after multiple attempts. Connecting to Redis Cloud...');
  try {
    redisClient = createClient({
      username: process.env.REDIS_CLOUD_USERNAME || 'default',
      password: process.env.REDIS_CLOUD_PASSWORD || '7ZOdNsvngBCKA7NhmeqhkvLb8RDOqMfr',
      socket: {
        host: process.env.REDIS_CLOUD_HOST || 'redis-17490.crce206.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: parseInt(process.env.REDIS_CLOUD_PORT || '17490')
      }
    });

    redisClient.on('error', (err) => {
      console.error('Redis Cloud connection error:', err);
    });

    await redisClient.connect();
    console.log('Successfully connected to Redis Cloud');
    return redisClient;
  } catch (error) {
    console.error('Failed to connect to Redis Cloud:', error.message);
    throw new Error('All Redis connection attempts failed');
  }
}

const redisClient = await createRedisClient();

export default redisClient;