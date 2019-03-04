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

    parseAndromanLogLine ( line ) {

        const HEAP_SIZE_PARAM_NAME = '// MEMORY USAGE ';

        // get heap size
        const heapStartPosition = line.indexOf(HEAP_SIZE_PARAM_NAME);
        const heap = line.substring( heapStartPosition + HEAP_SIZE_PARAM_NAME.length);
        const trimmedHeap = +heap.replace('MB', '');

        return {
            time: null,
            heap: trimmedHeap,
        };
    },

    parseAdbTopProcessReportLine ( adbReport ) {
        const MEMORY_CONSUMPTION_DATA_INDEX = 6;

        const reportLines = adbReport.split(`\r\n`);
        const resultsLine = reportLines[reportLines.length - 1]; // it is the last line
        const resultsValues = resultsLine.split(' ');
        const trimmedValues = resultsValues.filter(Boolean); // filter out all empty values
        const memoryConsumption = trimmedValues[MEMORY_CONSUMPTION_DATA_INDEX]
        return memoryConsumption.replace('M', ''); // remove 'M' from value
    }
};