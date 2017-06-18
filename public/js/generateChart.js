// Declarations
var chart;
var defaultDataSource = [
	[0, 0],
	[0, 0],
	[0, 0],
	[0, 0],
	[0, 0],
	[0, 0],
	[0, 0],
	[0, 0]
];

// Data Source
var dataSource = {
	labels: [],
	datasets: [{
		fillColor: "rgba(41, 219, 183, 0.4)",
		strokeColor: "#1ABC9C",
		pointColor: "#1ABC9C",
		pointStrokeColor: "#1ABC9C",
		data: [0]
	}]
};

// Extra options
var options = {
	animation: false
}

// Generate charts function
function loadChart() {
	console.log(dataSource);
	chart = new Chart(document.getElementById("soundChart").getContext("2d"));
	chart.Line(dataSource, options);
};

// Update chart when new data comes in
function updateChartData(newData) {
	var labels = dataSource.labels;
	var dataset = dataSource.datasets[0].data;

	labels.push(newData[0]);
	if (labels.length > 8) {
		labels.shift();
	}

	dataset.push(newData[1]);
	if (dataset.length > 8) {
		dataset.shift()
	}
	chart.Line(dataSource, options);
}