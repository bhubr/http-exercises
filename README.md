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
* nodemon - un package pour Node.js, permettant de "surveiller" le fichier répertoire contenant le code source du serveur, pour le redémarrer
à chaque changement : `sudo npm install -g nodemon`
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

### Etape 1 : texte simple

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

Maintenant, teste ça ! Lance `npm run server` ou `nodemon` dans un terminal si ce n'est déjà fait, et dans un autre, lance :

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
    * Le *corps* de la réponse proprement dit, constitué uniquement de `Hello World`. Le reste, `Connection closed by foreign host.`, nous est indiqué par telnet lui-même, pour indiquer que c'est le serveur (foreign host = hôte distant) qui a fermé la connection. Comme  `Hello World` ne contient aucun retour à la ligne, cette chaîne vient se coller juste derrière à l'affichage.
    * **Remarque importante** : note la ligne vide entre les en-têtes de réponse et le corps : elle est importante, car elle permet au client de délimiter la fin de la partie "en-têtes" de la réponse, et le début de la partie "corps".

**Maintenant**, va sur [http://localhost:8080](http://localhost:8080) avec Firefox ou Chrome, et ouvre les outils de développement (F12, ou Ctrl+Shift+I sur PC, Cmd+Option+I sur Mac). Dans l'un comme dans l'autre, tu as un onglet "Network" ou "Réseau", qui affiche une liste des requêtes envoyées pour la page en cours.
Clique sur la ligne correspondant à la 1ère requête (voir captures).

Avec Chrome, tu peux voir les en-têtes de réponse "brutes" comme dans Telnet, en cliquant "view source" à côté de "Response Headers".

![Google Chrome](https://raw.githubusercontent.com/bhubr/http-exercises/master/img/google-chrome.png)

Avec Firefox, on peut faire la même chose en cliquant "Raw headers" sur la ligne où se trouve le "Status code".

![Mozilla Firefox](https://raw.githubusercontent.com/bhubr/http-exercises/master/img/mozilla-firefox.png)

**Conclusion** de cette étape : le serveur envoie autre chose que simplement "Hello World". Le code de statut et les en-têtes donnent des informations supplémentaires au client.
Mais pour quoi faire ? Cela va devenir plus clair avec l'exemple suivant...

### Etape 2 : contenu HTML

Cette étape est subdivisée en deux "sous-étapes".

`git checkout etape02a-content-type-html`

Voici le code du serveur à cette étape :

```javascript
const http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('<h1>Hello World</h1>');
}).listen(8080);
```

Par rapport à l'étape précédente, deux choses ont changé :
* on a spécifié `text/html` comme valeur de l'en-tête `Content-Type`.
* on a entouré le `Hello World` de balises `<h1>...</h1>`.

Tu n'as pas besoin de redémarrer le serveur, il se redémarre tout seul grâce à nodemon !

Rafraîchis la page sur ton navigateur. Tu dois voir s'afficher un radieux "Hello World" en gros titre :

![Hello World html](https://raw.githubusercontent.com/bhubr/http-exercises/master/img/hello-world-html.png)

Maintenant : `git checkout etape02b-content-type-text`, où le code du serveur est :

```javascript
const http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('<h1>Hello World</h1>');
}).listen(8080);
```

Rafraîchis encore la page, et... Surprise ! Le texte n'est plus "formaté" comme du HTML, mais affiché "brut", tel qu'envoyé par le serveur.

![Hello World plain text](https://raw.githubusercontent.com/bhubr/http-exercises/master/img/hello-world-plain-text.png)

C'est le changement du header `Content-Type` qui a causé cela. Les headers de réponse donnent des informations au client, sur comment interpréter le corps de la réponse.
Le `Content-Type` en particulier indique quel type de contenu le serveur envoie au client. Ici, on a bien envoyé une chaîne contenant du HTML, mais on a explicitement dit au client que cette chaîne est du texte simple (*plain text*).

Ce qu'on met dans le `Content-Type` est appelé un [type MIME](https://developer.mozilla.org/fr/docs/Web/HTTP/Basics_of_HTTP/MIME_types), chaque type de document ayant le sien.

### Etape 3 : contenu XML

Cette étape est à nouveau subdivisée en deux "sous-étapes". **Rien de très nouveau**, mais on va revoir la même chose avec du contenu XML.

`git checkout etape03a-content-type-xml`

Voici le code du serveur à cette étape :

```javascript
const http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(`<?xml version="1.0" encoding="UTF-8"?>
<note>
  <to>Student</to>
  <from>Trainer</from>
  <heading>Reminder</heading>
  <body>Be a good student and indent your code!!</body>
</note>
  `);
}).listen(8080);
```

On a cette fois spécifié `text/xml` comme valeur de l'en-tête `Content-Type`, et mis du code XML dans le corps de la réponse. XML est un langage à balises, dans la même famille que HTML, mais plus extensible.

![XML document](https://raw.githubusercontent.com/bhubr/http-exercises/master/img/xml-document-content-type-xml.png)

Les navigateurs comprennent le XML, et l'affichent sous forme d'un "arbre". Si un "noeud" de l'arborescence (ici `note`) contient d'autres noeuds, on peut le "replier" ou le déplier.

Maintenant : `git checkout etape03b-content-type-text`, où à nouveau, on n'a changé que le header:

```javascript
const http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(`<?xml version="1.0" encoding="UTF-8"?>
<note>
  <to>Student</to>
  <from>Trainer</from>
  <heading>Reminder</heading>
  <body>Be a good student and indent your code!!</body>
</note>
  `);
}).listen(8080);
```

Rafraîchis encore la page... Le XML n'est plus interprété en tant que tel, et donc le code est affiché tel quel, sans formatage.

![XML document as plain text](https://raw.githubusercontent.com/bhubr/http-exercises/master/img/xml-document-content-type-text.png)

### Etape 4 : contenu JSON

Cette étape est à nouveau subdivisée en deux "sous-étapes". **Promis**, c'est la dernière du genre, cette fois avec du contenu JSON.

`git checkout etape04a-content-type-json`

Voici le code du serveur à cette étape :

```javascript
const http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(`{"date":{"year":2018,"month":"June","day":"3rd"},"mood":"WTF is this HTTP thing anyway?"}`);
}).listen(8080);
```

On a cette fois spécifié `application/json` comme valeur de l'en-tête `Content-Type`, avec du JSON comme corps de la réponse.

Cette fois, **utilise spécifiquement Firefox** pour voir la page : il a en effet a la bonté d'interpréter le JSON, comme on le ferait en JavaScript avec `JSON.parse()`.

La même chose en changeant le `Content-Type` (`git checkout etape04b-content-type-text`)

```javascript
const http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(`{"date":{"year":2018,"month":"June","day":"3rd"},"mood":"WTF is this HTTP thing anyway?"}`);
}).listen(8080);
```

À nouveau, le JSON est affiché tel quel, sans être formaté.

### Etape 5 : téléchargement de fichier

À nouveau, deux sous-étapes pour illustrer le propos. La première :

`git checkout etape05a-content-disposition-text`.

**Attention, ça va se corser !** Mais ne te mets pas en PLS pour autant :).

On va voir ici plusieurs choses :
* la lecture d'un fichier avec le module `fs` de Node.js
* un autre header, `Content-Disposition`.

Voici le code serveur *sans les commentaires*, mais je t'invite à consulter ceux-si dans `server.js`.

```javascript
const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
  fs.readFile('public/05/document.txt', (err, buffer) => {
    if(err) {
      res.writeHead(404, {
        'Content-Type': 'text/plain'
      });
      return res.end(`File not found`);
    }

    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Content-Disposition': 'attachment; filename="my-document.txt"'
    });
    console.log(buffer.toString());
    res.end(buffer);
  });
}).listen(8080);
```

Je te retrace quand même les grandes étapes de ce qui se passe dans le callback `(req, res) => { ... }` qui
traite la requête :
1. Lecture du fichier en utilisant [fs.readFile](https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback)
2. Exécution du callback `(err, buffer) => { ... }` à la fin de celle-ci

    * en cas d'erreur (`if(err) { ... }`), envoi d'une réponse avec le code `404 Not Found` et un message d'erreur.
    * en cas de succès, envoi d'une réponse avec :

        * le code `200 OK`,
        * le header `Content-Type` pour indiquer du contenu texte,
        * le header `Content-Disposition` pour indiquer que c'est un fichier téléchargeable (`attachment`) avec un certain nom (`my-document.txt`).
Note qu'on peut très bien indiquer ici un nom différent de celui du fichier qu'on a lu !!
        * le corps de la réponse. `fs.readFile` peut lire *tout* type de fichier : "texte" ou "binaire". Cette dernière catégorie inclut les fichiers images, audio, vidéo, exécutables, etc., dont les données ne sont *pas convertibles en String*. Le callback de `fs.readFile` récupère donc un [Buffer](http://bit.do/BuffersInNodeJS),
grosso modo un tableau d'octets (je t'ai mis le lien vers un article, mais tu peux t'en passer pour l'instant). Si on sait que ce sont des données de type texte (HTML, JSON, code source, etc.), et qu'on veut les afficher dans la console, il faut alors les convertir en String via `toString()` : `console.log(buffer.toString())`.

Avec Firefox ou Chrome, rafraîchis la page... Tu devrais voir s'ouvrir la boîte de dialogue pour choisir que faire du fichier à télécharger (à moins que ton browser ne soit paramétré avec un emplacement prédéfini comme `~/Downloads` ou `~/Téléchargements`).

Essaie à nouveau une requête avec `telnet localhost 8080` puis `GET /`. Evidemment avec Telnet, on ne te propose pas de télécharger le fichier pour le sauvegarder quelque part. **La capacité à interpréter un header et à modifier son comportement en fonction**, est dépendante du client HTTP qu'on utilise.

Telnet ne fait qu'afficher la réponse du serveur, "brute de décoffrage", et n'interprète aucunement les headers.

**Maintenant, la même chose avec une image** : `git checkout etape05b-content-disposition-image`

Dans le code serveur (que je t'épargne ici), on a juste :
* changé le nom du fichier à lire (`img/i-need-ammo.jpg`)
* changé le header `Content-Type` en `image/jpeg` ([type MIME](https://developer.mozilla.org/fr/docs/Web/HTTP/Basics_of_HTTP/MIME_types) d'une image JPEG).
* changé le nom de fichier dans le header `Content-Disposition` en `i-need-some-fucking-ammo.jpg` (une fois encore, en illstrant le fait que rien ne nous contraint à
indiquer la même chose que le nom du fichier d'origine).

Tiens, pour rigoler un peu, fais encore une requête avec Telnet... Cela devrait te montrer, d'une manière très visuelle, qu'il y a des données convertibles en chaînes de caractères, et d'autres... pas !

### Etape 6 : header `Content-Length`

`git checkout etape06a-content-length`

On va revenir à un code serveur plus simple, presque identique à celui de l'étape 1, à ceci près qu'on a ajouté le header `Content-Length`. Celui-ci indique la *longueur* en octets du corps de la réponse. En principe, le client peut s'en passer : si le serveur renvoie la réponse entière, d'un seul coup, et ferme la connexion, le client utilise comme *corps* tout ce qu'il a reçu après la ligne vide qui clôt les en-têtes de réponse.

```javascript
const http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Content-Length': '500000'
  });
  res.end('Hello World');
}).listen(8080);
```

Regarde ce qui se passe avec telnet... Visiblement, à part l'ajout du header `Content-Length` aux en-têtes de réponse, rien à signaler !

Essaie maintenant avec Firefox **et** Chrome, car ils n'ont pas le même comportement !

Firefox "mouline" dans le vide pendant un moment, mais finit par afficher "Hello World". En gros, le serveur lui a dit "je t'envoie 500.000 octets", mais lui en a envoyé guère plus de 10. Firefox attend, puis au bout d'un certain temps prédéfini - un "timeout" - il fait avec ce qu'il a reçu, et l'affiche.

Chrome aussi "mouline" pendant un moment, puis nous informe d'un échec, d'une façon cinglante et cruellement barbare, nous faisant questionner jusqu'au sens de la vie :

![Chrome Content-Length mismatch](https://raw.githubusercontent.com/bhubr/http-exercises/master/img/chrome-content-length-mismatch.png)

Eh oui, on ne badine pas impunément avec le `Content-Length`, en tout cas pas avec Chrome. Le code d'erreur `ERR_CONTENT_LENGTH_MISMATCH` qu'il affiche n'est pas un code d'erreur HTTP, mais un code interne à Chrome. Chrome a constaté un décalage (*mismatch*) entre la longueur du corps attendue, spécifiée par le serveur dans `Content-Length`, et la longueur du corps qu'il a effectivment reçu. Fatal.

Là encore, on constate que chaque client a un comportement différent vis-à-vis des headers :
* telnet n'interprète pas plus `Content-Length` que les autres headers
* Firefox en tient compte mais ne génère pas d'erreur fatale en cas de décalage
* Chrome te fait gentiment comprendre que t'es gentil, mais que si tu veux mettre un `Content-Length`, il faut lui mettre la bonne valeur.

Maintenant, un exemple qui montre que la réponse peut arriver par petits bouts, et dans lequel il est utile d'indiquer la `Content-Length`.

`git checkout etape06b-content-length`

Voici le code serveur, dépouillé de ses commentaires. Si tu tiens à décortiquer le fonctionnement de ce programme, jette un coup d'oeil à `server.js`.

```javascript
const http = require('http');

http.createServer(function (req, res) {
  let writeInterval;
  let lineIndex = 0;

  const writeResponseLine = () => {
    const paddedLineIndex = lineIndex.toString().padStart(4, '0');
    res.write(`Line number is ${paddedLineIndex}\n`);
    lineIndex++;
    if(lineIndex === 100) {
      clearInterval(writeInterval);
      res.end('');
    }
  }

  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Content-Length': '2000'
  });
  writeInterval = setInterval(writeResponseLine, 50)
}).listen(8080);
```

En gros, ce que ça fait : après avoir écrit l'en-tête de réponse, on n'écrit pas la réponse d'un coup.

Au lieu de cela, on démarre l'exécution périodique d'une fonction via `setInterval` :toutes les 50 millisecondes, on exécute `writeResponseLine` qui écrit exactement 20 octets dans le corps de la réponse.

Après l'écriture de 100 lignes de 20 caractères, on stoppe l'exécution périodique de `writeResponseLine` en appelant `clearInterval`. On termine la réponse en utilisant `res.end('')`.

Je t'invite à vérifier ce qui se passe dans telnet et l'un des navigateurs : on reçoit le contenu petit à petit. Comme la longueur du contenu reçu est égale à celle annoncée dans `Content-Length`, le chargement de la page s'arrête dès que le serveur termine l'écriture de sa réponse. C'est beau.

### Etape 7 : la "query string"

Je te vois prendre un air interrogatif, jeune padawan : "Boudu, quesséqu'c'tebêtelà ?". Mais en fait, tu *connais* la query string, tu l'as déjà vue à l'oeuvre, maintes et maintes fois !

Regarde cette URL :
[https://www.youtube.com/watch?v=dqUdI4AIDF0&list=PL314E1EA470B1A85C](https://www.youtube.com/watch?v=dqUdI4AIDF0&list=PL314E1EA470B1A85C).

Elle peut être décomposée en plusieurs parties :

* Le protocole `http` ou `https` suivi de `://`
* Le nom d'hôte `www.youtube.com`
* Le chemin relatif à la racine de l'hôte `/watch`
* Un point d'interrogation `?`, qui sépare tout ce qu'il y a avant, de la query string
* La query string `v=dqUdI4AIDF0&list=PL314E1EA470B1A85C`.

Le terme "query string" pourrait être traduit par "chaîne de requête", "paramètres de requête", ou encore "paramètres d'URL" ou "paramètres GET".

La query string de l'exemple contient deux paramètres, séparés par `&` (appelé *ampersand* en anglais, esperluette en français). Chaque paramètre est composé d'une clé et d'une valeur, séparés par un `=` :
* Le paramètre `v` contient la valeur `dqUdI4AIDF0`, qui pour YouTube est l'identifiant de la vidéo à visionner.
* Le paramètre `list` contient la valeur `PL314E1EA470B1A85C`, qui identifie une playlist dans laquelle cette vidéo a été intégrée.

Dans l'exemple de YouTube, on pourrait enlever `&list=PL314E1EA470B1A85C` de l'URL, et on visionnerait alors la vidéo en dehors d'une playlist.

Il n'y a *pas de convention particulière* sur les noms des clés, ni sur les valeurs : c'est l'équipe de développement de l'application serveur qui décide de quels paramètres utiliser ou non.

Avec Node.js, dans le callback de traitement d'une requête, on accède à l'URL demandée via `req.url`, qui contient l'URL entière.
Si on n'utilise pas un framework comme Express, on peut extraire la query string de l'URL comme le montre l'exemple suivant.

`git checkout etape07a-querystring-vanilla-manual`

Si tu t'interroges sur le sens de "vanilla", c'est un terme utilisé pour décrire quelque chose de "basique" ou sans fioritures. Ici le nom de ce tag Git indique que le serveur est écrit en Node.js "vanilla", sans l'aide d'une librairie ou framework comme Express.

On utilise le même terme pour les applications front-end : on parle de "vanilla JavaScript" pour une appli qui utilise uniquement l'api DOM native des navigateurs (telle que le projet 2 à la Wild), par opposition aux applis qui utilisent des librairies et frameworks tels que React, Angular, etc.

J'y ai adjoint le terme "manual" pour signifier qu'on analyse "manuellement" l'URL pour en extraire la query string.

```javascript
const http = require('http');

http.createServer(function (req, res) {
  const urlSegments = req.url.split('?');
  const responseText = `URL:
  * Full URL: ${req.url}
  * Before query string separator (?): ${urlSegments[0]}
  * Query string: ${ urlSegments.length > 1 ? urlSegments[1] : 'N/A' }
  `
  res.writeHead(200, {
    'Content-Type': 'text/plain',
  });
  res.end(responseText);
}).listen(8080);
```

Tu peux essayer d'interroger le serveur depuis ton navigateur, en utilisant les URLs suivantes :
* [http://localhost:8080](http://localhost:8080)
* [http://localhost:8080?firstName=Joe&lastName=Dalton](http://localhost:8080?firstName=Joe&lastName=Dalton)
* [http://localhost:8080?school=Wild&city=Toulouse&language=JavaScript](http://localhost:8080?school=Wild&city=Toulouse&language=JavaScript)

Essaie la même chose avec telnet :
* `GET /`
* `GET /?firstName=Joe&lastName=Dalton`
* `GET /?school=Wild&city=Toulouse&language=JavaScript`

Bon, c'est pas mal, mais ça reste basique : on a juste séparé la query string du reste de l'URL. Maintenant, ce serait plus pratique de pouvoir
récupérer chaque paramètre individuellement, non ?

Sous-étape suivante : `git checkout etape07b-querystring-vanilla-urlparse`

On reste dans du Node.js "vanilla". Tu vas être ravi d'apprendre que tu n'as pas besoin d'écrire tout le code pour extraire la query string de l'URL, ni pour extraire *chaque* paramètre de l'URL. Le fort bien nommé module `url` de Node.js, livré en standard, fournit une méthode `parse()` qui permet de *parser* (c'est du franglais comme on aime) une URL, c'est à dire de l'analyser pour en faire quelque chose d'exploitable.

Elle prend au moins un paramètre : l'URL. Elle prend éventuellement un 2ème voire un 3ème paramètres (référence [ici](https://nodejs.org/docs/latest/api/url.html#url_url_parse_urlstring_parsequerystring_slashesdenotehost)). Le 2ème paramètre indique s'il faut parser la query string, et est `false` par défaut : on doit donc explicitement passer `true`.

`url.parse()` renvoie un objet qui ressemble à ceci, si l'URL qu'on lui passe est la dernière des 3 URL d'exemples ci-dessus :

    {
      protocol: null,
      slashes: null,
      auth: null,
      host: null,
      port: null,
      hostname: null,
      hash: null,
      search: '?school=Wild&city=Toulouse&language=JavaScript',
      query: { school: 'Wild', city: 'Toulouse', language: 'JavaScript' },
      pathname: '/',
      path: '/?school=Wild&city=Toulouse&language=JavaScript',
      href: '/?school=Wild&city=Toulouse&language=JavaScript'
    }

Ce qui nous intéresse ici c'est le `pathname` (`/` la racine du serveur), et la `query`, elle-même un objet, contenant les couples clé-valeur passés via la query string.

Et voici le code serveur : comme d'hab, commentaires plus complets dans `server.js`. Dans ce code, la partie utilisant `reduce()` sert à faire afficher, sur chaque ligne, une des paires *clé-valeur* de la query string.

```javascript
const http = require('http');
const url = require('url');

http.createServer(function (req, res) {
  // Analyse l'URL. 2ème paramètre = true --> parser la query string
  const parsedUrl = url.parse(req.url, true);

  // Affiche le résultat dans la console (check ton terminal !)
  console.log(parsedUrl);

  // Prépare un texte de base pour la réponse
  const responseTextBase = `URL:
  * Full URL: ${req.url}
  * Query string parameters:\n`;

  // Object.keys() pour récupérer les clés (ex: ['school', 'city', 'language'])
  const queryStringKeys = Object.keys(parsedUrl.query);

  // reduce pour ajouter  - clé: valeur  au texte de base, pour chaque paramètre
  const responseText = queryStringKeys.reduce((carry, key) => {
    return carry + `    - ${key}: ${parsedUrl.query[key]}\n`
  }, responseTextBase);

  res.writeHead(200, {
    'Content-Type': 'text/plain',
  });
  res.end(responseText);
}).listen(8080);

```

**3ème sous-étape** : `git checkout etape07b-querystring-express`, puis `npm install` (installer Express).

Aaah, on va sortir l'artillerie lourde ! Node.js seul nous fournit `url.parse()` pour analyser une query string. Mais Express nous simplifie encore plus la tâche : par défaut, il parse à notre place la query string, et nous fournit le résultat dans `req.query`.

Exemple qui fait strictement la même chose que le précédent, malgré de petites différences sur la façon d'écrire la réponse avec [res.set()](http://expressjs.com/en/4x/api.html#res.set), [res.status()](http://expressjs.com/en/4x/api.html#res.status) et [res.send()](http://expressjs.com/en/4x/api.html#res.send) :

```javascript
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
```

Toujours la même chose : teste différentes URL avec query string, avec telnet et/ou un navigateur...

Au passage, avec telnet, ou en examinant les headers dans les outils de développement, tu peux remarquer l'apparition de quelques nouveaux headers :
* `X-Powered-By` ayant pour valeur `Express`. Ce n'est *pas* un header standard. Autant ceux vus jusqu'à présent, `Content-Type`, etc., sont normalisés dans la spécification du protocole HTTP, autant tous les headers préfixés par `X-` sont des headers "custom", ce qui permet à tout un chacun d'utiliser ses propres headers,
en fonction de ses besoins.
* `ETag` est une sorte d'empreinte digitale de la ressource. Si elle ne change pas d'une requête à l'autre, cela permet au navigateur de mettre en cache la ressource, pour éviter une requête complète au serveur pour la recharger. Plus d'infos [ici](https://fr.wikipedia.org/wiki/Balise-entit%C3%A9_ETag_HTTP) et d'autres plus complètes (et complexes !) [ici](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching?hl=fr).

Tu peux aussi constater qu'Express, sans qu'on lui ait rien demandé, a aussi calculé la longueur du contenu et l'a indiquée dans `Content-Length`. Gentil Express !

### Etape 8 : code d'erreur `404 Not Found`

`git checkout etape08a-express-not-found`

On repart d'un exemple plus simple avec Express.

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.set({
    'Content-Type': 'text/html',
  })
  .status(200)
  .send(`<h1>Hello World</h1><ul>
    <li><a href="/">Home (this page)</a></li>
    <li><a href="/page-not-found">Show me a 404!</a></li>
  `);
});

app.listen(8080);
```

Teste le avec le navigateur (suis le lien "Show me a 404"), mais surtout, avec telnet (`GET /une-url-au-pif`), pour voir de plus près ce qui se passe : tu reçois cette fois `404 Not Found` comme code de statut. Normal, une seule route est câblée sur l'app Express, celle correspondant au chemin racine `/`.

Ici, c'est Express lui-même qui a généré la réponse, du fait qu'aucune route ne matche l'URL requise.

`git checkout etape08b-not-found-api`

Maintenant, on peut très bien avoir "câblé" une certaine route, mais devoir retourner une erreur 404 depuis le callback associé à cette route. Le code suivant est extrait de `server.js`, mais j'ai omis la "home page" qui ne fait que fournir des liens vers la "vraie" route qui nous intéresse, `app.get('/:movieSlug', (req, res) => { ... })`, ainsi que les commentaires.

C'est une sorte de mini-API pour récupérer des appréciations (objectives) sur des films. On utilise un simple tableau comme pseudo-base de données.

```javascript
const express = require('express');
const app = express();

const movies = [
  { id: 1, slug: 'the-last-jedi', title: 'The Last Jedi', content: 'Seriously... It really sucks!!!' },
  { id: 2, slug: 'the-grand-budapest-hotel', title: 'The Grand Budapest Hotel', content: 'This, on the other hand, is good.' },
  { id: 3, slug: 'the-matrix', title: 'The Matrix', content: 'A timeless classic.' },
  { id: 4, slug: 'wall-e', title: 'Wall-E', content: 'Great one.' },
  { id: 5, slug: 'the-last-of-the-mohicans', title: 'The Last of the Mohicans', content: "Call me an incult, I haven't seen this one." }
]

// Voir server.js
app.get('/', (req, res) => { // ... });

app.get('/:movieSlug', (req, res) => {
  // find() pour chercher un film dont le "slug" correspond à
  // celui passé dans l'URL
  const movie = movies.find(m => m.slug === req.params.movieSlug);
  // Si non trouvé : on génère soi-même une 404
  if(! movie) {
    return res.status(404).json({
      error: `No movie found with slug '${req.params.movieSlug}'`
    });
  }
  // Pas besoin de mettre .status(200) car 200 est le statut par défaut
  res.json(movie);
});

app.listen(8080);
```

Essaie différentes URL: [http://localhost:8080/wall-e](Wall-E), [http://localhost:8080/the-last-jedi](The Last Jedi), etc.
Si ce que tu mets comme chemin relatif correspond au slug d'un des `movies`, alors l'objet correspondant est retourné dans la réponse.

Sinon, on renvoie une erreur 404. Bien que simple, et n'utilisant pas une vraie base de données, cet exemple ressemble à ce qu'on trouverait
dans une vraie appli pour signifier au client qu'une ressource n'a pas été trouvée.

On génère nous-mêmes l'erreur 404 si un objet "matchant" le slug passant dans l'URL n'est pas trouvé.

Mais au fait... Tu te demandes peut-être : pourquoi n'utilise-t-on pas la query string, pour communiquer au serveur le slug du "movie" qu'on souhaite
récupérer ? Quelque chose du genre `/api/movies?movieSlug=wall-e`...?

![Much to learn you still have, young padawan](https://memegenerator.net/img/instances/59950310/much-to-learn-you-still-have-young-padawan.jpg)

Ah, jeune padawan, encore beaucoup à apprendre tu as ! Mais à vrai dire, c'est une question légitime ! La réponse à ta question tient en la structure
habituelle des dites API REST. Une API REST est une API qui expose des données à des clients, qui l'interrogent via HTTP. Elle est le plus souvent
liée à une base de données, et fait un lien entre les méthodes du protocole HTTP, et les différentes opérations possibles sur une base, résumées
par l'acronyme CRUD: Create, Read, Update, Delete.

Le plus souvent, on a cette structure d'URL. Gardons l'exemple des movies :
* `POST /movies`
    * Créer un objet `movie`
    * Requête SQL : `INSERT INTO movie (slug, title, content) VALUES(...)`
* `GET /movies` :
    * Lire tous les objets `movie`
    * Requête SQL : `SELECT * FROM movie`
* `GET /movies/:id` :
    * Lire un objet `movie`, identifié via son id
    * Requête SQL : `SELECT * FROM movie WHERE id=${id}`
* `UPDATE /movies/:id`
    * Mettre à jour un objet `movie`, identifié via son id
    * Requête SQL : `UPDATE movie SET slug='...', title='...', content='...' WHERE id=${id}`
* `DELETE /movies/:id`
    * Supprimer un objet `movie` identifié via son id
    * Requête SQL : `DELETE FROM movie WHERE id=${id}`

Bien que CRUD comporte 4 opérations, on a le plus souvent deux routes distinctes suivant qu'on souhaite obtenir *tous* les objets d'un certain type (read all), ou *un seul* objet (read one).

L'exemple ci-dessus montre une variante, où on utilise le slug (supposé unique) plutôt que l'id pour retrouver un movie. Il est simplifié dans le sens où on n'a implémenté
que les deux opérations de lecture (read all, read one).

C'est pour "coller" à cette... heu... convention, qu'on passe l'id, ou slug, ou autre, dans le chemin de l'URL, et pas via la query string. Et puis ça fait des URL plus "propres", non ?

Du coup, dans notre exepmle, on récupère le slug via `req.params.movieSlug`, et non pas via `req.query.movieSlug` si on avait passé le slug dans la query string.