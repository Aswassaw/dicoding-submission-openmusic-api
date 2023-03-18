const config = {
  app: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  jwt: {
    accessToken: process.env.ACCESS_TOKEN_KEY,
    refreshToken: process.env.REFRESH_TOKEN_KEY,
    expired: process.env.ACCESS_TOKEN_AGE,
  },
  rabbitMq: {
    server: process.env.RABBITMQ_SERVER,
  },
  s3: {
    bucketName: process.env.AWS_BUCKET_NAME,
  },
  redis: {
    host: process.env.REDIS_SERVER,
  },
};

module.exports = config;
