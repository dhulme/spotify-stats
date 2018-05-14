const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:8081'
});

module.exports = api;