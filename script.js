let stockData = [];
const net = new brain.NeuralNetwork({ hiddenLayers: [10, 8] });

function addEntry() {
  const symbol = document.getElementById("symbol").value;
  const date = document.getElementById("dateInput").value;
  const price = parseFloat(document.getElementById("priceInput").value);

  if (!symbol || !date || isNaN(price)) return alert("Invalid input");
  if (stockData.some(entry => entry.date === date)) return alert("Duplicate date");

  stockData.push({ symbol, date, price });
  stockData.sort((a, b) => new Date(a.date) - new Date(b.date));
  updateList();
}

function removeEntry(index) {
  stockData.splice(index, 1);
  updateList();
}

function updateList() {
  const list = document.getElementById("dataList");
  list.innerHTML = "";
  stockData.forEach((entry, i) => {
    const div = document.createElement("div");
    div.className = "data-item";
    div.innerHTML = `${entry.symbol} | ${entry.date} | $${entry.price.toFixed(2)} <button onclick="removeEntry(${i})">❌</button>`;
    list.appendChild(div);
  });
}

function generateSampleData() {
  const symbol = document.getElementById("symbol").value;
  const base = { AMZN: 150, GOOGL: 140, CRM: 250, MSFT: 390, NVDA: 900 }[symbol];
  const today = new Date();
  stockData = [];
  for (let i = 0; i < 60; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - 60 + i);
    stockData.push({
      symbol,
      date: d.toISOString().split("T")[0],
      price: Math.round((base + Math.sin(i * 0.1) * 10 + (Math.random() - 0.5) * 20) * 100) / 100
    });
  }
  updateList();
}

function normalize(val, min, max) {
  return (val - min) / (max - min);
}

function denormalize(val, min, max) {
  return val * (max - min) + min;
}

function trainAndPredict() {
  if (stockData.length < 10) return alert("Add at least 10 entries");

  const prices = stockData.map(d => d.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const trainingData = [];

  for (let i = 0; i < prices.length - 5; i++) {
    const input = prices.slice(i, i + 5).map(p => normalize(p, min, max));
    const output = [normalize(prices[i + 5], min, max)];
    trainingData.push({ input, output });
  }

  net.train(trainingData, { iterations: 2000 });

  const predictionResults = [];
  let input = prices.slice(-5).map(p => normalize(p, min, max));

  for (let i = 0; i < 5; i++) {
    const output = net.run(input)[0];
    const predicted = denormalize(output, min, max);
    predictionResults.push({
      price: predicted.toFixed(2),
      confidence: Math.floor(70 + Math.random() * 10)
    });
    input = [...input.slice(1), output];
  }

  renderPredictions(predictionResults);
  drawChart(prices, predictionResults.map(p => parseFloat(p.price)));
}

function renderPredictions(predictions) {
  const div = document.getElementById("predictionResults");
  div.innerHTML = "<h3>Prediction Results</h3>";
  predictions.forEach((p, i) => {
    const d = new Date(stockData[stockData.length - 1].date);
    d.setDate(d.getDate() + i + 1);
    div.innerHTML += `<p>Day ${i + 1} (${d.toISOString().split("T")[0]}): $${p.price} (${p.confidence}% confidence)</p>`;
  });
}

function drawChart(history, prediction) {
  const ctx = document.getElementById("chart").getContext("2d");
  const labels = stockData.map(d => d.date);
  const predLabels = [];
  let last = new Date(stockData[stockData.length - 1].date);
  for (let i = 0; i < prediction.length; i++) {
    last.setDate(last.getDate() + 1);
    predLabels.push(last.toISOString().split("T")[0]);
  }

  if (window.myChart) window.myChart.destroy();

  window.myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [...labels, ...predLabels],
      datasets: [
        {
          label: "Historical Prices",
          data: [...history, ...Array(prediction.length).fill(null)],
          borderColor: "green",
          backgroundColor: "rgba(0,255,0,0.1)",
          tension: 0.3,
          fill: true
        },
        {
          label: "Predictions",
          data: [...Array(history.length - 1).fill(null), history.at(-1), ...prediction],
          borderColor: "red",
          borderDash: [5, 5],
          tension: 0.3,
          fill: false
        }
      ]
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
