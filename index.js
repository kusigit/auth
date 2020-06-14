'use strict';

// https://github.com/benlaplanche/cf-basic-auth-route-service/tree/master/servicebroker

const cookie = require('cookie');
const redis = require('redis-client');

module.exports = async (req, res, next) => {
  const cookies = cookie.parse(req.headers.cookie || 'sid=');

  const mandant = await redis.getAsync(cookies.sid);
  if (mandant) {
    // eslint-disable-next-line require-atomic-updates
    req.mandant = mandant;
    next();
  } else {
    res.status(401).send('unauthorized');
  }
};
