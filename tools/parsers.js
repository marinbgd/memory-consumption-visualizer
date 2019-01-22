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
};