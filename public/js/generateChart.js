// // Instantiate data sources
// var defaultGraphDataSource = [
// 	[1, 0],
// 	[2, 0],
// 	[3, 0],
// 	[4, 0],
// 	[5, 0],
// 	[6, 0],
// 	[7, 0],
// 	[8, 0],
// 	[9, 0],
// 	[10, 0]	
// ];

// var graphDataSource = [];

// // Manage graph data source
// function manageGraphDataSource(data) {
// 	if (graphDataSource.length == 10) {
// 		graphDataSource.shift();
// 		graphDataSource.push(data);
// 	} else {
// 		graphDataSource.push(data);
// 		console.log('Updated graph data source!');
// 	}
// 	return graphDataSource;
// }

// // Generate chart settings
// function generateChart(dataInput) {
// 	// Manage graph data
// 	var data;
// 	if (dataInput == null) {
// 		console.log('DED');
// 		data = defaultGraphDataSource;
// 	}
// 	else {
// 		data = manageGraphDataSource(dataInput);
// 	}

// 	// Create Graph Data for plotting
// 	var graphData = [{
// 		// Visits
// 		data: data,
// 		color: '#999999'
// 	}];

// 	// Plot line graph
// 	$.plot($('#graph-lines'), graphData, {
// 		series: {
// 			points: {
// 				show: true,
// 				radius: 5
// 			},
// 			lines: {
// 				show: true
// 			},
// 			shadowSize: 0
// 		},
// 		grid: {
// 			color: '#7f8c8d',
// 			borderColor: 'transparent',
// 			borderWidth: 20,
// 			hoverable: true
// 		},
// 		xaxis: {
// 			tickColor: 'transparent'
// 			//tickDecimals: 2
// 		},
// 		yaxis: {
// 			tickSize: 1000
// 		}
// 	});

// 	// Graph Toggle 
// 	$('#graph-bars').hide();

// 	$('#lines').on('click', function (e) {
// 		$('#bars').removeClass('active');
// 		$('#graph-bars').fadeOut();
// 		$(this).addClass('active');
// 		$('#graph-lines').fadeIn();
// 		e.preventDefault();
// 	});

// 	$('#bars').on('click', function (e) {
// 		$('#lines').removeClass('active');
// 		$('#graph-lines').fadeOut();
// 		$(this).addClass('active');
// 		$('#graph-bars').fadeIn().removeClass('hidden');
// 		e.preventDefault();
// 	});

// 	// Tooltip 
// 	function showTooltip(x, y, contents) {
// 		$('<div id="tooltip">' + contents + '</div>').css({
// 			top: y - 16,
// 			left: x + 20
// 		}).appendTo('body').fadeIn();
// 	}

// 	var previousPoint = null;

// 	$('#graph-lines').bind('plothover', function (event, pos, item) {
// 		if (item) {
// 			if (previousPoint != item.dataIndex) {
// 				previousPoint = item.dataIndex;
// 				$('#tooltip').remove();
// 				var x = item.datapoint[0],
// 					y = item.datapoint[1];
// 				showTooltip(item.pageX, item.pageY, y + ' visitors at ' + x + '.00h');
// 			}
// 		} else {
// 			$('#tooltip').remove();
// 			previousPoint = null;
// 		}
// 	});
// }

// Declarations
var chart;
var dataSource = [];
var defaultDataSource = [
	[0, 0],
	[0, 0],
	[0, 0],
	[0, 0],
	[0, 0],
	[0, 0],
	[0, 0],
	[0, 0],
	[0, 0],
	[0, 0]
];

// Generate charts function
function generateChart(dataInput) {
	// Declarations
	var data = manageGraphDataSource(dataInput);
	console.log(data);

	var lineChartData = {
		labels: ["1", "2", "3", "4", "5", "6", "7", "8"],
		datasets: [{
			fillColor: "#fff",
			strokeColor: "#1ABC9C",
			pointColor: "#1ABC9C",
			pointStrokeColor: "#1ABC9C",
			data: data[0][1]
		}]

	};
	new Chart(document.getElementById("soundChart").getContext("2d")).Line(lineChartData);
}

// Manage graph data source
function manageGraphDataSource(data) {
	if (data != null) {
		console.log('Added new data to data source');
		dataSource.push(data);
	}

	if (dataSource.length <= 0) {
		console.log('Default data source');
		return defaultDataSource;
	}

	if (dataSource.length > 10) {
		console.log('Remove first element from data source');
		dataSource.shift();
	}

	return dataSource;
}