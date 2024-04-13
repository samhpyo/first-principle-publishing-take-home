import axios from "axios";

const API_KEY = process.env.API_KEY;

// Define an asynchronous function to fetch balance sheet data for a given stock symbol
const fetchBalanceSheetData = async (symbol) => {
  try {
    // Make an HTTP GET request to the Alpha Vantage API's BALANCE_SHEET endpoint
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=${symbol}&apikey=${API_KEY}`
    );

    // Return the data property of the response, which contains the balance sheet data
    return response.data;
  } catch (error) {
    // If an error occurs during the request, log the error to the console
    console.error("Error fetching balance sheet data:", error);

    throw error;
  }
};

export default fetchBalanceSheetData;

