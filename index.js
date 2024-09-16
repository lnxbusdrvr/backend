const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const app = express();

// json-parseri
app.use(express.json());
app.use(cors());

// Määritellään customoitumorgan nimeltään
// data
morgan.token('data', (request, response) => {
  return JSON.stringify(request.body);
});

// Otetaan customoitu morgan-nimeltään data käyttöön
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));

let notes = [  {    id: "1",    content: "HTML is easy",    important: true  },  {    id: "2",    content: "Browser can execute only JavaScript",    important: false  },  {    id: "3",    content: "GET and POST are the most important methods of HTTP protocol",    important: true  }];

// GET
app.get('/', (request, response) => {
  response.send('<h1>Hello Internet!</h1>');
});

// GET
app.get('/api/notes', (request, response) => {
  response.json(notes)
});

// GET resurssi by id
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id;
  const note = notes.find(note => note.id === id);

  if (note)
    response.json(note);
  else
    response.status(404).end();
});

// DELETE resurssi by id
app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

// luodaan funktio, joka luo ID:n
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  // varmistetaan, että kentissä on arvo.
  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  // Luodaan uusi olio
  // käyttäjän annetusta datasta
  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  }

  // Kopioidaan taulukko
  // ja lisätään siihen (kopioituun taulukkoon)
  // uusi tietue
  notes = notes.concat(note)

  response.json(note)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});
