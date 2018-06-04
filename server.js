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
