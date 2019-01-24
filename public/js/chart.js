window.CHAMELEON_CHART = (function () {

    var COLORS = [
        {
            backgroundColor: 'rgb(2,224,154,0.5)',
            borderColor: '#aa038e',
        },
        {
            backgroundColor: 'rgb(170,3,142,0.5)',
            borderColor: '#02e09a',
        },
        {
            backgroundColor: 'rgb(0,160,18,0.5)',
            borderColor: '#909e00',
        },
        {
            backgroundColor: 'rgb(87,115,186,0.5)',
            borderColor: '#6b8fea',
        },
        {
            backgroundColor: 'rgb(122,86,14,0.5)',
            borderColor: '#7a000e',
        },
        {
            backgroundColor: 'rgb(183,20,20,0.5)',
            borderColor: '#7a560e',
        },
        {
            backgroundColor: 'rgb(26,33,173,0.5)',
            borderColor: '#ce0404',
        },
    ];

    var options = {
        responsive: true,
        maintainAspectRatio: false,
        title: {
            display: true,
            text: 'Time Mode'
        },
        tooltips: {
            display: true,
            mode: 'nearest',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                type: 'time',
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'MB'
                },
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    };

    var DATASET = {
        label: 'Memory in MB',
        backgroundColor: '#02e09a',
        borderColor: '#aa038e',
        data: [],
        fill: true,
    };

    var chart = null;
    var labels = [];
    var datasets = [];
    var isTimeMode = true;
    var lastRawData = null;
    var ctx = null;

    var initChart = function () {
        if (!ctx) {
            ctx = document.getElementById('reportChart');
            ctx.height = _getChartHeight();
        }

        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
        }


        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets,
            },
            options,
        });
    };

    var _getChartHeight = function () {
        return Math.round(innerHeight - (0.1 * innerHeight));
    };

    var _createTimeDataSetFromSingleRawData = function (singleRawData) {
        var dataset = Object.assign({}, DATASET);
        var randomColors = _getRandomColorsForChart(COLORS);
        dataset.data = singleRawData.fileExtractedLineData.map(_processSingleExtractedDataForTimeChart);
        dataset.label = _extractFileNameFromFilePath(singleRawData.filePath);
        dataset.backgroundColor = randomColors.backgroundColor;
        dataset.borderColor = randomColors.borderColor;
        return dataset;
    };

    var _createNumericDataSetFromSingleRawData = function (singleRawData) {
        var dataset = Object.assign({}, DATASET);
        var randomColors = _getRandomColorsForChart(COLORS);
        dataset.data = singleRawData.fileExtractedLineData.map((line, index) => _processSingleExtractedDataForNumericChart(line, index));
        dataset.label = _extractFileNameFromFilePath(singleRawData.filePath);
        dataset.backgroundColor = randomColors.backgroundColor;
        dataset.borderColor = randomColors.borderColor;
        return dataset;
    };

    var _extractFileNameFromFilePath = function (filePath) {
        return filePath.replace(/^.*[\\\/]/, '');
    };

    var _processSingleExtractedDataForTimeChart = function (single) {
        return {
            x: single.time,
            y: single.heap,
        };
    };

    var _processSingleExtractedDataForNumericChart = function (singleLine, index) {
        return {
            x: index + 1,
            y: singleLine.heap,
        };
    };

    var setChartDataOnXTimeAxis = function (rawData) {

        //create dataset for each "filename" from rawData
        datasets = rawData.map(_createTimeDataSetFromSingleRawData);
        labels = _getTimeLabelsFromRawData(rawData);
    };

    var setChartDataOnXNumericAxis = function (rawData) {

        //create dataset for each "filename" from rawData
        datasets = rawData.map(_createNumericDataSetFromSingleRawData);
        labels = _getNumericLabelsFromRawData(rawData);
    };

    var _getTimeLabelsFromRawData = function (rawData) {
        var labelsArrays = rawData.map(singleData => {
            return singleData.fileExtractedLineData.map(line => line.time);
        });
        var labels = [].concat.apply([], labelsArrays);   // join all labelsArrays to 1
        var uniqueLabels = _.uniq(labels);
        return uniqueLabels.sort();
    };

    var _getNumericLabelsFromRawData = function (rawData) {
        var dataOccurrences = rawData.map(singleData => {
            return singleData.fileExtractedLineData.length;
        });

        var maxDataOccurrences = Math.max.apply(null, dataOccurrences);
        var i = 0;
        var labels = [];
        for (i; i < maxDataOccurrences; i += 1) {
            labels.push((i + 1) + '. record');
        }

        return labels;
    };

    var _getRandomColorsForChart = function (colorsArr) {
        var colorLength = colorsArr.length;
        var randomColorsIndex = Math.floor(Math.random() * colorLength);
        return colorsArr[randomColorsIndex];
    };

    var updateChartView = function () {
        chart.update();
    };

    var _setOptionsAccordingToTimeMode = function (isTimeModeOn) {
        if (isTimeModeOn) {
            options.title.text = 'Time Mode';
            options.scales.xAxes = [{
                display: true,
                type: 'time',
            }];
        } else {
            options.title.text = 'Occurrences Mode';
            options.scales.xAxes = [{
                display: true,
            }];
        }
    };

    var toggleTimeMode = function () {
        isTimeMode = !isTimeMode;

        setChartData(lastRawData);
        initChart();
    };

    var setChartData = function (rawData) {

        //cache rawData
        lastRawData = _.cloneDeep(rawData);

        _setOptionsAccordingToTimeMode(isTimeMode);

        if (isTimeMode) {
            setChartDataOnXTimeAxis(rawData);
        } else {
            setChartDataOnXNumericAxis(rawData);
        }
    };

    return {
        setChartData,
        updateChartView,
        toggleTimeMode,
        initChart,
    };

}());