# Exercices sur le protocole HTTP avec Node.js

Le protocole HTTP régit les échanges entre deux protagonistes :
* Un serveur, qui met à disposition des *ressources* : pages web statiques (fichiers HTML) ou dynamiques, API, images, etc.
* Un client, qui accède à ces ressources en émettant des *requêtes*, auxquelles le serveur *répond*.

Les terme de protocole, de client et serveur, peuvent trouver des parallèles dans la vie quotidienne : quand, en tant que *client*
d'un café, on demande une boisson au *serveur*, on se conforme à un certain *protocole* : par exemple, on commence par dire "bonjour",
et on conclut notre *requête* par "s'il vous plaît".

Il existe de nombreux protocoles informatiques, et rien que ceux liés à Internet sont nombreux :
* HTTP pour *Hyper Text Transfer Protocol* régit les échanges entre les navigateurs - mais pas que - et les serveurs web, pour transférer
des fichiers d'"hypertexte" (texte avec des hyperliens, comme HTML)... Mais pas que (on peut aussi transférer des fichiers images, etc.) !
* FTP pour *File Transfer Protocol* définit un protocole spécifique à l'échange de fichiers, en download (le client reçoit des fichiers d'un serveur)
comme en upload (l'inverse donc).
* SMTP pour *Simple Mail Transfer Protocol* : emails sortants (quand tu envoies un email).
* POP3 pour *Post Office Protocol 3* : emails entrants (l'ancien protocole).
* IMAP pour *Internet Message Access Protocol* : emails entrants également (protocole plus moderne).

HTTP est aussi très utilisé pour de nombreuses applications en dehors des seuls navigateurs. Dans certaines entreprises où tout le réseau est strictement
protégé, par des "pare-feus" et autres, le port 80 utilisé par HTTP est parfois le seul qui ne soit pas bloqué. Il peut donc être "détourné" pour d'autres
usages que le web.

FTP aussi est très utilisé, mais certains experts recommandent son abandon au profit de protocoles plus sécurisés comme HTTPS (HTTP crypté avec SSL).
Allez, pour le plaisir de citer mon vieil ami Ben :

![Obiwan FTP meme](https://i.pinimg.com/originals/d0/5d/2b/d05d2b0c435d8b890289a0d84d437cc8.jpg)

## Prépare tes munitions

![I need ammo](https://raw.githubusercontent.com/bhubr/http-exercises/master/img/i-need-ammo.jpg)

On va s'exercer à faire des requêtes sur un mini-serveur écrit avec Node.js. Tu vas avoir besoin de plusieurs outils :
* Node.js. Si tu ne l'as pas, tu peux l'installer sous Ubuntu / Debian en suivant [ces instructions](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)
* nodemon - un package pour Node.js, permettant de "surveiller" le fichier répertoire contenant le code source du serveur, pour le redémarrer
à chaque changement : `sudo npm install -g nodemon`
* Mozilla Firefox *et* Google Chrome, chacun pouvant avoir l'avantage sur certaines fonctionnalités précises dont on va se servir
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
* [http://localhost:8080?firstName=Joe&lastName=Dalton&email=joe%40daltonfamily.org](http://localhost:8080?firstName=Joe&lastName=Dalton&email=joe%40daltonfamily.org)
* [http://localhost:8080?school=Wild&city=Toulouse&language=JavaScript](http://localhost:8080?school=Wild&city=Toulouse&language=JavaScript)

Essaie la même chose avec telnet :
* `GET /`
* `GET /?firstName=Joe&lastName=Dalton&email=joe%40daltonfamily.org`
* `GET /?school=Wild&city=Toulouse&language=JavaScript`

#### Encodage des caractères spéciaux et accentués

Note le `%40` dans la seconde URL. C'est le caractère `@`, converti ou *encodé* dans un format compatible avec les URLs. En effet, la plupart des caractères spéciaux, ainsi que les caractères accentués, ne peuvent pas être passés sans encodage dans la query string.

Il existe de nombreux outils en ligne comme [celui-ci](https://meyerweb.com/eric/tools/dencoder/), permettant d'encoder/décoder des chaînes au format des URLs (au passage c'est le site d'Eric Meyer, gourou du CSS et auteur de la [bible ultime sur le sujet](https://meyerweb.com/eric/books/css-tdg/), en 1088 pages !).

En JavaScript, on dispose des fonctions [encodeURIComponent](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/encodeURIComponent) et [decodeURIComponent](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/decodeURIComponent) pour effectuer cet encodage/décodage.

**Attention**, chaque "composant" de l'URL doit être encodé individuellement. Il ne faut pas chercher à encoder `firstName=Joe&lastName=Dalton&email=joe@daltonfamily.org` d'un coup, car alors les esperluettes (`&`) seraient encodées en `%26`, et ne feraient plus office de séparateurs entre les paires de clés-valeurs de la query string !

#### Conclusion de cette sous-étape : peut mieux faire !

Bon, côté serveur, notre code reste basique : dans le traitement de la requête par le serveur, on a juste séparé la query string du reste de l'URL. Maintenant, ce serait plus pratique de pouvoir récupérer chaque paramètre individuellement, non ?

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
app.get('/', (req, res) => {
  // ...
});

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

Du coup, dans notre exemple, on récupère le slug via `req.params.movieSlug`, et non pas via `req.query.movieSlug` (qu'on aurait utilisé si on avait passé le slug dans la query string).

### Etape 9 : code d'erreur `401 Unauthorized`

`git checkout etape09-unauthorized`

On va repartir de l'exemple précédent, pour montrer un mécanisme *simple* de protection d'une API contre des accès non autorisés. Admettons qu'on ne veuille donner accès à l'API movies que pour des utilisateurs enregistés. Chaque utilisateur se voit fournir une "clé secrète" lors de son inscription.

Ce mécanisme est proche de celui mis en place par Google Maps ([un exemple web](https://developers.google.com/maps/documentation/javascript/examples/map-simple?hl=fr#essayez-par-vous-mme)) pour authentifier les requêtes.

Les modifications apportées par rapport à l'étape précédente : d'une part, on a supprimé la home page pour avoir moins de code ! À toi de construire tes URL pour interroger l'API. À côté, on a ajouté ce bloc de code :

```javascript
// Tableau de clés d'authentification
const knownKeys = [
  { userId: 1, key: 'aH5QlmpU9PE02UHPw6C9sk8r01WYtkQB' },
  { userId: 2, key: 'kn6Gemyfp871S1FT2rHG4RjTFnHfTanT' },
  { userId: 3, key: 'cfchxuv75lSD8RlShYit5DStLzLe5RaI' }
];

// Middleware qui vérifie la présence de la clé et sa validité
const checkKeyMiddleware = (req, res, next) => {
  if(! req.query.key) {
    return res.status(401).send('You must provide a valid key in the query string');
  }
  const foundKey = knownKeys.find(k => k.key === req.query.key);
  if(! foundKey) {
    return res.status(401).send('The key you provided is not valid');
  }
  // Clé trouvée : continue l'exécution, next() passe au callback de la route
  console.log('Authentified user with id:', foundKey.userId);
  next();
}

// Utilise le middleware pour protéger TOUTES les routes
app.use(checkKeyMiddleware);
```

En résumé : le middleware `checkKeyMiddleware` vérifie la présence d'une clé passée via la query string. Si aucune clé n'est passée, ou si la clé passée est invalide, on envoie une réponse au client, avec un code d'erreur. Ce code d'erreur est `401 Unauthorized` : on n'a pas pu reconnaître l'appelant (utilisateur) de l'API, et donc on lui interdit l'accès. `next()` n'est alors jamais appelée, et on n'arrivera pas jusqu'au callback de la route demandée.

Si par contre une clé valide est passée (valide au sens trouvée dans le tableau `knownKeys`), on passe au callback de la route, en appelant `next()`.

**Du coup**, à toi de jouer : utilise soit telnet, soit Firefox, pour interroger le serveur avec une URL un paramètre `key` correct dans la query string.

### Etape 10 : code d'erreur `403 Forbidden`

`git checkout etape10-unauthorized`

On arrive à un autre code d'erreur couramment utilisé par les sites et applications web : le `403 Forbidden`. Forbidden, Unauthorized... cela ne se ressemble-t-il pas un peu ?

À première vue, oui... Mais du point de vue du protocole HTTP, c'est différent. Imagine un site ou application un tant soit peu complexe. Par exemple un CMS comme la plate-forme de blog WordPress (écrite en PHP, mais ça ne change rien). WordPress, par exemple, gère plusieurs "rôles" d'utilisateurs : le plus élevé étant le rôle "Administrateur", qui permet de tout gérer sur le site : contenu, installation d'extensions, modification des options, changement du "template" d'affichage ; le moins élevé étant le rôle "Abonné", où une personne dispose d'un profil personnel sur le site, mais ne peut pas faire grand chose (par exemple, elle ne peut pas publier d'articles).

Les deux personnes se connectent à la partie "administrative" de WordPress via le même formulaire de login. Une fois qu'elles saisissent ce formulaire avec des identifiants valides, WordPress les reconnaît, et les *autorise* à accéder au site. Par contre, si un abonné essaie d'accéder à une page réservée aux administrateurs, il reçoit une erreur `403 Forbidden` : il est bien reconnu en tant qu'utilisateur, mais WordPress sait que ses "droits d'accès" sont insuffisants pour accéder à cette page.

On va continuer sur l'exemple de l'API fictive "movie", en y ajoutant un mécanisme semblable. On pourrait par exemple :
* Autoriser tous les accès GET aux utilisateurs reconnus, quel que soit leur "rôle".
* N'autoriser les accès POST, PUT, DELETE, qu'aux utilisateurs ayant le rôle "admin".

On va se simplifier la tâche, et ne considérer que deux rôles : "regular" et "admin". Voici le code (parties changées uniquement, sans les commentaires) :

```javascript
// Tableau d'utilisateurs, chacun ayant un "rôle" : soit "admin", soit "regular"
const users = [
  { id: 1, role: 'admin' },
  { id: 2, role: 'regular' },
  { id: 3, role: 'regular' }
];

// Vérification de la clé
const checkKeyMiddleware = (req, res, next) => {
  // Cette partie est inchangée
  if(! req.query.key) {
    return res.status(401).send('You must provide a valid key in the query string');
  }
  const foundKey = knownKeys.find(k => k.key === req.query.key);
  if(! foundKey) {
    return res.status(401).send('The key you provided is not valid');
  }
  console.log('Authentified user with id:', foundKey.userId);

  // ATTENTION, modif par rapport à l'exemple précédent : on stocke l'utilisateur,
  // reconnu via la "key" associée à un "userId", directement dans l'objet req.
  // Ceci afin de pouvoir le transmettre au middleware suivant
  req.user = users.find(u => u.id === foundKey.userId);
  next();
}

// Vérification du rôle de l'utilisateur
const checkAdminMiddleware = (req, res, next) => {
  // On n'est pas obligé de donner trop de détails sur pourquoi on renvoie "Forbidden".
  if(req.user.role !== 'admin') {
    return res.status(403).send('Forbidden');
  }
  // Si l'utilisateur est bien un admin, on peut passer au middleware suivant
  next();
}

// Utilise le middleware checkKeyMiddleware pour protéger TOUTES les routes
app.use(checkKeyMiddleware);

// Ne vérifie le rôle admin que pour CETTE route
app.post('/api/movies', checkAdminMiddleware, (req, res) => {
  // On renvoie une réponse "bidon" juste pour dire que ça a "marché"
  res.send({ id: 6, slug: 'new-movie', title: 'New movie', content: 'Your request succeeded!' });
})
```

Dans le code, plusieurs changements :
* On a créé un tableau `users` contenant 3 utilisateurs : seul celui avec l'id 1 a le rôle "admin".
* Quand on vérifie la clé dans `checkKeyMiddleware`, on va chercher dans `users` l'utilisateur qui a l'id indiqué par la propriété `userId` de l'objet `foundKey`.
* On stocke cet utilisateur dans `req.user` avant de passer au middleware suivant.
* Le middleware suivant, `checkAdminMiddleware`, ne sera appelé que sur la route `app.post('/api/movies', ...)`. Remarque qu'on l'indique comme 2ème paramètre,
et que le callback qui traite la requête se retrouve en 3ème.
* Ce callback de la route "création de movie" est d'ailleurs fictif... il ne crée rien du tout ici :). Dans la vraie vie, on créerait un objet dans la BDD.
* Si on résume quels middlewares seront exécutés pour chaque route, on a :
    * `checkKeyMiddleware` puis `checkAdminMiddleware` pour la route de création
    * `checkKeyMiddleware` uniquement pour les deux routes de lecture

Si on résume, au regard de cet exemple, la différence entre `401 Unauthorized` et `403 Forbidden` :
* Un client HTTP appelant l'API sans fournir de clé, ou en fournissant une clé invalide, reçoit une `401 Unauthorized` : il ne peut être reconnu comme un utilisateur enregistré.
* Un client appelant l'API avec une clé correspondant un utilisateur "regular" peut accéder aux routes de lecture, mais pas à celle d'écriture : il reçoit une `403 Forbidden` s'il le tente
* Un client appelant l'API avec une clé d'utilisateur "admin" peut accéder à tout.

Fais quelques essais en essayant différentes ces combinaisons de clés et d'URL, avec telnet (tu ne pourras pas le faire avec le navigateur, tu pourrais le faire avec curl ou Postman cependant) :
* `GET /api/movies`
* `GET /api/movies?key=kn6Gemyfp871S1FT2rHG4RjTFnHfTanT`
* Une requête POST cette fois, mais avec la même clé et la même URL : `POST /api/movies?key=kn6Gemyfp871S1FT2rHG4RjTFnHfTanT`
* Une requête POST, avec une clé "admin" : `POST /api/movies?key=aH5QlmpU9PE02UHPw6C9sk8r01WYtkQB`

Petite remarque : on valide les requêtes POST aussi par un "double entrée", *du moins pour l'instant*. Plus tard, on fournira un "corps de requête" (*request body*).

### Etape 11 : envoi de formulaire par méthode GET

Nous arrivons à un sujet ô combien important dans les sites et applications web : l'envoi de données de formulaires.

On repart cette fois d'un nouvel exemple : `git checkout etape11-formulaire-get`

Voilà le code du serveur :

```javascript
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

```

On envoie au client un formulaire tout simple, contenant 3 champs et un bouton "Send". Ouvre la [http://localhost:8080](page d'accueil), remplis et soumets ce
formulaire : une requête GET part vers la *même* URL.

Pourquoi une requête GET ? Parce qu'on n'a pas spécifié une méthode différente via l'attribut `method`. Pourquoi vers la même URL ? Parce qu'on n'a pas spécifié non plus une URL vers laquelle soumettre, ce qu'on aurait pu faire via l'attribut `action` (exemple [ici](https://www.w3schools.com/tags/att_form_method.asp)).

L'URL dans la barre d'adresse est modifiée et laisse apparaître... une query string collée à l'URL ! C'est en effet par la query string que les données d'un formulaire sont envoyées, quand on utilise la méthode GET.

Le formulaire étant envoyé par le client en GET vers le chemin `/`, côté serveur, c'est la même route qui gère la création et l'envoi du formulaire, et son traitement.
On ne traite le formulaire que si la query string existe - en d'autres termes, que le tableau de clés de la query string, récupéré via `Object.keys(req.query)`, est non-vide.

Dans ce cas, on affiche les données qui ont été soumises, tout en affichant tout de même le formulaire.

Essaie maintenant de soumettre ce formulaire, non pas via le navigateur, mais via telnet. Des exemples :
* `GET /?name=Beno%C3%AEt&email=benoit%40dontyoudarespamme.net&message=Those+brackets+%5B%5D+have+been+URL-encoded`
* `GET /?name=John&email=contact%40johnmayer.com&message=Listen+to+my+song+Gravity`
Si tu veux faire tes propres requêtes (ce que je te conseille), reporte-toi à un outil d'encodage en ligne, ou utilise [encodeURIComponent](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/encodeURIComponent) dans la console de ton navigateur, pour l'encodage de chaînes comportant des caractères spéciaux:

**La soumission de formulaires en GET**, telle que ci-dessus, est quelque peu tombée en désuétude. Les paramètres GET sont toujours largement utilisés (ex. des vidéos YouTube vu précédemment), mais on ne les communique généralement pas via des formulaires. Ou alors, pour des usages bien spécifiques, comme va le montrer l'exemple suivant.

### Etape 12 : paramètres de requête pour filtrer le retour d'une API

`git checkout etape11b-filter-api-results`

Voici le code serveur... Qui inclut un peu de code front !

```javascript
const express = require('express');
const app = express();

// Encore les movies !
const movies = [
  { id: 1, slug: 'the-last-jedi', title: 'The Last Jedi', content: 'Seriously... It really sucks!!!' },
  { id: 2, slug: 'the-grand-budapest-hotel', title: 'The Grand Budapest Hotel', content: 'This, on the other hand, is good.' },
  { id: 3, slug: 'the-matrix', title: 'The Matrix', content: 'A timeless classic.' },
  { id: 4, slug: 'wall-e', title: 'Wall-E', content: 'Great one.' },
  { id: 5, slug: 'the-last-of-the-mohicans', title: 'The Last of the Mohicans', content: "Call me an incult, I haven't seen this one." }
];

app.get('/api/movies', (req, res) => {
  // Alors... c'est pas si compliqué: on convertit à la fois le paramètre passé dans la query string (req.query.titlePart),
  // et le titre de chaque film, en minuscules, pour ne pas éliminer des titres dont la casse (majuscules&minuscules)
  // ne correspond pas. On garde les films dont les titres contiennent le terme de recherche passé dans req.query.titlePart
  const filteredMovies = movies.filter(
    m => m.title.toLowerCase().includes(req.query.titlePart.toLowerCase())
  );
  res.json(filteredMovies);
});

app.get('/', (req, res) => {
  let responseText = `
    <form>
      <h1>Movies</h1>
      <p>Filter by movie title</p>
      <input id="titlePart" name="titlePart" type="text" placeholder="Type a few characters" />
      <ul id="results"></ul>
    </form>
    <script>
    // réagit aux appuis sur une touche, dans le champ input
    document.getElementById('titlePart').addEventListener('keyup', evt => {
      const titlePart = evt.target.value;
      fetch('/api/movies?titlePart=' + titlePart)
      .then(r => r.json())
      .then(movies => {
        // affiche les films filtrés
        document.getElementById('results').innerHTML = '<h3>Results</h3>' + movies.map(
          movie => \`<li>\${movie.title}</li>\`
        ).join('');
      });
    });
    </script>
    `
  res.send(responseText);
});

app.listen(8080);
```

Tu peux décortiquer ce code, mais ce n'est pas obligatoire... Ce qu'il fait :
* Affichage d'un formulaire... sans bouton submit
* Dans le html qu'on envoie au client, on inclut un script, avec un "event listener" sur le champ input
* Cet event listener détecte les changements de l'input, et envoie une requête GET sur la route `/api/movies`,
avec un paramètre de requête (clé : `titlePart`, valeur : celle de l'input)
* Le callback de la route `/api/movies` filtre le tableau de movies, en ne gardant que ceux dont le titre contient
le terme passé dans le paramètre `titlePart`.
* Les movies filtrés sont envoyés au client, qui les affiche sous forme de list items.

Sois curieux : regarde ce qui se passe dans l'onglet "Network" des outils de développeur, au fur et à mesure qu'on modifie
le champ input... Une requête est émise à chaque changement.

C'est une version simplifiée de ce qui se ferait "en vrai" : dans une vraie app, on irait chercher les data dans la BDD
au lieu de les prendre dans un tableau, et on filtrerait via un `WHERE` dans la query SQL, au lieu de faire un `filter()`.

On pourrait même avoir plusieurs filtres... Cela dépasse un peu le sujet, mais c'est un usage courant des paramètres GET.
À propos, bien qu'on puisse les appeler "paramètres GET", les paramètres passés dans la query string ne sont pas réservés
à la méthode GET. On peut les utiliser pour n'importe quelle méthode.

Ils sont appelés comme cela probablement par abus de langage, du fait que c'est la façon dont on passe les données au serveur
lors d'une soumission de formulaire en GET.

Dernier point : cet exemple n'est pas à proprement parler une soumission de formulaire... puisqu'on n'a pas de bouton "submit",
et qu'on fait les envois de données en AJAX, c'est-à-dire sans recharger toute la page comme on le faisait dans l'exemple précédent.

### Etape 13 : problèmes liés à la soumission par GET

**Attention** : `git checkout etape13-bad-case-of-get-submission` **puis** `npm install` (pour installer le module `morgan`)

Si la façon d'envoyer des paramètres par GET vue dans l'étape 12 est communément utilisée, l'envoi de formulaires comme dans l'étape 11 ne l'est
pas tant que ça. Il y a des raisons à cela : la méthode GET n'est pas très bien adaptée.

On reprend un exemple assez semblable à celui de l'exemple 11, transformé pour afficher un formulaire de login.

```javascript
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
```

On a cette fois un formulaire de login, qui envoie ses données en GET. Comme il est d'usage dans les applications serveur,
on utilise le module `morgan` pour "logger" toutes les requêtes entrantes sur la console : pour chaque requête, les infos
suivantes sont affichées (jette un oeil à ta console, après avoir joué un peu avec l'exemple dans le navigateur) :
* Adresse IP d'origine (`::1` est l'adresse IP locale en IPv6).
* Date&heure de la requête.
* Chemin de la requête, *incluant la query string*, et donc, dans l'exemple ci-dessus, le password !
* Version du protocole (HTTP/1.1).
* Code de statut (200, 401, etc.)
* Nombre d'octets envoyés (qui correspond au header de réponse `Content-Length`).

Dans une application Node.js en production, on a des systèmes tels que [PM2](http://pm2.keymetrics.io/) pour gérer le processus
Node.js, le redémarrer s'il crashe, etc. Ces systèmes sont configurés pour sauvegarder *toute* la sortie console dans un ou des fichiers
appelés journaux ou *logs*.

Tu vois le problème ? Eh bien, avec l'exemple ci-dessus, on se retrouverait à écrire *en clair* le mot de passe des utilisateurs
dans le log. Et ça... ça, jeune padawan, c'est mal, c'est même passible d'une punition sévère !

![Your Punishment Must Be More Severe](http://i.qkme.me/3p23fz.jpg)

En effet, si quelqu'un de mal intentionné arrive à s'introduire sur ton serveur, il lui suffit de lire les logs pour récupérer les mots
de passe de tes chers clients ! Tout le mal que tu as pu te donner à crypter les mots de passe dans ta BDD, en vain !

Donc, répète après moi : **"je n'enverrai pas de données sensibles par GET"**. Voilà !

Outre les problèmes de sécurité, les envois en GET sont aussi :
* limités par la taille de ce qu'on peut envoyer
* limités par le *type de données* qu'on peut envoyer (pour envoyer une image, il faudrait d'abord l'encoder, depuis son format binaire,
vers un format "string-friendly").

Donc, si on n'envoie pas les données de formulaire par la méthode GET, ce sera... par la POST !

![La Poste](http://www.frederic-poitou.com/blog/wp-content/88059_poste01-jdr01.jpg).

### Etape 14 : soumission de formulaires en POST / urlencoded

**Attention** : `git checkout etape14-post-submission-urlencoded` **puis** `npm install` (pour installer le module `body-parser`)

On peut reprendre l'exemple précédent, et y apporter quelques modifications, pour nettement améliorer la situation (voir `server.js`) :
* Ajout de l'attribut `method="POST"` sur le `<form>`.
* En conséquence, sur la route `/login`, passage de `app.get('/login', ...)` à `app.post('/login', ...)`.
* Ajout d'un middleware permettant de parser / analyser le *corps* d'une requête envoyée en POST (*request body*) : le "body parser",
fourni par le module `body-parser`.
* Récupération des données du formulaire, non plus via les propriétés de `req.query`, mais via celles de `req.body`, un objet qui a été
construit par le body parser, à partir du *corps de requête* envoyé par le client.

```javascript
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
```

Teste tout cela, avec Chrome d'abord : outils de dev, onglet "Network"... Soumets le formulaire avec ce qui t'est donné
en indice (subtil, ça va de soi), sélectionne la ligne correspondante (la seule !) dans la liste des requêtes... Et examine les headers (onglet du même nom) :
* Dans "Request Headers", le header `Content-Type` a la valeur `application/x-www-form-urlencoded`. Oui, on peut spécifier des en-têtes de requête, et oui,
le `Content-Type` peut être communiqué du client vers le serveur, tout comme, on l'a vu, il peut l'être dans le sens inverse.
* Dans "Form Data", tu voix apparaître par défaut les données que tu as saisies, "parsées", séparées en couples clé-valeur. Clique sur "view source" pour voir ce que le client a *réellement* envoyé dans le corps de la requête : tu dois voir `email=jonsnow%40got.tv&password=YouKnowNothing`.

Mais, mais... Ce corps de réponse ressemble à... Une query string ! En effet, c'est la façon dont sont encodées par défaut les données de formulaires, lorsqu'on soumet en POST. D'où, d'ailleurs, le header de requête `Content-Type: application/x-www-form-urlencoded`, qui nous indique bien qu'on envoie des données "urlencoded".

Maintenant, fais la même chose avec Telnet. Une fois `telnet localhost 8080`  lancé, attention, il y a une petite différence par rapport aux requêtes GET. Tu vas saisir (copier-coller est autorisé, mais j'aurais pas du dire ça) :

    POST /login
    Content-Type: application/x-www-form-urlencoded
    Content-Length: 46

    email=jonsnow%40got.tv&password=YouKnowNothing

Tu peux conclure et valider ta saisie d'*un* appui sur Entrée. Si on se penche sur "l'anatomie" de cette requête, il n'y a pas tant de différences que ça, avec ce qu'on a déjà vu :
* On indique toujours la *méthode* suivie du *chemin* : `POST /login`
* On indique cette fois des headers de requête. Au passage, *ce n'est pas du tout spécifique à POST*, et on peut aussi passer des headers de requête en GET, PUT, DELETE, etc.
* Par contre, après avoir laissé une ligne vide, on écrit le corps de la requête ou *request body*, qui par définition n'existe pas pour une requête GET.
* On a mis très exactement 46 caractères dans ce *body*, ce qui est *très grossièrement* équivalent à 46 octets (en fait, ça l'est tant qu'on reste dans les caractères très courants, non accentués, référencés dans la table ASCII de base).

Tiens, comme on est joueurs, dans `server.js`, commente la ligne suivante :

    app.use(bodyParser.urlencoded({ extended: false }));

Puis ré-essaie une soumission via le navigateur ou via Telnet. Le résultat est sans appel : tu écopes d'une erreur `500 Internal Server Error`, typique d'un cas où une erreur non prévue se produit. La réponse en erreur renvoyée par le serveur, contient la même chose que ce qui s'affiche dans la console :

    TypeError: Cannot read property 'email' of undefined
        at app.post (/home/bhu/Dev/http-exercises/server.js:25:15)
        at Layer.handle [as handle_request] (/home/bhu/Dev/http-exercises/node_modules/express/lib/router/layer.js:95:5)
        at next (/home/bhu/Dev/http-exercises/node_modules/express/lib/router/route.js:137:13)
        at Route.dispatch (/home/bhu/Dev/http-exercises/node_modules/express/lib/router/route.js:112:3)
        at Layer.handle [as handle_request] (/home/bhu/Dev/http-exercises/node_modules/express/lib/router/layer.js:95:5)
        at /home/bhu/Dev/http-exercises/node_modules/express/lib/router/index.js:281:22
        at Function.process_params (/home/bhu/Dev/http-exercises/node_modules/express/lib/router/index.js:335:12)
        at next (/home/bhu/Dev/http-exercises/node_modules/express/lib/router/index.js:275:10)
        at logger (/home/bhu/Dev/http-exercises/node_modules/morgan/index.js:144:5)
        at Layer.handle [as handle_request] (/home/bhu/Dev/http-exercises/node_modules/express/lib/router/layer.js:95:5)
    ::1 - - [04/Jun/2018:02:10:33 +0000] "POST /login HTTP/0.9" 500 1287

Ce `undefined` dont on a essayé de lire la propriété `email`, c'est la valeur du `req.body` : dans Express, pas de body parser, pas de body !
Remets donc les choses en ordre, dès maintenant, en décommentant la ligne qui active le body parser.

### Etape 15 : soumission de formulaires en POST / multipart/form-data

`git checkout etape15-post-submission-multipart`

Cet exemple va te montrer un deuxième type d'encodage des données POST : le **multipart** (mes plus plates excuses pour mon humour débile).

![Leeloo Dallas Multipart](https://i.imgflip.com/2bk855.jpg)

On recycle l'exemple précédent, avec quelques modifications pour le transformer en formulaire d'upload :
* ajout de l'attribut `enctype="multipart/form-data"` au `<form>`, et modification de son `action` pour soumettre vers `/upload`.
* suppression du champ password, ajout de deux champs `<input type="file" />` pour faire des uploads de fichier.

Par contre, on ne va pas vraiment gérer le fichier uploadé.
Il y a plein de tutos pour ça, s'appuyant sur des modules tels que `multer`, `formidable`, etc. ([un comparatif de modules toujours maintenus](https://npmcompare.com/compare/busboy,formidable,multer,multiparty), ça vaut ce que ça vaut).

Alors ici, tu vas regarder ce qui se passe, uniquement dans Chrome. Telnet ne te sera d'aucune utilité, dans ce cas précis.

Pour remplir le formulaire, sélectionne deux fichiers (par exemple `package.json` et `server.js` dans ce repo), puis envoie le formulaire. Bien sûr, tu es sur l'onglet Network de tes outils de dev... Si tu sélectionnes l'unique ligne du trafic réseau, l'onglet "Headers" doit te montrer, sous "Request Headers", un `Content-Type` du
genre : `Content-Type:multipart/form-data; boundary=----WebKitFormBoundary9GjZ24NeoBIniOZI`.

Et sous "Request Payload", tu dois voir quelque chose de semblable à ceci :

    ------WebKitFormBoundary9GjZ24NeoBIniOZI
    Content-Disposition: form-data; name="email"

    jonsnow@got.tv
    ------WebKitFormBoundary9GjZ24NeoBIniOZI
    Content-Disposition: form-data; name="file1"; filename="package.json"
    Content-Type: application/json


    ------WebKitFormBoundary9GjZ24NeoBIniOZI
    Content-Disposition: form-data; name="file2"; filename="server.js"
    Content-Type: application/javascript


    ------WebKitFormBoundary9GjZ24NeoBIniOZI--

Bon, pour faire rapide et (j'espère) simple :
* `boundary=XXX` dans le header `Content-Type` indique un "séparateur", qui est utilisé pour séparer les *différentes parties* (multipart, quoi). `Boundary` signifie "frontière", by the way.
* Cette valeur `XXX` donnée à `boundary` est effectivement utilisée dans le corps de la requête. Chaque champ du formulaire se trouve entre deux
occurences de cette `boundary`.
* On retrouve les attributs `name` donnés à chaque champ du formulaire (`email`, `file1`, `file2`).
* Pour les fichiers, leurs noms sont également indiqués, ainsi que leurs types MIME (`Content-Type`, là encore).
* En fait, c'est un peu comme si on envoyait plusieurs formulaires dans un seul corps de requête, chacun avec ses propres en-têtes.
* Ici, Chrome ne montre pas le *contenu* des fichiers qui sont uploadés. Mais le `Content-Length: 1823` nous indique bien que des données sont envoyées, qu'on voit pas dans "Request Payload".

Tu seras amené à faire tes soumissions de formulaires quasi-systématiquement en AJAX (c'est à dire sans recharger la page, du fait du contexte "Single Page App" des applis React, Angular, etc.). Si tu as besoin de docs sur comment faire ça, reporte toi à la section de [MDN sur FormData](https://developer.mozilla.org/fr/docs/Web/API/FormData/Utilisation_objets_FormData#Envoi_de_fichiers_via_un_objet_FormData). Comme cette section utilise `XMLHttpRequest` (l'ancienne API Ajax des navigateurs), reporte-toi aussi à des exemples plus actuels, comme par exemple [ce post StackOverflow](https://stackoverflow.com/questions/35192841/fetch-post-with-multipart-form-data/35206069) et [cet article de blog](https://stanko.github.io/uploading-files-using-fetch-multipart-form-data/). Sinon, une recherche sur les termes "multipart upload fetch" devrait t'amener des réponses.

### Etape 16 : soumission de formulaires en POST / application/json

`git checkout etape16-post-submission-json`

On en arrive à un dernier type d'encodage, du moins en ce qui nous concerne : le JSON. Je précise plusieurs points :
* Les deux encodages qu'on a vus précédemment sont les encodages "standard" des formulaires web.
* On ne peut pas spécifier `enctype="application/json"` sur un tag `<form>`. Un [document de travail](https://www.w3.org/TR/html-json-forms/)
  existe encore sur le site du W3C, mais cette spécification est **abandonnée**.
* On peut cependant envoyer du JSON via des requêtes AJAX, que ce soit via `XMLHttpRequest` (l'ancêtre vénérable), `jQuery.ajax` (tout aussi vénérable
mais tout aussi ancestral), ou, mieux : `fetch`, l'API moderne pour les requêtes AJAX.
* Il existe encore d'autres types d'encodage : on peut envoyer des données en XML, et que sais-je encore.
* Mais pour les apps JavaScript, il est plus naturel de travailler avec du JSON (qui signifie, rappelons-le, *JavaScript Object Notation*, signifiant sa parenté avec la façon d'écrire les objets en JS).

Tu peux tester ce formulaire avec Chrome ou autre, voir ce qui se passe si tu essaies d'insérer deux users avec le même email.

De même tu peux tester avec telnet. Seulement, il te faudra *encoder* toi-même les caractéristiques du nouvel utilisateur à enregistrer,
vers le format JSON. Tu peux écrire un objet JS avec les bonnes propriétés (email, name, password) dans un fichier .js que tu exécuteras avec Node, ou directement l'écrire dans la console du navigateur, et faire un `console.log(JSON.stringify(obj))`pour l'encoder en JSON. Exemple :

```javascript
const userData = {
  name: 'John Doe',
  email: 'johndoe01@example.com',
  password: 'SoSecure1234'
};
console.log(JSON.stringify(userData));
// {"name":"John Doe","email":"johndoe01@example.com","password":"SoSecure1234"}
```

Ensuite, colle le résultat (la chaîne JSON) dans ton éditeur de texte, sélectionne tout : ton éditeur doit te dire combien de caractères tu as sélectionné.
    Cela te donne ta `Content-Length` (77 dans mon cas). Ensuite, dans telnet, écris ta requête. Dans mon exemple :

    POST /signup
    Content-Type: application/json
    Content-Length: 77

    {"name":"John Doe","email":"johndoe01@example.com","password":"SoSecure1234"}

Si tu le fais une première fois, tu reçois en retour les caractéristiques du nouvel user (avec son id fictif, et sans le password).
Si tu colles la même chose une 2ème fois, tu reçois une erreur `400 Bad Request`.

Voilà... Avec tout ça, tu pourras bientôt rajouter HTTP aux langues vivantes que tu maîtrises !

[To be continued...]