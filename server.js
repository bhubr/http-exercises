const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();

app.use(morgan('common'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  // Formulaire de login, envoyé par méthode POST vers le path /login
  const loginForm = `<form action="/login" method="POST">
      <h1>Login</h1>
      <p>Hint: use email <strong>jonsnow@got.tv</strong> and pass <strong>YouKnowNothing</strong></p>.
      <input name="email" type="email" placeholder="Your email" />
      <input name="password" type="text" placeholder="Your password" />
      <input type="submit" value="Send" />
    </form>`
  res.send(loginForm);
});

// la route qui traite la requête de login
app.post('/login', (req, res) => {
  // on n'autorise le login que pour un user "fake"
  // ayant pour email jonsnow@got.tv et password YouKnowNothing
  if(req.body.email !== 'jonsnow@got.tv' || req.body.password !== 'YouKnowNothing') {
    return res.status(401).send('Bad credentials');
  }
  res.json({ id: 1, email: 'jonsnow@got.tv' });
});

app.listen(8080);