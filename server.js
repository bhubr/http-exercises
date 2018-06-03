const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
  // Lit d'abord le fichier public/05/document.txt
  // Le 1er paramètre est le nom du fichier
  // Le 2nd paramètre est un "callback": fonction qui est appelée
  //   quand l'opération de lecture est terminée, avec deux issues possibles:
  //   - erreur : dans ce cas, err contient un objet Error et buffer est vide
  //   - succès : err est vide (null) et buffer contient les données
  fs.readFile('img/i-need-ammo.jpg', (err, buffer) => {
    // On a mis tout le code de préparation et d'envoi de la réponse DANS le callback :
    // en d'autres termes, on a attendu de récupérer le résultat de la lecture
    // du fichier, avant d'envoyer la réponse.

    // S'il y a une erreur il faut la traiter. Il y a de fortes chances que ce soit un
    // mauvais chemin de fichier, donc l'erreur à renvoyer devrait être "404 Not Found"
    if(err) {
      res.writeHead(404, {
        'Content-Type': 'image/jpeg'
      });
      // On utilise return pour sortir et être sûr qu'on exécutera pas le code après le if
      return res.end(`File not found`);
    }

    // Pas d'erreur : on envoie le fichier
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Content-Disposition': 'attachment; filename="i-need-some-fucking-ammo.jpg"'
    });
    // Le 2ème paramètre, buffer, ne contient pas une String, mais des octets.
    // Tout simplement parce que le fichier pourrait contenir autre chose que du texte (image, etc.)
    // Un article sur le sujet sur freeCodeCamp: http://bit.do/BuffersInNodeJS
    // Si on veut afficher le texte dans la console, il faut convertir le buffer en String:
    console.log(buffer.toString());
    // Ecriture du corps de la réponse (ici on peut mettre le buffer directement) et finalisation
    res.end(buffer);
  });
}).listen(8080);