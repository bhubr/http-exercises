const express = require('express');
const app = express();

app.get('/', (req, res) => {
  // Prépare un texte de base pour la réponse
  const responseTextBase = `URL:
  * Full URL: ${req.url}
  * Query string parameters:\n`;

  // Affiche req.query dans la console
  console.log(req.query);

  // Object.keys() pour récupérer les clés (ex: ['school', 'city', 'language'])
  const queryStringKeys = Object.keys(req.query);

  // reduce pour ajouter  - clé: valeur  au texte de base, pour chaque paramètre
  const responseText = queryStringKeys.reduce((carry, key) => {
    return carry + `    - ${key}: ${req.query[key]}\n`
  }, responseTextBase);

  // Petite différence, même si on peut utiliser res.writeHead(),
  // Express fournit des méthodes séparées pour:
  //   - positionner les headers: res.set()
  //   - écrire le code de statut: res.status()
  //   - écrire la réponse et l'envoyer: res.send()
  // Remarque qu'ici, on chaîne les 3 appels.
  res.set({
    'Content-Type': 'text/plain',
  })
  .status(200)
  .send(responseText);
});

app.listen(8080);
