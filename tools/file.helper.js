const fs = require('fs');
const CONFIG = require('../config');

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
        const fileLines = module.exports.getLinesFromFileContent(contents);
        const extractedData = fileLines.map( fileLine => lineParser(fileLine) );
        return extractedData;
    },

    extractDataFromRawFiles (absoluteFilePaths, lineParser) {
        const extractedData = absoluteFilePaths.map( absoluteFilePath => ({
            filePath: absoluteFilePath,
            fileExtractedLineData: module.exports._extractLinesFromFile(absoluteFilePath, lineParser),
        }) );

        return extractedData;
    },
};