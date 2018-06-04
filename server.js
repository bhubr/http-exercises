const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();

app.use(morgan('common'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  // Formulaire d'upload, envoyé par méthode POST vers le path /upload,
  // avec encodage des données en multipart/form-data
  const uploadForm = `<form action="/upload" method="POST" enctype="multipart/form-data">
      <h1>Upload files</h1>
      <label for="email">Who are you?</label>
      <input id="email" name="email" type="email" placeholder="Your email" />
      <p style="font-size: 12px">We will send you a confirmation email when your files are uploaded</p>
      <h3>Select files</h3>
      <input name="file1" type="file" /><br>
      <input name="file2" type="file" /><br>
      <input type="submit" value="Send" />
    </form>`
  res.send(uploadForm);
});

// la route qui traite la requête d'upload
app.post('/upload', (req, res) => {
  res.json({ success: true });
});

app.listen(8080);