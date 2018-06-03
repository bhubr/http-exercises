const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.set({
    'Content-Type': 'text/html',
  })
  .status(200)
  .send(`<h1>Hello World</h1>
    <ul>
      <li><a href="/">Home (this page)</a></li>
      <li><a href="/page-not-found">Show me a 404!</a></li>
    </ul>
  `);
});

app.listen(8080);
