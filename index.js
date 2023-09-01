'use strict';

const cookie = require('cookie');
const Redis = require('ioredis');

// https://github.com/cloud-gov/aws-redis-example/blob/main/node/README.md
const options = {
  host: process.env.REDIS_SERVICE_HOST || 'localhost',
  tls: process.env.REDIS_SERVICE_HOST ? {} : null,
};

const redis = new Redis(options);

module.exports = async (req, res, next) => {
  const cookies = cookie.parse(req.headers.cookie || 'sid=');
  const mandant = await redis.get(cookies.sid);

  if (mandant) {
    // eslint-disable-next-line require-atomic-updates
    req.mandant = mandant;
    next();
  } else {
    res.status(401).send('unauthorized');
  }
};
