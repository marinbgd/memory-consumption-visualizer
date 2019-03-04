const fs = require('fs');
// const parseTextLine = require('./tools/parsers.js').parseTextLine;
const parseTextLine = require('./tools/parsers.js').parseAndromanLogLine;
const getSourceReportFilePathsFromArgs = require('./tools/file.helper.js').getSourceReportFilePathsFromArgs;
const processRawTxtFilesLines = require('./tools/file.helper.js').extractDataFromRawFiles;

const ncp = require('ncp').ncp;
const rimraf = require('rimraf');
const Handlebars = require('handlebars');
const CONFIG = require('./config');

const BUILD_FOLDER = 'build';
const PUBLIC_FOLDER = 'public';
const TEMPLATE_FILE_LOCATION = CONFIG.ROOT_DIR + '/templates/template.hbs';


async function clearBuildFolder() {
    return new Promise( (resolve, reject) => {
        if (!fs.existsSync(BUILD_FOLDER)){
            fs.mkdirSync(BUILD_FOLDER);
        }

        rimraf(CONFIG.ROOT_DIR + '/build/*',  () => {
            console.log('Cleared build folder.');
            resolve();
        } );
    });
}

function getCompiledTemplate (jsonData) {
    const templateSource = fs.readFileSync(TEMPLATE_FILE_LOCATION, 'utf8');
    const template = Handlebars.compile(templateSource);
    const output = template( { report: JSON.stringify(jsonData) } );
    return output;
}

function copyBuildFiles () {
    const source = CONFIG.ROOT_DIR + '/' + PUBLIC_FOLDER;
    const buildDestination = CONFIG.ROOT_DIR + '/' + BUILD_FOLDER;
    ncp.limit = 16;
    ncp(source, buildDestination, (err) => {
        if (err) {
            return console.error(err);
        }
        console.log('Build created.');
    });
}

function createFileFromString (filePath, stringContent) {
    fs.writeFileSync(filePath, stringContent);
}

async function start() {
    try {
        const reportFilePaths = getSourceReportFilePathsFromArgs(process.argv);
        await clearBuildFolder();
        const jsonReports = processRawTxtFilesLines(reportFilePaths, parseTextLine);
        const htmlString = getCompiledTemplate(jsonReports);
        createFileFromString(__dirname + '/' + BUILD_FOLDER + '/' + 'index.html', htmlString);
        copyBuildFiles();

    } catch (error) {
        console.log(error)
    }
}

start()
    .then( success => console.log)
    .catch( error => console.error);
