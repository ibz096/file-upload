const express = require('express');
const app = express();
const port = 3000;

const upload = require('./upload');

const appView = __dirname + '/views/index.html';

app.get("/", function(req, res) {
    res.sendFile(appView);
})

app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ message: 'File upload succesfull'});
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});