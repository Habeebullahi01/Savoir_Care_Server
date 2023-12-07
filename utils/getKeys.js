// Imports the Google Cloud client library
const { Storage, TransferManager } = require("@google-cloud/storage");
const fs = require("fs");
const path = require("path");
// The ID of your GCS bucket
const bucketName = "e-store-1";

// The ID of your GCS file
const fileName1 = "auth-keys/pub_key.pem";
const fileName2 = "auth-keys/priv_key.pem";

const fileList = [fileName1, fileName2];

// Creates a client
const storage = new Storage();

async function downloadManyFiles() {
  //   // Downloads the files
  fileList.forEach((file) => {
    const options = {
      destination: "/tmp/" + path.basename(file),
    };

    storage
      .bucket(bucketName)
      .file(file)
      .download(options)
      .then(() => {
        console.log(
          `gs://${bucketName}/${file} downloaded to ${path.basename(file)}.`
        );
      });
  });
}

downloadManyFiles().catch(console.error);
