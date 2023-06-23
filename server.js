const express = require('express');
const fs = require('fs');
const path = require('path');
let notesDb = require(`./db/db.json`);
const { v4: uuidv4 } = require('uuid');
const { stringify } = require('querystring');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    const data = JSON.parse(fs.readFileSync("./db/db.json", "utf-8"))
    res.status(200).json(data);

});

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    if (title && text) {
      const newNote = {
        title,
        text,
        id: uuidv4(),
      };
  
      fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) {
          console.error(err);
          res.status(500).json('Error in posting note');
        } else {
          const parsedNotes = JSON.parse(data);
          parsedNotes.push(newNote);
  
          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) => {
              if (writeErr) {
                console.error(writeErr);
                res.status(500).json('Error in posting note');
              } else {
                console.info('Successfully updated notes!');
                res.status(200).json('Note successfully saved');
              }
            }
          );
        }
      });
    } else {
      res.status(500).json('Error in posting note');
    }
  });
  
app.delete('/api/notes/:id',(req,res)=>{
    const data = JSON.parse(fs.readFileSync("./db/db.json","utf-8"))
    const filterData =  data.filter(note => note.id !== req.params.id)

    
})


app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
})