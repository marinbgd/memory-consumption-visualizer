const fs = require('fs');
const CONFIG = require('../config');

module.exports = {

    getSourceReportFilePathFromArgs (argv) {
        const args = argv.slice(2);
        if (
            !args.length ||
            !args[0].length
        ) {
            throw Error('Please enter the name of the report.json file');
        }
        const reportFileName = args[0];
        const reportFilePath = CONFIG.ROOT_DIR + '/' + reportFileName;

        if (!fs.existsSync(reportFilePath)) {   // check if file exists
            throw Error('File does not exist on this path: ' + reportFilePath);
        }

        return reportFilePath;
    },

    getLinesFromFileContent (fileContent) {
        return fileContent.split('\n')
            .filter( line => line.length);  // filter out empty lines
    },

    processRawTxtFileLines (filePath, lineParser) {
        const contents = fs.readFileSync(filePath, 'utf8');
        const fileLines = module.exports.getLinesFromFileContent(contents);
        const extractedData = fileLines.map( fileLine => lineParser(fileLine) );
        return extractedData;
    },
};