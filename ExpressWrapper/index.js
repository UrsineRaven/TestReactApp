const express = require('express');
const api = require('./route/api');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));
app.set('trust proxy', true);
app.use(express.json());

// Log each request
app.use(function logger(req, res, next) {
  console.log(`${new Date().toLocaleString()} | ${req.ip} => ${req.url}\n`);
  next();
});

app.use('/api', api);
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(3031);
