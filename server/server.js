const express = require('express');
const server = express();
const router = require('../routes/posts-route');
//middleware
server.use(express.json());

//routes
server.use('/api/posts',router);

module.exports = server;