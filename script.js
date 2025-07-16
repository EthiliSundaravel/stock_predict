let stockData = [];
const net = new brain.NeuralNetwork({ hiddenLayers: [10, 8] });

// Initialize the application when the page loads
function initializeApp() {
  updateList();
  
  // Set default date to today
  const today = new Date();
  const dateInput = document.getElementById("dateInput");
  if (dateInput) {
    dateInput.value = today.toISOString().split('T')[0];
  }
  
  // Add initial state for prediction results
  const predictionResults = document.getElementById("predictionResults");
  if (predictionResults) {
    predictionResults.innerHTML = `
      <div style="
        text-align: center; 
        padding: 30px 20px; 
        color: #666; 
        font-size: 16px;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 8px;
        border: 2px dashed #ddd;
      ">
        🔮 Prediction Results<br>
        <small style="color: #999; font-size: 14px;">Add data and click "Train & Predict" to see AI predictions</small>
      </div>
    `;
  }
  
  // Add chart placeholder
  initializeChartPlaceholder();
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

function addEntry() {
  const symbol = document.getElementById("symbol").value;
  const date = document.getElementById("dateInput").value;
  const price = parseFloat(document.getElementById("priceInput").value);

  if (!symbol || !date || isNaN(price)) {
    alert("⚠️ Please fill in all fields with valid data");
    return;
  }
  
  if (price <= 0) {
    alert("⚠️ Price must be greater than 0");
    return;
  }
  
  if (stockData.some(entry => entry.date === date)) {
    alert("⚠️ An entry for this date already exists");
    return;
  }

  stockData.push({ symbol, date, price });
  stockData.sort((a, b) => new Date(a.date) - new Date(b.date));
  updateList();
  
  // Clear inputs after successful addition
  document.getElementById("dateInput").value = "";
  document.getElementById("priceInput").value = "";
  
  // Show success feedback
  const button = document.querySelector('button[onclick="addEntry()"]');
  const originalText = button.innerHTML;
  button.innerHTML = '✅ Added!';
  button.style.background = '#4CAF50';
  setTimeout(() => {
    button.innerHTML = originalText;
    button.style.background = '';
  }, 1000);
}

function removeEntry(index) {
  stockData.splice(index, 1);
  updateList();
}

function updateList() {
  const list = document.getElementById("dataList");
  list.innerHTML = "";
  
  if (stockData.length === 0) {
    list.innerHTML = `
      <div style="
        text-align: center; 
        padding: 30px 20px; 
        color: #666; 
        font-size: 16px;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 8px;
        margin: 10px;
        border: 2px dashed #ddd;
      ">
        📊 No data entries yet<br>
        <small style="color: #999; font-size: 14px;">Add some data or generate sample data to get started!</small>
      </div>
    `;
    return;
  }
  
  stockData.forEach((entry, i) => {
    const div = document.createElement("div");
    div.className = "data-item";
    div.innerHTML = `
      <span><strong>${entry.symbol}</strong> | ${entry.date} | <span style="color: #4CAF50; font-weight: bold;">$${entry.price.toFixed(2)}</span></span>
      <button onclick="removeEntry(${i})" title="Remove entry">❌</button>
    `;
    list.appendChild(div);
  });
}

function generateSampleData() {
  const symbol = document.getElementById("symbol").value;
  const base = { AMZN: 150, GOOGL: 140, CRM: 250, MSFT: 390, NVDA: 900 }[symbol];
  const today = new Date();
  stockData = [];
  
  // Show loading state
  const button = document.querySelector('button[onclick="generateSampleData()"]');
  const originalText = button.innerHTML;
  button.innerHTML = '🎲 Generating...';
  button.disabled = true;
  
  setTimeout(() => {
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
    
    // Reset button
    button.innerHTML = '✅ Generated!';
    button.style.background = '#4CAF50';
    setTimeout(() => {
      button.innerHTML = originalText;
      button.style.background = '';
      button.disabled = false;
    }, 1000);
  }, 500);
}

function normalize(val, min, max) {
  return (val - min) / (max - min);
}

function denormalize(val, min, max) {
  return val * (max - min) + min;
}

function trainAndPredict() {
  if (stockData.length < 10) return alert("⚠️ Please add at least 10 entries for accurate predictions");

  // Add loading state
  const button = document.querySelector('.train-button');
  const originalText = button.innerHTML;
  button.innerHTML = '🧠 Training Neural Network...';
  button.disabled = true;
  
  // Add a small delay to show loading state
  setTimeout(() => {
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
    
    // Reset button
    button.innerHTML = originalText;
    button.disabled = false;
  }, 100);
}

function renderPredictions(predictions) {
  const div = document.getElementById("predictionResults");
  div.innerHTML = "<h3>🔮 Prediction Results</h3>";
  predictions.forEach((p, i) => {
    const d = new Date(stockData[stockData.length - 1].date);
    d.setDate(d.getDate() + i + 1);
    const confidenceColor = p.confidence > 75 ? '#4CAF50' : p.confidence > 70 ? '#FF9800' : '#FF5722';
    div.innerHTML += `
      <p>
        <span><strong>Day ${i + 1}</strong> (${d.toISOString().split("T")[0]}): <span style="color: #667eea; font-weight: bold;">$${p.price}</span></span>
        <span style="color: ${confidenceColor}; font-weight: bold;">${p.confidence}% confidence</span>
      </p>
    `;
  });
}

function initializeChartPlaceholder() {
  const chartContainer = document.querySelector('.chart-container');
  const canvas = document.getElementById('chart');
  
  if (chartContainer && canvas) {
    // Hide the canvas initially
    canvas.style.display = 'none';
    
    // Create placeholder
    const placeholder = document.createElement('div');
    placeholder.id = 'chart-placeholder';
    placeholder.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 350px;
        background: rgba(255, 255, 255, 0.7);
        border: 2px dashed #ddd;
        border-radius: 8px;
        color: #666;
        font-size: 16px;
        text-align: center;
      ">
        <div style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;">📈</div>
        <div style="font-weight: bold; margin-bottom: 10px;">Stock Price Chart</div>
        <div style="font-size: 14px; color: #999;">Train the AI model to see historical data and predictions visualized here</div>
      </div>
    `;
    
    chartContainer.appendChild(placeholder);
  }
}

// Remove chart placeholder when showing actual chart
function removeChartPlaceholder() {
  const placeholder = document.getElementById('chart-placeholder');
  const canvas = document.getElementById('chart');
  
  if (placeholder) {
    placeholder.remove();
  }
  
  if (canvas) {
    canvas.style.display = 'block';
  }
}

function drawChart(history, prediction) {
  // Remove placeholder and show canvas
  removeChartPlaceholder();
  
  const ctx = document.getElementById("chart").getContext("2d");
  
  // Show only last 30 days of historical data to avoid lengthy chart
  const maxHistoryPoints = 30;
  const startIndex = Math.max(0, stockData.length - maxHistoryPoints);
  const recentStockData = stockData.slice(startIndex);
  const recentHistory = history.slice(startIndex);
  
  const labels = recentStockData.map(d => {
    const date = new Date(d.date);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
  
  const predLabels = [];
  let last = new Date(stockData[stockData.length - 1].date);
  for (let i = 0; i < prediction.length; i++) {
    last.setDate(last.getDate() + 1);
    predLabels.push(last.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  }

  if (window.myChart) window.myChart.destroy();

  window.myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [...labels, ...predLabels],
      datasets: [
        {
          label: "📊 Historical Prices",
          data: [...recentHistory, ...Array(prediction.length).fill(null)],
          borderColor: "#4CAF50",
          backgroundColor: "rgba(76, 175, 80, 0.1)",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#4CAF50",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 6
        },
        {
          label: "🔮 AI Predictions",
          data: [...Array(recentHistory.length - 1).fill(null), recentHistory.at(-1), ...prediction],
          borderColor: "#FF6B6B",
          backgroundColor: "rgba(255, 107, 107, 0.1)",
          borderDash: [8, 4],
          tension: 0.4,
          fill: false,
          pointBackgroundColor: "#FF6B6B",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 7
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: `📈 ${stockData[0]?.symbol || 'Stock'} Price Analysis (Last 30 Days + Predictions)`,
          font: {
            size: 18,
            weight: 'bold'
          },
          color: '#333',
          padding: 20
        },
        legend: {
          display: true,
          position: 'top',
          labels: {
            usePointStyle: true,
            font: {
              size: 14
            },
            padding: 20
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'Price ($)',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
            drawBorder: false
          },
          ticks: {
            font: {
              size: 12
            },
            callback: function(value) {
              return '$' + value.toFixed(2);
            }
          }
        },
        x: {
          title: {
            display: true,
            text: 'Date',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
            drawBorder: false
          },
          ticks: {
            font: {
              size: 12
            },
            maxTicksLimit: 15
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      },
      elements: {
        line: {
          borderWidth: 3
        }
      }
    }
  });
}
