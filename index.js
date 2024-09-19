const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
require('dotenv').config();
const Note = require('./models/note');

// json-parseri
app.use(express.json());
app.use(cors());
// käytetään stattisia sivuja(frontista tuotua)
app.use(express.static('dist'));

// Määritellään customoitumorgan nimeltään
// data
morgan.token('data', (request, response) => {
  return JSON.stringify(request.body);
});

// Otetaan customoitu morgan-nimeltään data käyttöön
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));

//let notes = [  {    id: "1",    content: "HTML is easy",    important: true  },  {    id: "2",    content: "Browser can execute only JavaScript",    important: false  },  {    id: "3",    content: "GET and POST are the most important methods of HTTP protocol",    important: true  }];

// GET
app.get('/', (request, response) => {
  Note.find({}).then(notes => {
    respons.send('<h1>Hello Internet!</h1>');
  })
});

// GET
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
});

app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
      response.json(note);
  });
});

app.delete('/api/notes/:id', (request, response) => {
  Note.findByIdAndDelete(request.params.id).then(result => {
    if (result)
      response.status(204).end();
    else
      response.status(404).end();
  });
});


// luodaan funktio, joka luo ID:n
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.post('/api/notes', (request, response) => {
  const body = request.body;

  // Varmistetaan, että kentässä "content" on arvo
  if (!body.content)
    return response.status(400).json({ error: 'content missing' });

  // Luodaan uusi Note-olio MongoDB:hen tallennettavaksi
  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  // Tallennetaan uusi muistiinpano MongoDB:hen
  note.save()
    .then(savedNote => {
      response.json(savedNote);
    })
});

app.put('/api/notes/:id', (request, response) => {
  const { content, important } = request.body; // Puretaan tarvittavat kentät pyynnön rungosta

  // Varmistetaan, että sisältö on annettu
  if (!content) {
    return response.status(400).json({ error: 'content missing' });
  }

  // Päivitettävä olio
  const note = {
    content: content,
    important: important || false, // Asetetaan tärkeä-arvo, jos se on annettu
  };

  // Päivitetään dokumentti ID:n perusteella
  Note.findByIdAndUpdate(
    request.params.id,  // ID haetaan URL-parametreista
    note,               // Päivityksen tiedot
    { new: true }       // Asetus, joka palauttaa päivitetyn dokumentin
  )
    .then(updatedNote => {
      if (updatedNote) {
        response.json(updatedNote);  // Palautetaan päivitetty dokumentti
      } else {
        response.status(404).end();  // Jos dokumenttia ei löydy
      }
    })
});


const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});

