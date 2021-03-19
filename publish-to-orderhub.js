const request = require('request');
const fs = require('fs-extra');
const archiver = require('archiver');

const FEATURES_JSON_FILE_NAME = './features.json';
const BUILD_OUTPUT_DIRECTORY = './dist';
const TEMP_DIR = './tmp';
const ASSET_ZIP_FILE = `${TEMP_DIR}/assets.zip`;
const appName = process.env.APP_NAME || '';
const clientId = process.env.CLIENT_ID || '';
const clientSecret = process.env.CLIENT_SECRET || '';
const orderHubHostName = process.env.ORDER_HUB_HOSTNAME || 'https://app.omsbusinessusercontrols.ibm.com'
const proxyHost = process.env.PROXY_HOST_AND_PORT || null;

function validateUsage() {
    if(clientId === '') {
        console.error("Missing environment variable CLIENT_ID");
        process.exit(-1);
    }
    
    if(clientSecret === '') {
        console.error('Missing environment variable CLIENT_SECRET');
        process.exit(-1);
    }

    if(appName === '') {
        console.error('Missing environment variable APP_NAME');
        process.exit(-1);
    }
    
}

function preparePackageForUpload(resolve) {
    const uploadDir = `${TEMP_DIR}/upload`;

    // delete the upload directory if it existed previously.
    fs.existsSync(uploadDir) && fs.removeSync(uploadDir);

    // create the desired folder structure
    fs.mkdirSync(`${uploadDir}/assets`, {recursive: true});
    
    // copy features.json to dist folder
    fs.copyFileSync(FEATURES_JSON_FILE_NAME, `${uploadDir}/${FEATURES_JSON_FILE_NAME}`);
    
    // move the built UI assets into the assets folder under upload
    fs.renameSync(`${BUILD_OUTPUT_DIRECTORY}/${appName}`, `${uploadDir}/assets/${appName}`);

    const assetZipStream = fs.createWriteStream(ASSET_ZIP_FILE);
    assetZipStream.on('close', () => {
        console.log('Created assets.zip for uploading');
        resolve();
    });

    const zip = archiver.create('zip', { zlib: { level: 9 } });
    zip.on('error', function(err) {
        console.error('Failed to create assets.zip file', err);
        throw err;
    });

    zip.pipe(assetZipStream);
    zip.directory(`${uploadDir}`, false);
    zip.finalize();
}

function publishToOrderHub() {
    const assetZip = fs.createReadStream(ASSET_ZIP_FILE);

    const form = {
        assets: {
            value:  assetZip,
            options: {
                filename: 'assets.zip',
                contentType: 'application/x-zip-compressed'
            }
        }
    };

    console.log('Uploading to OrderHub');
    
    request.post( `${orderHubHostName}/cw/spi/resources/customization/assets/upload`,
        {
          headers: {
            'x-ibm-client-id': clientId,
            'x-ibm-client-secret': clientSecret
          },
          proxy: proxyHost,
          formData: form
        },
        (err, response, body) => {
            if (err) {
                return console.error('upload failed:', err);
            }
            if (response.statusCode >= 200 && response.statusCode < 300) {
                console.log('No errors encountered; status: %o', response.statusCode);
            } else {
                console.log('Upload was not successful; status: %o', response.statusCode);
            }
            if(body){
                console.log('Server responded with:', body);
            }
        }
    );
}

async function main() {
    validateUsage();

    await new Promise(resolve => preparePackageForUpload(resolve))
        .then(publishToOrderHub);
}

main();