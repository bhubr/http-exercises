const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  // Formulaire d'upload, envoyé par méthode POST vers le path /upload,
  // avec encodage des données en multipart/form-data
  const form = `<form id="signup" action="/signup" method="POST">
      <h1>Sign up (submission with JSON encoding)</h1>
      <label for="email">Name</label>
      <input name="name" type="text" placeholder="Your name" /><br>
      <label for="email">Email</label>
      <input name="email" type="email" placeholder="Your email" /><br>
      <label for="password">Password</label>
      <input name="password" type="password" placeholder="Your password" /><br>
      <label for="favoriteDessert">Favorite dessert</label>
      <select name="favoriteDessert">
        <option value="pecan-pie">Pecan Pie</option>
        <option value="cheese-cake">Cheese cake</option>
        <option value="apple-crumble">Apple crumble</option>
      </select><br>
      <button type="submit">Send</button>
    </form>
    <h4>Data received back from server:</h4>
    <div id="results">N/A</div>
    <script>
    // réagit à l'évènement submit sur le formulaire
    const signupForm = document.getElementById('signup');
    signupForm.addEventListener('submit', evt => {
      // Empêcher la gestion de l'évènement submit d'arriver à son terme
      evt.preventDefault();
      // Récupération des input et select
      const inputsList = evt.target.querySelectorAll('input, select');
      const data = {};
      for (element of inputsList) {
        data[element.name] = element.value;
      }
      const jsonEncodedData = JSON.stringify(data);
      // POST method and request body for fetch
      // Also specify that we're sending JSON to server
      fetch(signupForm.action, {
        method: signupForm.method,
        body: jsonEncodedData,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(r => r.json())
      .then(newUser => {
        // affiche les datas renvoyées par le serveur
        document.getElementById('results').innerHTML = JSON.stringify(newUser);
      });
    });
    </script>`
  res.send(form);
});

let nextId = 1;
const users = [];

// Code pour simuler (grossièrement) une insertion dans une BDD
// On utilise un tableau d'users pour cela, vide au début
// On passe en 1er param un objet userData contenant les données du formulaire
// On simule le côté asynchrone en passant en 2ème param un callback qui a comme signature:
// function(err, user) {}
const createUser = (userData, callback) => {
  // On cherche un user avec le même email, et on renvoie une erreur si on
  // le trouve (appelle le callback avec juste le 1er paramètre, une erreur)
  const foundUser = users.find(u => u.email === userData.email);
  if(foundUser) {
    return callback(new Error('This email is already taken'));
  }
  // Si on est ici c'est qu'aucun user avec le même email n'a été trouvé
  // On simule l'auto incrément de l'id dans une table de BDD
  userData.id = nextId;
  nextId++;
  // On ajoute cet user
  users.push(userData);
  console.log(`Signup ${userData.email}... There are now ${users.length} users`);
  // On le "renvoie": appelle le callback avec en 1er param null (pas d'erreur)
  // et en 2ème param l'utilisateur ajouté
  callback(null, userData);
};

// la route qui traite la requête d'upload
app.post('/signup', (req, res) => {
  // Crée un nouvel utilisateur
  createUser(req.body, (err, newUser) => {
    if(err) {
      return res.status(400).json({
        error: err.message
      });
    }
    // delete permet de supprimer une propriété d'un objet.
    // Ce n'est PAS une bonne pratique de renvoyer le password
    // au retour de la requête, donc on le supprime.
    delete newUser.password;

    res.json(newUser);
  });
});

app.listen(8080);