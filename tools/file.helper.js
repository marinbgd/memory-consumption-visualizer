const fs = require('fs');
const CONFIG = require('../config');

module.exports = {

    parseTextLine ( textline ) {

        const TIME_PARAM_NAME = 'time: ';
        const PARAM_DELIMITER = ' //';
        const HEAP_SIZE_PARAM_NAME = 'usedJSHeapSize: ';
    
        //get time
        const timeStartPosition = textline.indexOf(TIME_PARAM_NAME);
        const timeEndPosition = textline.indexOf(PARAM_DELIMITER);
        const time = textline.substring( timeStartPosition + TIME_PARAM_NAME.length, timeEndPosition );
    
        // get heap size
        const heapStartPosition = textline.indexOf(HEAP_SIZE_PARAM_NAME);
        const heap = textline.substring( heapStartPosition + HEAP_SIZE_PARAM_NAME.length);
        const trimmedHeap = +heap.replace('MB', '');
    
        return {
            time: new Date(time).getTime(),
            heap: trimmedHeap,
        };
    },

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