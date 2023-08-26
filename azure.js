const { BlobServiceClient } = require("@azure/storage-blob");
const { v1: uuidv1 } = require("uuid");
require("dotenv").config();
const { DefaultAzureCredential } = require('@azure/identity');

async function azureUpload(fileName, stream, streamLength) {
    try {
        console.log("Azure Blob storage v12 - JavaScript quickstart sample");

        // Quick start code goes here
        const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
        if (!accountName) throw Error('Azure Storage accountName not found');

        const blobServiceClient = new BlobServiceClient(
            `https://${accountName}.blob.core.windows.net`,
            new DefaultAzureCredential()
        );

        // Create a unique name for the container
        // const containerName = 'quickstart' + uuidv1();
        const containerName = 'quickstart6d8de930-4150-11ee-9e5f-2564f37132ab';

        // console.log('\nCreating container...');
        console.log('\t', containerName);

        // Get a reference to a container
        const containerClient = blobServiceClient.getContainerClient(containerName);
        // Create the container
        // const createContainerResponse = await containerClient.create();
        // console.log(
        //     `Container was created successfully.\n\trequestId:${createContainerResponse.requestId}\n\tURL: ${containerClient.url}`
        // );

        // Create a unique name for the blob
        const blobName = uuidv1() + '-' + fileName;

        // Get a block blob client
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Display blob name and url
        console.log(
            `\nUploading to Azure storage as blob\n\tname: ${blobName}:\n\tURL: ${blockBlobClient.url}`
        );

        // Upload data to the blob
        const uploadBlobResponse = await blockBlobClient.uploadStream(stream, streamLength);
        console.log(
            `Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`
        );



    } catch (err) {
        console.error(`Error: ${err.message}`);
    }
}

module.exports = azureUpload;