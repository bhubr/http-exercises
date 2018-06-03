const express = require('express');
const app = express();

app.get('/', (req, res) => {
  // Un formulaire à afficher. On n'indique pas d'attribut method dans la balise <form>,
  // c'est donc GET qui est utilisé par défaut
  let responseText = `<form>
      <h1>Contact</h1>
      <input name="name" type="text" placeholder="Your name" />
      <input name="email" type="email" placeholder="Your email" />
      <input name="message" type="text" placeholder="Your (short) message" />
      <input type="submit" value="Send" />
    </form>`
  // Quand le formulaire a été saisi, on récupère ses données via req.query
  // Si on vient d'ouvrir la page, il n'y a pas de query, donc le tableau
  // queryStringKeys est vide.
  const queryStringKeys = Object.keys(req.query)
  if(queryStringKeys.length > 0) {
    // On réutilise le reduce sur les clés de la query string
    // pour générer des list items:
    const dataItems = queryStringKeys.reduce(
        // deux paramètres: callback, puis valeur initiale de carry: ''
        (carry, key) => carry + `<li>${key}: ${req.query[key]}</li>`, ''
      )

    // On ajoute le résultat au formulaire
    responseText += `<div>
      <h3>Submitted data:</h3>
        <ul>
          ${dataItems}
        </ul>
      </div>
      <p><a href="/">Return to home (with empty form)</a>`;
  }
  res.send(responseText);
});

app.listen(8080);
