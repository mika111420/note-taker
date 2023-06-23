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
    res.sendFile(path.join(__dirname,'/public/notes.html'));
  });
  
  app.get('/api/notes', (req, res) => {
    const data = JSON.parse(fs.readFileSync("./db/db.json", "utf-8"))
    res.status(200).json(data);
  
  });

  app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
  })