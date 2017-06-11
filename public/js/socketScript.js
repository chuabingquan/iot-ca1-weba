var firstTime = true;
var socket = io('http://localhost:3000');

// Initializes socket.IO connection to server
function intializeSocket() {
    // Establish connection
    socket.on('connect', () => {
        console.log('Socket.IO Connected to server!');

        // Initialize default empty chart
        generateChart();

        //On ledChangeEvent
        // socket.on('ledChangeFromPi', (data) => {

        //     if (firstTime) {
        //         var $ledInput = $('#ledSwitch');
        //         var $ledLabel = $('#ledLabel');

        //         data = JSON.parse(data);
        //         console.log('Initial LED Status from socket:', data.status);
        //         if (data.status == 'on') {
        //             $ledInput.prop('checked', true);
        //             $ledLabel.text('On');
        //             console.log('Initial led status: On');
        //         }
        //         else {
        //             $ledInput.prop('checked', false);
        //             console.log('Initial led status: Off');
        //         }

        //         firstTime = false;
        //     }
        // });

        //On publish event
        socket.on('publish', (data) => {
            console.log('Sound data in:', data);

            if (firstTime) {
                var $ledInput = $('#ledSwitch');
                var $ledLabel = $('#ledLabel');

                //data = JSON.parse(data);
                console.log('Initial LED Status from socket:', data.ledStatus);
                if (data.ledStatus == true) {
                    $ledInput.prop('checked', true);
                    $ledLabel.text('On');
                    console.log('Initial led status: On');
                } else {
                    $ledInput.prop('checked', false);
                    $ledLabel.text('Off');
                    console.log('Initial led status: Off');
                }

                firstTime = false;
            }

            // Update Nusiance counter/number of time led is triggered/activated 
            // because people are too loud
            $('#activatedCounter').text(data.activatedCounter);

            //Prepare data for input
            var createdDate = new Date(data.createdAt);
            var dataInput = [createdDate.getHours(), data.value];

            //Pass data to generateChart.js
            generateChart(dataInput);
        });
    });

    //On disconnection from server
    socket.on('disconnect', () => {
        console.log('Disconnected!');
    });
}

// Emit function
function emitSocket(event, payload) {
    socket.emit(event, payload);
}