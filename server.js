const express = require('express');
const DefaultAzureCredential = require('@azure/identity');
const { PrismaClient } = require('@prisma/client');
const app = express();
const port = process.env.PORT || 3000;

const uploadStrategy = require('./upload');
const azureUpload = require('./azure');
const getStream = require('into-stream');
const prisma = new PrismaClient();

const appView = __dirname + '/views/index.html';

app.get("/", function (req, res) {
    res.sendFile(appView);
})

app.post('/upload', uploadStrategy.single('file'), (req, res) => {
    //Update this upload the data from the form
    const fileName = req.file.originalname
    const stream = getStream(req.file.buffer)
    const streamLength = req.file.buffer.length

    azureUpload(fileName, stream, streamLength)
        .then(
            async function (result) {
                //Destructing the result {value1: renamedValue1, value2: renamedValue2} = result
                const { blobName: newFileName, blobUrlSAS: blobUrl } = result
                const fileUpload = await prisma.file.create({
                    data: {
                        filename: fileName,
                        newfilename: newFileName,
                        link: blobUrl,
                    },
                })
                console.log(`Newfile Name: ${newFileName}`);
                console.log(`BlobSASURL Name: ${blobUrl}`);

                console.log("Done")

                // Send blobUrl in the response
                res.json({
                    message: 'File upload successful',
                    blobUrl: blobUrl,
                });
            }
        )
        .catch((ex) => {
            console.log(ex.message);
            res.status(500).json({ message: 'File upload failed' });
        });

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});