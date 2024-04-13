# First Principles Publishing Take Home

- This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
- Run the app in development mode by using the `npm run start` command line.
    - You will need to add your own API key as it has been hidden by dotenv.
        - Free API Key can be obtained at https://www.alphavantage.co/support/#api-key
        - API key will need to be implemented in `balanceSheetService.js` and `incomeStatementService.js`. Replace `process.env.API_KEY` in `const variable API_KEY` wwith your own API key.
    - If it is the first time running the code after clone, make sure to `npm install` to install all the necessary dependencies.

## Requirements Met

1. React Project using Create React App
2. Fetch historical quarterly financial data from Alpha Vantage API (Default set to IBM)
3. Plot the following data points on a chart:
    a. Quarterly net income from Income Statement
    b. Quarterly total revenut from Income Statement
    c. Quarterly total shareholder equity from Balance Sheet
4. Display the chart in a visually appealing way on the page. 
    - Done via ChartJS. 
    - onHover displays the fiscalDateEnding and the value (including scale) for each.
    - Native function for ChartJS -> User can click on legend to quickly hide certain data values.
5. Optional - Include an input field or any other suitable UI element to allow users to search for different stock symbols or companies.
    - Input field has been implemented
        - Input waits for submit button to be triggered to fetch.
        - Made input field not case sensitive. Whether it be lowercase or uppercase, stock symbol will be capitalized.
    - A customizable table settings feature has been implemented
        - Default settings is set for Quarterly, Normal Scale, with netIncome, totalRevenue, totalShareholderEquity.
        - Any and all data points from both Income Statement and Balance Sheet can be rendered.
        - Different scales can be implemented from USD -> $K USD -> $M USD -> $B USD.
        - User can toggle Annual or Quarterly for reports.
        - A button to reset settings back to default has also been incorporated.
        - To prevent unnecessary renders during selection, a handleSubmit has been implemented to not re-render the table until "Save Settings" button is toggled.
6. Implement error handling for failed API requests.
    - Chart will be destroyed and a text that says "Failed to fetch financial data. Please try again." will be rendered.
7. Add any additional features or improvements you think would enhance the application.
    - At least for during the current session, Income Statement , Balance Sheet, Scale and Annual vs Quarterly options will persist even when searching for other stock symbols.
    - Added a color randomizer to make sure that all the data points rendered are different colors.
    - Input Box, Settings and Chart have been made into reusable components.
    - Comments have been included everywhere on the code to make sure that anyone can see where everything is happening.
    - Code has been refactored to some degree to not violate SRP and reduce redundancy in code.
    - Made the options for Income Statement and Balance Sheet be dynamically rendered. There should be no hard coded functions to promote reusability.


## Assumptions Made

For certain stock symbols, such as AAPL, there are some irregularities in the JSON object that is returned. There are sometimes objects that have two data points within the response. For data points like this, data point will not be rendered.

Regardless of whether or not there is data for both Income Statement and Balance Sheet at any given fiscalDateEnding, data point has been provided to show as accurate of a plot as possible.

Due to a low daily maximum of 25 for queries, fake data (generated from the API) has been implemented for testing purposes.

## Areas for Improvement and Future Updates

- Implement state so that previously searched stock symbols are stored in localSession or SessionStorage so that another fetch request is not called when searching for a previously searched stock symbol.

- Possibly provide an option to render multiple charts so that user can compare data. Maybe even an overlay of some type on the same chart.

- Seperation of concerns can probably be implemented better. (i.e. styles.css versus creating .css files for each file if and when needed)

- Be more consistent with CSS styling. (Inline styling was used for quick CSS turnaround. Also used a variation of px, rem, vh.. should probably be refactored to use just one or the other for consistency).

- Probably implement a more meaningful error message / page for bad queries.

- Work on implementing meaningful icons for buttons like "Customize Table Settings".

- Allow for a more in-depth scaling option so that users can zoom in on table.

- Add a bit more code for mobile responsiveness.

- Should create a utility file for renderChart logic since it is very similar between FinancialData.js and FinancialChart.js

- Add some JEST testing for components and unit testing.

- Probably should make input box clearable so easier use.

## Sample Video of Working Product

https://www.loom.com/share/8564e8fccc4c422a87b8e5306159c719?sid=65a5cc4d-e2c5-40cb-b7e5-ee3123afcb7b