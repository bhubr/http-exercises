const http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(`<?xml version="1.0" encoding="UTF-8"?>
<note>
  <to>Student</to>
  <from>Trainer</from>
  <heading>Reminder</heading>
  <body>Be a good student and indent your code!!</body>
</note>
  `);
}).listen(8080);