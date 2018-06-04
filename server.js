const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan('common'));

app.get('/', (req, res) => {
  // Un formulaire à afficher. On n'indique pas d'attribut method dans la balise <form>,
  // c'est donc GET qui est utilisé par défaut.
  // Par contre, cette fois on a spécifié l'URL vers laquelle envoyer
  // le formulaire, via l'attribut action
  const loginForm = `<form action="/login">
      <h1>Login</h1>
      <p>Hint: use email <strong>jonsnow@got.tv</strong> and pass <strong>YouKnowNothing</strong></p>.
      <input name="email" type="email" placeholder="Your email" />
      <input name="password" type="text" placeholder="Your password" />
      <input type="submit" value="Send" />
    </form>`
  res.send(loginForm);
});

// la route qui traite la requête de login
app.get('/login', (req, res) => {
  // on n'autorise le login que pour un user "fake"
  // ayant pour email jonsnow@got.tv et password YouKnowNothing
  if(req.query.email !== 'jonsnow@got.tv' || req.query.password !== 'YouKnowNothing') {
    return res.status(401).send('Bad credentials');
  }
  res.json({ id: 1, email: 'jonsnow@got.tv' });
});

app.listen(8080);