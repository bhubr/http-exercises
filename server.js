const http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(`{"date":{"year":2018,"month":"June","day":"3rd"},"mood":"WTF is this HTTP thing anyway?"}`);
}).listen(8080);