const http = require('http');

http.createServer(function (req, res) {
  // Une variable où on va stocker un "timer" qui fait exécuter
  // writeResponseLine à intervalles réguliers
  let writeInterval;

  // Une variable où on stocke un numéro qu'on va intégrer dans chaque
  // ligne de la réponse, et incrémenter à chaque fois
  let lineIndex = 0;

  // Une fonction qui écrit 20 octets dans la réponse.
  const writeResponseLine = () => {
    // Crée une chaîne contenant l'index avec des caractères supplémentaires
    // pour compléter jusqu'à 4. Ex: 5 devient '0005', 99 devient '0099'
    const paddedLineIndex = lineIndex.toString().padStart(4, '0');
    res.write(`Line number is ${paddedLineIndex}\n`);
    lineIndex++;

    // On s'arrête après avoir écrit 100 lignes soit 100*20 = 2000 caractères
    if(lineIndex === 100) {
      // Annule le timer démarré avec setInterval
      clearInterval(writeInterval);
      // Termine la requête
      res.end('');
    }
  }

  // Ecrit le code de statut et les en-têtes
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Content-Length': '2000'
  });
  // Démarre un timer pour écrire une ligne toutes les 50 millisecondes
  // On stocke la valeur retournée par setInterval pour pouvoir annuler
  // le timer au bout d'un certain nombre d'écritures
  writeInterval = setInterval(writeResponseLine, 50)

}).listen(8080);