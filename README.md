# Exercices sur le protocole HTTP avec Node.js

Le protocole HTTP régit les échanges entre deux protagonistes :
* Un serveur, qui met à disposition des *ressources* : pages web statiques (fichiers HTML) ou dynamiques, API, images, etc.
* Un client, qui accède à ces ressources en émettant des *requêtes*, auxquelles le serveur *répond*.

Les terme de protocole, de client et serveur, peuvent trouver des parallèles dans la vie quotidienne : quand, en tant que *client*
d'un café, on demande une boisson au *serveur*, on se conforme à un certain *protocole* : par exemple, on commence par dire "bonjour",
et on conclut notre *requête* par "s'il vous plaît".

## Prépare tes munitions

![I need ammo](https://raw.githubusercontent.com/bhubr/http-exercises/master/img/i-need-ammo.jpg)

On va s'exercer à faire des requêtes sur un mini-serveur écrit avec Node.js. Tu vas avoir besoin de plusieurs outils :
* Node.js. Si tu ne l'as pas, tu peux l'installer sous Ubuntu / Debian en suivant [ces instructions](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)
* Mozilla Firefox - qui pour ces exercices, présente un avantage par rapport à Chrome, pour visualiser le résultat de certaines requêtes
* curl, outil de requêtes spécifique au protocole HTTP, pour émettre des requêtes depuis le terminal. Installe-le avec `sudo apt-get install curl`
* telnet, outil de requêtes, indépendant de tout protocole, pour voir de plus près les coulisses... Installe-le avec `sudo apt-get install telnet`

Tu vas également devoir cloner le repo [https://github.com/bhubr/http-exercises](https://github.com/bhubr/http-exercises). Ceci fait, place-toi
dans le répertoire `http-exercises`, et exécute `npm install` pour installer les dépendances.

## Utilisation du repo

Tu vas avoir besoin de deux onglets de terminal (rappel: Ctrl-Shift-T pour en ouvrir un nouveau), et dans les deux, te trouver dans `http-exercises`.

Dans un des terminaux, lance `npm run server` pour lancer le mini-serveur Node.js. Laisse-le tourner !

Dans l'autre terminal, tu pourras lancer des requêtes via `curl` et `telnet`, et lancer d'autres commandes : notamment, pour chaque étape numérotée ci-dessous, tu pourras faire `git checkout etapeXX` pour passer d'une étape à l'autre.

Prêt ? C'est parti !

### Requête, réponse, en-têtes

`git checkout etape01`

Voici le code du serveur à cette étape :
```javascript
const http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World');
}).listen(8080);
```

Que fait-il ? D'abord, il importe le module `http`, et crée un serveur avec la méthode `createServer`. On passe à cet appel de méthode une *fonction* comme paramètre.
Cette fonction va être appelée à chaque requête sur le serveur.

Cette fonction reçoit deux paramètres `req` et `res`, qui sont tous les deux des objets.
* `req` contient des informations sur la requête reçue du client.
* `res` permet de préparer la réponse à envoyer au client.

Ici, on a d'abord :
* appelé `res.writeHead()` pour :
    * préparer le *code de statut* : un nombre qui permet d'indiquer au client si le traitement de la requête s'est bien déroulé. Chaque nombre a une traduction en anglais, plus explicite pour un humain. `200` est traduit par `OK` et signifie que tout s'est bien passé.
    * indiquer une en-tête spécifiant le *type de contenu* (`Content-Type`) qu'on envoie au client. Ici, du texte simple (*plain text*). Remarque que l'en-tête est écrite sous forme de clé-valeur dans un objet : on peut avoir plusieurs en-têtes de réponse (*response headers*).
* appelé `res.end()` pour écrire `Hello World` dans le corps de la réponse, et finaliser celle-ci.

Maintenant, teste ça ! Lance `npm run server` dans un terminal si ce n'est déjà fait, et dans un autre, lance :

    telnet localhost 8080

Tu dois être gratifié de cet affichage :

    Trying ::1...
    Connected to localhost.
    Escape character is '^]'.

Juste dessous, tu dois avoir un curseur... Tape `GET /` puis valide **deux fois** avec Entrée. Ton affichage devrait ressembler à ceci :

    GET /

    HTTP/1.1 200 OK
    Content-Type: text/plain
    Date: Sat, 02 Jun 2018 15:28:47 GMT
    Connection: close

    Hello WorldConnection closed by foreign host.

Explications :
* En saisissant `GET /`, tu indiques au serveur que tu veux obtenir la ressource sur sa racine (chemin `/`).
* Valider deux fois est nécessaire, car le serveur comprend que la requête est terminée quand il voit une ligne vide - du moins *pour les requêtes GET*.
* Le serveur répond en envoyant une chaîne de texte assez longue, qu'on peut décomposer en trois parties :
    * `HTTP/1.1 200 OK` indique la version du protocole HTTP (1.1 ici), et le code de statut (`200 OK`).
    * Les trois lignes suivantes sont les en-têtes de réponse (*response headers*), à chaque fois sous forme d'une *clé*, suivie de `:` puis d'une *valeur* :
        * `Content-Type` vaut ce qu'on a indiqué dans le code du serveur
        * `Date` est indiqué par défaut par le serveur créé via `http.createServer()`, et contient la date et heure précises de la requête.
        * `Connection: close` indique que le serveur doit fermer la connection après avoir répondu. C'est aussi une valeur par défaut mise par le serveur.
    * Le *corps* de la réponse proprement dit, constitué uniquement de `Hello World`. Le reste, `Connection closed by foreign host.`, nous est indiqué par telnet lui-même, pour indiquer que c'est le serveur (foreign host = hôte distant) qui a fermé la connection.
