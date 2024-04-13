import axios from "axios";

// Define the API key required for accessing the Alpha Vantage API
const API_KEY = process.env.API_KEY;

// Define an asynchronous function to fetch income statement data for a given stock symbol
const fetchIncomeStatementData = async (symbol) => {
  try {
    // Make an HTTP GET request to the Alpha Vantage API's INCOME_STATEMENT endpoint
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${API_KEY}`
    );

    // Return the data property of the response, which contains the income statement data
    return response.data;
  } catch (error) {
    // If an error occurs during the request, log the error to the console
    console.error('Error fetching income statement data:', error);

    throw error;
  }
};

export default fetchIncomeStatementData;

