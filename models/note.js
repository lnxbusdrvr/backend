const mongoose = require('mongoose')
mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

console.log(`connecting to MongoDB Atlas`);

mongoose.connect(url)
  .then(result => {
    console.log(`connecting to MongoDB`);
  })
  .catch((error) => {
    console.log(`error connecting to MongoDB:${error.message}`);
  });

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

// Muokataan MongoDB:stä saatavaa dataa
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // olio -> stingiksi: _id -> id
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Note', noteSchema);
