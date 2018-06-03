const http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Content-Length': '500000'
  });
  res.end('Hello World');
}).listen(8080);