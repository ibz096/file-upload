const { 
    BlobServiceClient,
    generateAccountSASQueryParameters, 
    AccountSASPermissions, 
    AccountSASServices,
    AccountSASResourceTypes,
    StorageSharedKeyCredential,
    SASProtocol 
} = require("@azure/storage-blob");
const { v1: uuidv1 } = require("uuid");
require("dotenv").config();
const { DefaultAzureCredential } = require('@azure/identity');

const constants = {
    accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME,
    accountKey: process.env.AZURE_STORAGE_ACCOUNT_KEY,
    containerName: process.env.AZURE_STORAGE_ACCOUNT_CONTAINER_NAME
};

const sharedKeyCredential = new StorageSharedKeyCredential(
    constants.accountName,
    constants.accountKey
);

async function createAccountSas() {

    const sasOptions = {

        services: AccountSASServices.parse("b").toString(),          // blobs, tables, queues, files
        resourceTypes: AccountSASResourceTypes.parse("o").toString(), // service, container, object
        permissions: AccountSASPermissions.parse("r"),          // permissions
        protocol: SASProtocol.Https,
        startsOn: new Date(),
        expiresOn: new Date(new Date().valueOf() + (10 * 60 * 1000)),   // 10 minutes
    };

    const sasToken = generateAccountSASQueryParameters(
        sasOptions,
        sharedKeyCredential 
    ).toString();

    console.log(`From Function CreateAccountSAS(): sasToken = '${sasToken}'\n`);

    // prepend sasToken with `?`
    return (sasToken[0] === '?') ? sasToken : `?${sasToken}`;
}

async function useSasToken(sasToken, containerName, blobName) {

    // Use SAS token to create authenticated connection to Blob Service
    const blobUrl = `https://${constants.accountName}.blob.core.windows.net/${containerName}/${blobName}${sasToken}`
    console.log(`From Fucntions useSasToken(): ${blobUrl}`);

    return blobUrl
    
    // const blobServiceClient = new BlobServiceClient(blobUrl);

    // // Get Blob Service properties
    // const blobServicePropertiesResponse = await blobServiceClient.getProperties();

    // // Display Blob Service properties
    // console.log(`Success: Properties ${JSON.stringify(blobServicePropertiesResponse)}\n`);


}

async function azureUpload(fileName, stream, streamLength) {
    try {
        console.log("Azure Blob storage v12 - JavaScript quickstart sample");

        // Quick start code goes here
        const accountName = constants.accountName;
        if (!accountName) throw Error('Azure Storage accountName not found');

        const blobServiceClient = new BlobServiceClient(
            `https://${accountName}.blob.core.windows.net`,
            new DefaultAzureCredential()
        );

        // Create a unique name for the container
        // const containerName = 'quickstart' + uuidv1();
        const containerName = constants.containerName;

        // console.log('\nCreating container...');
        console.log('\t', containerName);

        // Get a reference to a container
        const containerClient = blobServiceClient.getContainerClient(containerName);
        
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

        //Create SAS Token
        const sasToken = await createAccountSas();

        const blobUrlSAS = await useSasToken(sasToken, containerName, blobName);
        console.log(`BlobURL: ${blobUrlSAS}`);

        const result = {blobName, blobUrlSAS};

        return result

    } catch (err) {
        console.error(`Error: ${err.message}`);
    }
}

module.exports = azureUpload;