import 'dotenv/config'

import express from 'express';
import getStream from 'into-stream';
import { PrismaClient } from '@prisma/client';
import uploadStrategy from './upload.js';
import * as AzureService from './azure.js';

const app = express();
const port = process.env.PORT || 3000;

const azure = await AzureService.create()

const prisma = new PrismaClient({
    datasourceUrl: await azure.fetchSecretFromAzureKeyVault('SQLCONNSTR-DATABASE-URL')
});

const __dirname = new URL('.', import.meta.url).pathname;

const appView = __dirname + '/public/views/index.html';

app.use(express.static('public'));

app.get("/", function (req, res) {
    res.sendFile(appView);
})

app.get("/results", async function (req, res) {
    const records = await prisma.file.findMany()
    res.json(records)
})

app.post('/upload', uploadStrategy.single('file'), async (req, res) => {
    //Update this upload the data from the form
    const fileName = req.file.originalname
    const stream = getStream(req.file.buffer)
    const streamLength = req.file.buffer.length

    try {
        const result = await azure.upload(fileName, stream, streamLength)

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

    } catch (ex) {
        console.log(ex.message);
        res.status(500).json({ message: 'File upload failed' });
    }

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});