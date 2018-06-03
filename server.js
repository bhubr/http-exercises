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

app.get('/', (req, res) => {
  res.set({
    'Content-Type': 'text/html',
  })
  .status(200)
  .send(`<h1>Movie API</h1>
    <ul>
      <li><a href="/api/movies/the-last-jedi">The Last Jedi</a></li>
      <li><a href="/api/movies/the-grand-budapest-hotel">The Grand Budapest Hotel</a></li>
      <li><a href="/api/movies/the-matrix">The Matrix</a></li>
      <li><a href="/api/movies/wall-e">Wall-E</a></li>
      <li><a href="/api/movies/the-last-of-the-mohicans">The Last of the Mohicans</a></li>
      <li><a href="/api/movies/some-random-movie">Some Random Movie (404)</a></li>
    </ul>
  `);
});

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
