const http = require('http');

http.createServer(function (req, res) {
  const urlSegments = req.url.split('?');
  const responseText = `URL:
  * Full URL: ${req.url}
  * Before query string separator (?): ${urlSegments[0]}
  * Query string: ${ urlSegments.length > 1 ? urlSegments[1] : 'N/A' }
  `
  res.writeHead(200, {
    'Content-Type': 'text/plain',
  });
  res.end(responseText);
}).listen(8080);
