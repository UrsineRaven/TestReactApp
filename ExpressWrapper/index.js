const express = require('express');
const api = require('./route/api');
const fs = require('fs');
const path = require('path');
const config = require('./siteConfig.json');
const app = express();

const BasePath = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf-8')
                   .match(/REACT_APP_BASE_PATH=[^\r\n]+/)[0]
                   .split('=')[1]
                   .replace(/\/+$/,'');

app.use(express.static(path.join(__dirname, '..', 'build')));
app.set('trust proxy', true);
app.use(express.json());

// Log each request
app.use(function logger(req, res, next) {
  console.log(`${new Date().toLocaleString()} | ${req.ip} => ${req.url}`);
  if (!(Object.entries(req.body).length === 0 && req.body.constructor === Object)) console.dir(req.body)
  next();
});

app.use(`${BasePath}/api`, api);
app.get('/*', function(req, res) {
  const file = path.join(__dirname, '..', req.url.replace(BasePath, '/build'));
  fs.stat(file, (err, stats) => {
    if (!err && stats.isFile())
      res.sendFile(file);
    else
      res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
  });
});

app.listen(config.Site.Port);
