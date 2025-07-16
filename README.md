"# Stock Market Predictor - Vanilla JavaScript

A simple yet powerful stock market prediction application built with vanilla JavaScript and Brain.js neural networks. This application demonstrates machine learning in the browser using a feedforward neural network to predict stock prices.

## 🚀 Features

- **Real-time Stock Prediction**: Uses Brain.js neural network to predict next 5 days of stock prices
- **Interactive Data Entry**: Add stock prices manually or generate sample data
- **Visual Charts**: Beautiful Chart.js visualizations showing historical and predicted prices
- **Multiple Stocks**: Support for Amazon, Google, Salesforce, Microsoft, and Nvidia
- **Confidence Scoring**: Each prediction includes confidence percentage
- **No Backend Required**: Runs entirely in the browser

## 🛠️ Technologies Used

- **HTML5**: Structure and layout
- **CSS3**: Styling and responsive design
- **Vanilla JavaScript**: Core application logic
- **Brain.js**: Neural network library for machine learning
- **Chart.js**: Data visualization and charting
- **CDN Libraries**: No build process required

## 📋 How It Works

### Neural Network Architecture
```
Input Layer (5 neurons) → Hidden Layer (10 neurons) → Hidden Layer (8 neurons) → Output Layer (1 neuron)
```

### Training Process
1. **Data Preprocessing**: Normalize stock prices to 0-1 range
2. **Sequence Creation**: Create training sequences of 5 consecutive days → 1 day prediction
3. **Training**: Train neural network with 2000 iterations
4. **Prediction**: Generate next 5 days of predictions with confidence scores

### Supported Stocks
- **AMZN**: Amazon
- **GOOGL**: Google
- **CRM**: Salesforce
- **MSFT**: Microsoft
- **NVDA**: Nvidia

## 🎯 Getting Started

### Prerequisites
- Modern web browser with JavaScript enabled
- Internet connection (for CDN libraries)

### Installation
1. **Clone the repository**:
```bash
git clone https://github.com/EthiliSundaravel/stock_predict.git
cd stock_predict
```

2. **Open in browser**:
```bash
# Simply open index.html in your browser
# Or use a local server for better experience
python -m http.server 8000
# Then navigate to http://localhost:8000
```

### Usage

1. **Select a Stock**: Choose from the dropdown menu
2. **Add Data**: 
   - Use "Generate Sample" for quick testing with realistic data
   - Or manually add entries using date and price inputs
3. **Train & Predict**: Click the button to train the neural network and see predictions
4. **View Results**: 
   - See numerical predictions with confidence scores
   - View visual chart with historical data and predictions

## 📊 Data Format

The application expects stock data in the following format:
```javascript
{
  symbol: "AMZN",     // Stock symbol
  date: "2024-01-01", // Date in YYYY-MM-DD format
  price: 150.25       // Stock price in USD
}
```

### Minimum Data Requirements
- **At least 10 data points** for training
- **Recommended**: 30+ data points for better accuracy
- **Sample Data**: Generates 60 days of realistic sample data

## 🧠 Machine Learning Details

### Neural Network Configuration
- **Type**: Feedforward Neural Network
- **Hidden Layers**: [10, 8] neurons
- **Training Iterations**: 2000
- **Input**: Last 5 days of normalized prices
- **Output**: Next day's normalized price

### Prediction Algorithm
1. Takes the last 5 days of price data
2. Normalizes values to 0-1 range
3. Feeds through trained neural network
4. Generates 5 future predictions iteratively
5. Denormalizes back to actual price range
6. Calculates confidence scores (70-80% range)

### Data Normalization
```javascript
normalize(value, min, max) = (value - min) / (max - min)
denormalize(value, min, max) = value * (max - min) + min
```

## 📈 Chart Visualization

The application uses Chart.js to display:
- **Historical Prices**: Green filled line chart
- **Predictions**: Red dashed line extending from last historical point
- **Interactive**: Hover for exact values
- **Responsive**: Adapts to screen size

## 🎨 UI Components

- **Stock Selector**: Dropdown with pre-configured stocks
- **Date Input**: HTML5 date picker
- **Price Input**: Numeric input for stock prices
- **Data List**: Scrollable list of entered data with delete buttons
- **Prediction Results**: Formatted display of predictions with confidence
- **Chart Canvas**: Interactive Chart.js visualization

## 🔧 File Structure

```
stock_predict/
├── index.html          # Main HTML structure
├── style.css           # Styling and layout
├── script.js           # Core JavaScript logic
└── README.md          # This file
```

## 🚀 Deployment

### GitHub Pages
1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Select source branch (usually `main` or `master`)
4. Your app will be available at `https://username.github.io/stock_predict`

### Netlify
1. Drag and drop the project folder to Netlify
2. Or connect your GitHub repository
3. No build process required - it's a static site

### Local Server
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

## 🎯 Key Features Explained

### Sample Data Generation
- Creates 60 days of realistic stock data
- Uses sine waves + randomization for price patterns
- Base prices set per stock symbol
- Automatically sorted by date

### Real-time Training
- Trains neural network in browser
- No server required
- Visual feedback during training process
- Immediate prediction results

### Interactive Data Management
- Add/remove individual entries
- Duplicate date prevention
- Automatic sorting by date
- Visual data list with delete buttons

## 🔮 Future Enhancements

- [ ] Add more stock symbols
- [ ] Implement different neural network architectures
- [ ] Add technical indicators (RSI, MACD, etc.)
- [ ] Export predictions to CSV
- [ ] Add prediction accuracy metrics
- [ ] Implement data persistence (localStorage)
- [ ] Add more chart types and indicators

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

If you have any questions or issues, please open an issue on GitHub or contact the maintainer.

---

**Note**: This is a demonstration project for educational purposes. Stock market predictions are inherently uncertain and this tool should not be used for actual investment decisions." 
