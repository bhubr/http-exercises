const http = require('http');
const url = require('url');

http.createServer(function (req, res) {
  // Analyse l'URL. Le 2ème paramètre indique à la méthode
  // d'analyser/parser aussi la query string
  const parsedUrl = url.parse(req.url, true);

  // Affiche le résultat dans la console (check ton terminal !)
  // Les paramètres de la query string ont été "éclatés" en clés-valeurs et
  // sont stockés dans la propriété query de l'objet retourné par url.parse()
  console.log(parsedUrl);

  // Prépare un texte de base pour la réponse, auquel on va ajouter le contenu
  // de la query string
  const responseTextBase = `URL:
  * Full URL: ${req.url}
  * Query string parameters:\n`;

  // Object.keys permet de récupérer les clés d'un objet dans un tableau
  // Ici on récupère toutes les clés des paramètres de la query string
  const queryStringKeys = Object.keys(parsedUrl.query);

  // Oh, un reduce ! avec une string comme valeur de départ !
  const responseText = queryStringKeys.reduce((carry, key) => {
    // On ajoute une ligne à l'accumulateur, contenant une clé de la query string
    // puis la valeur associée, qu'on va chercher dans parsedUrl.query
    return carry + `    - ${key}: ${parsedUrl.query[key]}\n`
  }, responseTextBase);

  res.writeHead(200, {
    'Content-Type': 'text/plain',
  });
  res.end(responseText);
}).listen(8080);
