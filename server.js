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
    res.json(`${req.method} request received to add a note`);

    const {title,text} = req.body;
    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuidv4(),
        };


        fs.readFile('./db/db.json', 'utf-8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                const parsedNotes = JSON.parse(data);

                parsedNotes.push(newNote);

                fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4),
                    (writeErr) =>
                        writeErr
                            ? console.error(writeErr)
                            : console.info('Successfully updated notes!')
                );
            }
        });

        ;


        res.status(200)
    } else {
        res.status(500).json('Error in posting note');
    }



});



app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
})