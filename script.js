const net = new window.brain.NeuralNetwork({ hiddenLayers: [4] });

const weeklyPrices = [
  { label: "4th Week", price: 3100 },
  { label: "3rd Week", price: 3125 },
  { label: "2nd Week", price: 3150 },
  { label: "1st Week", price: 3180 }
];

const min = Math.min(...weeklyPrices.map(p => p.price));
const max = Math.max(...weeklyPrices.map(p => p.price));

function normalize(val, min, max) {
  return (val - min) / (max - min);
}

function denormalize(val, min, max) {
  return val * (max - min) + min;
}

function trainAndPredict() {
  const trainingData = [{
    input: weeklyPrices.slice(0, 3).map(p => normalize(p.price, min, max)),
    output: [normalize(weeklyPrices[3].price, min, max)]
  }];

  net.train(trainingData, {
    iterations: 2000,
    errorThresh: 0.005,
    log: false
  });

  const input = weeklyPrices.slice(1).map(p => normalize(p.price, min, max));
  const output = net.run(input);
  const predictedPrice = denormalize(output[0], min, max);

  document.getElementById("prediction").innerText =
    "Predicted price for next week: ₹" + predictedPrice.toFixed(2);

  drawChart(predictedPrice);
}

function drawChart(predictedPrice) {
  const ctx = document.getElementById("chart").getContext("2d");
  const labels = weeklyPrices.map(p => p.label).concat("Predicted Week");
  const prices = weeklyPrices.map(p => p.price).concat(predictedPrice);

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Amazon Weekly Price",
        data: prices,
        borderColor: "blue",
        fill: false,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}
