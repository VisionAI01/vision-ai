// Importing required dependencies
const express = require('express');             // Express.js for building the server
const mongoose = require('mongoose');           // Mongoose for MongoDB connection
const cors = require('cors');                   // CORS middleware to handle cross-origin requests
const bodyParser = require('body-parser');      // Body parser to parse incoming request bodies
const { getPrediction } = require('./models/prediction'); // Importing AI prediction model

// Creating an Express application
const app = express();

// Middleware configuration
app.use(cors());                               // Enabling CORS for cross-origin requests
app.use(bodyParser.json());                    // Parsing JSON request bodies

// Connecting to MongoDB database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Successfully connected to MongoDB database'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// API Route to get market predictions based on user inputs
app.get('/predict', async (req, res) => {
  try {
    // Extracting query parameters from the request
    const { priceData, liquidityData, volumeData } = req.query;

    // Check if all required data is provided
    if (!priceData || !liquidityData || !volumeData) {
      return res.status(400).json({ message: 'Insufficient data for prediction' });
    }

    // Calling the AI model function to get market prediction based on input data
    const prediction = await getPrediction(priceData, liquidityData, volumeData);

    // Sending the prediction as a JSON response
    res.json({ prediction });
  } catch (error) {
    // Catching and logging any errors that occur during the prediction process
    console.error('Error occurred while getting prediction:', error);
    res.status(500).json({ message: 'Error processing the prediction request' });
  }
});

// API Route to fetch real-time market data (for dashboard usage)
app.get('/market-data', async (req, res) => {
  try {
    // Simulating a call to fetch real-time market data from external sources (oracles, etc.)
    const marketData = {
      price: 123.45,  // Example price data
      liquidity: 5000000, // Example liquidity data
      volume: 2500000, // Example volume data
      timestamp: new Date().toISOString(),
    };

    // Returning the real-time market data as JSON response
    res.json(marketData);
  } catch (error) {
    // Catching any errors while fetching market data
    console.error('Error fetching market data:', error);
    res.status(500).json({ message: 'Error fetching real-time market data' });
  }
});

// API Route to send trading signals to connected wallets
app.post('/send-trading-signal', async (req, res) => {
  try {
    // Extracting trading signal data from the request body
    const { signal, walletAddress } = req.body;

    if (!signal || !walletAddress) {
      return res.status(400).json({ message: 'Signal and wallet address are required' });
    }

    // Simulating sending a trading signal to a wallet (you'd implement smart contract logic here)
    console.log(`Sending trading signal to wallet ${walletAddress}:`, signal);

    // Assuming signal was successfully sent
    res.json({ message: `Trading signal sent to wallet ${walletAddress}` });
  } catch (error) {
    // Handling any errors that occur while sending trading signals
    console.error('Error sending trading signal:', error);
    res.status(500).json({ message: 'Error sending trading signal' });
  }
});

// API Route to subscribe to trading signals
app.post('/subscribe', async (req, res) => {
  try {
    const { userId, signalType } = req.body;

    // Check for necessary data
    if (!userId || !signalType) {
      return res.status(400).json({ message: 'User ID and signal type are required' });
    }

    // Simulating subscription logic (e.g., save to database, set up notifications)
    console.log(`User ${userId} subscribed to ${signalType} signals`);

    // Returning success response
    res.json({ message: `User ${userId} successfully subscribed to ${signalType} signals` });
  } catch (error) {
    // Error handling for subscription issues
    console.error('Error during subscription:', error);
    res.status(500).json({ message: 'Error processing subscription' });
  }
});

// API Route for getting user subscription details
app.get('/subscription-details/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Simulating fetching subscription details from the database
    const subscriptionDetails = {
      userId: userId,
      activeSubscriptions: ['price prediction', 'liquidity alert'],  // Example active subscriptions
    };

    res.json(subscriptionDetails);
  } catch (error) {
    console.error('Error fetching subscription details:', error);
    res.status(500).json({ message: 'Error fetching subscription details' });
  }
});

// Setting up the server to listen on a specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
