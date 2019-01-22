window.CHAMELEON_CHART = (function() {

    const options = {
        responsive: false,
        title: {
            display: true,
            text: 'Chart.js Line Chart'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Month'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Value'
                },
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    };

    let data = [];
    let labels = [];
    let chart;

    const initChart = () => {
        const ctx = document.getElementById('reportChart');
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
				datasets: [{
					label: 'Memory in MB',
					backgroundColor: '#ff0000',
					borderColor: '#0000ff',
					data,
					fill: true,
				}]
			},
            options,
        });
    };

    const setChartData = ( rawData ) => {

        // expects data to be an array of objects { time: [string timestamp], heap: [string] }

        let newLabels = rawData.map( single => _formatDate(single.time) );
        let newData = rawData.map( single => single.heap );

        labels = newLabels;
        data = newData;
    };

    const _formatDate = (timestamp) => {
        const dateObj = new Date(timestamp);
        const formattedDate = (dateObj.getMonth() + 1) + '/' + dateObj.getDate() + '/' +  dateObj.getFullYear() + ' ' + dateObj.getHours() + ':' + dateObj.getMinutes();
        return formattedDate;
    };

    const addChartData = ( newDataObject ) => {
        labels.push(newDataObject.label);
        data.push(newDataObject.value);
    };

    const updateChartView = () => {
        chart.update();
    };

    return {
        setChartData,
        addChartData,
        updateChartView,
        initChart,
    };

}());