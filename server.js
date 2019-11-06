const express = require('express');
const serve = require('express-static');

const app = express();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '\\dist\\index.html');
});

app.use(serve(__dirname + '\\dist'));


console.log('static content at %s', __dirname + '\\dist')

const server = app.listen(3000, function () {
  console.log('server is running at %s', server.address().port);
});