const fs = require('fs');
const CONFIG = require('../config');


function getFileExtension (filename) {
    let i = filename.lastIndexOf('.');
    return (i < 0) ? '' : filename.substr(i);
}

module.exports = {

    getSourceReportFilePathsFromArgs (argv) {
        const relativeFileNames = argv.slice(2);
        if ( !relativeFileNames.length ) {
            throw Error('Please enter the name(s) of the report.json file');
        }

        const absoluteFilePaths = relativeFileNames.map( module.exports._getAbsoluteFilePathFromRelative );
        absoluteFilePaths.forEach(module.exports._checkIfFileExists);
        return absoluteFilePaths;
    },

    _getAbsoluteFilePathFromRelative ( relativeFilePath) {
        return (CONFIG.ROOT_DIR + '/' + relativeFilePath);
    },

    _checkIfFileExists (filePath) {
        if (!fs.existsSync(filePath)) {   // check if file exists
            throw Error('File does not exist on this path: ' + filePath);
        }

        return filePath;
    },

    getLinesFromFileContent (fileContent) {
        return fileContent.split('\n')
            .filter( line => line.length);  // filter out empty lines
    },

    _extractLinesFromFile (filePath, lineParser) {
        const contents = fs.readFileSync(filePath, 'utf8');
        const fileExtension = getFileExtension(filePath).toLowerCase();
        switch ( fileExtension ) {
            case '.json':
                return module.exports._extractLinesFromFileJson(contents, lineParser);
            case '.txt': // intentional fall-through
            default:
                return module.exports._extractLinesFromFileTxt(contents, lineParser);
        }
    },

    _extractLinesFromFileTxt (contents, lineParser) {
        const fileLines = module.exports.getLinesFromFileContent(contents);
        const extractedData = fileLines.map( fileLine => lineParser(fileLine) );
        return extractedData;
    },

    _extractLinesFromFileJson (contents, lineParser) {
        const data = JSON.parse(contents);

        const processedData = data.map( singleLine => {
            return {
                time: singleLine.time,
                heap: lineParser(singleLine.report),
            };
        });

        return processedData
    },

    extractDataFromRawFiles (absoluteFilePaths, lineParser) {
        const extractedData = absoluteFilePaths.map( absoluteFilePath => ({
            filePath: absoluteFilePath,
            fileExtractedLineData: module.exports._extractLinesFromFile(absoluteFilePath, lineParser),
        }) );

        return extractedData;
    },
};