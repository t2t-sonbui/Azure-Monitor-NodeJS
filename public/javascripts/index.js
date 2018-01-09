$(document).ready(function() {
  var timeData = [],
    temperatureData = [],
    water_temperatureData = [],
    humidityData = [];
  var data = {
    labels: timeData,
    datasets: [{
        fill: false,
        label: 'Temperature',
        yAxisID: 'Temperature',
        borderColor: "rgba(255, 204, 0, 1)",
        pointBoarderColor: "rgba(255, 204, 0, 1)",
        backgroundColor: "rgba(255, 204, 0, 0.4)",
        pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
        pointHoverBorderColor: "rgba(255, 204, 0, 1)",
        data: temperatureData
      },
      {
        fill: false,
        label: 'Water Temperature',
        yAxisID: 'Temperature',
        borderColor: "rgba(255,20,0,1)",
        pointBoarderColor: "rgba(255,20,0,1)",
        backgroundColor: "rgba(255,20,0,0.4)",
        pointHoverBackgroundColor: "rgba(255,20,0, 1)",
        pointHoverBorderColor: "rgba(255,20,0, 1)",
        data: water_temperatureData
      },
      {
        fill: false,
        label: 'Humidity',
        yAxisID: 'Humidity',
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
        data: humidityData
      }
    ]
  }
  // var water_data = {
  //   labels: timeData,
  //   datasets: [{
  //     fill: false,
  //     label: 'Temperature',
  //     yAxisID: 'Temperature',
  //     borderColor: "rgba(255, 204, 0, 1)",
  //     pointBoarderColor: "rgba(255, 204, 0, 1)",
  //     backgroundColor: "rgba(255, 204, 0, 0.4)",
  //     pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
  //     pointHoverBorderColor: "rgba(255, 204, 0, 1)",
  //     data: water_temperatureData
  //   }]
  // }

  var basicOption = {
    scaleOverride : true,
    scaleSteps : 10,
    scaleStepWidth : 10,
    scaleStartValue : 0,
    title: {
      display: true,
      text: 'Temperature & Humidity Real-time Data',
      fontSize: 36
    },
    scales: {
      yAxes: [
        // {
        //   id: 'Temperature',
        //   type: 'linear',
        //   scaleLabel: {
        //     labelString: 'Temperature(C)',
        //     display: true
        //   },
        //   position: 'left',
        // },
        {
          //id: 'Water Temperature',
          id: 'Temperature',
          type: 'linear',
          scaleLabel: {
            labelString: 'Temperature(C)',
            display: true
          },
          position: 'left',
          ticks: {
                    beginAtZero:true
                }
        }, {
          id: 'Humidity',
          type: 'linear',
          scaleLabel: {
            labelString: 'Humidity(%)',
            display: true
          },
          position: 'right',
          ticks: {
                    beginAtZero:true
                }
        }
      ]
    }
  }
  // var basicOption2 = {
  //   title: {
  //     display: true,
  //     text: 'Water Temperature Data',
  //     fontSize: 36
  //   },
  //   scales: {
  //     yAxes: [{
  //       id: 'Temperature',
  //       type: 'linear',
  //       scaleLabel: {
  //         labelString: 'Temperature(C)',
  //         display: true
  //       },
  //       position: 'left',
  //     }]
  //   }
  // }

  //Get the context of the canvas element we want to select
  var ctx = document.getElementById("myChart").getContext("2d");
  // var ctx2 = document.getElementById("waterChart").getContext("2d");
  var optionsNoAnimation = {
    animation: false
  }
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: basicOption
  });
  // var waterLineChart = new Chart(ctx2, {
  //   type: 'line',
  //   data: water_data,
  //   options: basicOption2
  // });

  var ws = new WebSocket('wss://' + location.host);
  ws.onopen = function() {
    console.log('Successfully connect WebSocket');
  }
  ws.onmessage = function(message) {
    console.log('receive message' + message.data);
    try {
      var obj = JSON.parse(message.data);
      if (!obj.time || !obj.temperature || !obj.water_temperature) {
        return;
      }
      timeData.push(obj.time);
      temperatureData.push(obj.temperature);
      water_temperatureData.push(obj.water_temperature);
      // only keep no more than 50 points in the line chart
      const maxLen = 50;
      var len = timeData.length;
      if (len > maxLen) {
        timeData.shift();
        temperatureData.shift();
        water_temperatureData.shift();
      }

      if (obj.humidity) {
        humidityData.push(obj.humidity);
      }
      if (humidityData.length > maxLen) {
        humidityData.shift();
      }

      myLineChart.update();
      // waterLineChart.update();
    } catch (err) {
      console.error(err);
    }
  }
});
