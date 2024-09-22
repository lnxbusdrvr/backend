const express = require('express');
const morgan = require('morgan');
const app = express();
require('dotenv').config();

const Note = require('./models/note');
app.use(express.static('dist'));

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const errorsHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const nonExistUrlHandler = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const cors = require('cors');
app.use(cors());
app.use(express.json());

morgan.token('data', (request, response) => {
  return JSON.stringify(request.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));

app.use(requestLogger);

app.get('/', (request, response) => {
  Note.find({}).then(notes => {
    respons.send('<h1>Hello Internet!</h1>');
  })
});

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
});

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
});

app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
});

app.post('/api/notes', (request, response, next) => {
  const body = request.body;

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
    .catch(error => next(error)) //-> virheenkäsittelijälle
});

app.put('/api/notes/:id', (request, response, next) => {
  const { content, number } = request.body;

  /* Päivitetään dokumentti ID:n perusteella
   * ID haetaan URL-parametreista
   * note = Päivityksen tiedot
   * { new, true }  Asetus, joka palauttaa päivitetyn dokumentin
   */
  Note
    .findByIdAndUpdate(
      request.params.id,
      { content, number },
      { new: true, runValidators: true, context: 'query' })
    .then(updatedNote => {
      response.json(updatedNote);
    })
    .catch(error => next(error));
});

// tämä tulee kaikkien muiden middlewarejen ja routejen rekisteröinnin jälkeen!
app.use(nonExistUrlHandler);
app.use(errorsHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});

