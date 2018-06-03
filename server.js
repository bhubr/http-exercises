const express = require('express');
const app = express();

const movies = [
  // Note le caractère absolument non-polémique du contenu de cette appréciation
  { id: 1, slug: 'the-last-jedi', title: 'The Last Jedi', content: 'Seriously... It really sucks!!!' },
  { id: 2, slug: 'the-grand-budapest-hotel', title: 'The Grand Budapest Hotel', content: 'This, on the other hand, is good.' },
  { id: 3, slug: 'the-matrix', title: 'The Matrix', content: 'A timeless classic.' },
  { id: 4, slug: 'wall-e', title: 'Wall-E', content: 'Great one.' },
  { id: 5, slug: 'the-last-of-the-mohicans', title: 'The Last of the Mohicans', content: "Call me an incult, I haven't seen this one." }
]

// On crée un tableau de clés d'authentification, chacune étant liée à un utilisateur
// (bien qu'on n'utilise pas ce userId pour l'instant)
const knownKeys = [
  { userId: 1, key: 'aH5QlmpU9PE02UHPw6C9sk8r01WYtkQB' },
  { userId: 2, key: 'kn6Gemyfp871S1FT2rHG4RjTFnHfTanT' },
  { userId: 3, key: 'cfchxuv75lSD8RlShYit5DStLzLe5RaI' }
];

// Tableau d'utilisateurs, chacun ayant un "rôle" : soit "admin", soit "regular"
const users = [
  { id: 1, role: 'admin' },
  { id: 2, role: 'regular' },
  { id: 3, role: 'regular' }
];

// Un middleware qui va vérifier la présence de la clé dans la query string,
// et sa validité (la trouve-t-on dans le tableau knownKeys ?)
const checkKeyMiddleware = (req, res, next) => {
  // Erreur si aucune clé fournie
  if(! req.query.key) {
    return res.status(401).send('You must provide a valid key in the query string');
  }
  // Erreur si une clé est fournie mais ne correspond à aucune clé du tableau
  const foundKey = knownKeys.find(k => k.key === req.query.key);
  if(! foundKey) {
    return res.status(401).send('The key you provided is not valid');
  }
  // Clé trouvée : continue l'exécution, next() passe au middleware suivant,
  // ou dans le cas présent, au callback de traitement de la route
  console.log('Authentified user with id:', foundKey.userId);

  // ATTENTION, modif par rapport à l'exemple précédent : on stocke l'utilisateur,
  // reconnu via la "key" associée à un "userId", directement dans l'objet req.
  // Ceci afin de pouvoir le transmettre au middleware suivant
  req.user = users.find(u => u.id === foundKey.userId);
  next();
}

// Un middleware qui va vérifier si l'utilisateur connecté dispose des droits d'administration,
// pour les requêtes en écriture
const checkAdminMiddleware = (req, res, next) => {
  // On n'est pas obligé de donner trop de détails sur pourquoi on renvoie "Forbidden".
  if(req.user.role !== 'admin') {
    return res.status(403).send('Forbidden');
  }
  // Si l'utilisateur est bien un admin, on peut passer au middleware suivant
  next();
}

// Utilise le checkKeyMiddleware pour protéger TOUTES les routes
app.use(checkKeyMiddleware);

// Utilise le checkAdminMiddleware UNIQUEMENT pour cette route
// (on le place ainsi, entre l'URL et le callback de traitement)
app.post('/api/movies', checkAdminMiddleware, (req, res) => {
  // Crée un nouveau movie, à partir des données envoyées en POST (dans la "vraie vie")
  // Non implémenté ici, on se contente juste de renvoyer un message qui confirme que ça a "marché"
  res.send({ id: 6, slug: 'new-movie', title: 'New movie', content: 'Your request succeeded!' });
})

app.get('/api/movies', (req, res) => res.json(movies));

app.get('/api/movies/:movieSlug', (req, res) => {
  // Un petit find() pour chercher un film dont le "slug" correspond à celui passé
  // dans l'URL
  const movie = movies.find(m => m.slug === req.params.movieSlug);
  // Si non trouvé : on génère soi-même une 404
  if(! movie) {
    return res.status(404).json({
      error: `No movie found with slug '${req.params.movieSlug}'`
    });
  }
  // Pas besoin de mettre .status(200) car 200 est le statut par défaut
  // Envoi des données en JSON
  res.json(movie);
});

app.listen(8080);
