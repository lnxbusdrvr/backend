const mongoose = require('mongoose')
require('dotenv').config();

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false)
mongoose.connect(url)


const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'GET and POST are the most important methods of HTTP protocol.',
  important: true,
})


//
note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
//
/*
Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
});
*/
