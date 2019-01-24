( function () {

    var initializeApp = function () {
        setEventListeners();
        showChart();
    };

    var setEventListeners = function () {
        var ignoreButtonElement = document.getElementById('ignoreTimeButton');
        ignoreButtonElement.addEventListener('click', ignoreButtonClickHandler);
    };

    var ignoreButtonClickHandler = function (event) {
        event.preventDefault();
        window.CHAMELEON_CHART.toggleTimeMode();
    };

    var showChart = function () {
        var rawReportData = document.getElementById('report-data').value;
        var reportData = JSON.parse(rawReportData);
        window.CHAMELEON_CHART.setChartData( reportData );
        window.CHAMELEON_CHART.initChart();
    };

    initializeApp();

} ());
