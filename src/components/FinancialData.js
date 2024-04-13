import React, { useState, useEffect } from "react";
import FinancialForm from "./InputComponents/FinancialForm";
import FinancialChart from "./TableComponent/FinancialChart";
import Settings from "./SettingsComponent/Settings";
import { Chart, registerables } from "chart.js";
import fetchIncomeStatement from "../services/incomeStatementService";
import fetchBalanceSheet from "../services/balanceSheetService";
import "chartjs-adapter-date-fns";
import "./styles.css";

Chart.register(...registerables);

const FinancialData = () => {
  // State variables using React hooks
  const [symbol, setSymbol] = useState("IBM"); // Stock symbol
  const [incomeStatement, setIncomeStatement] = useState([]); // Income statement data
  const [balanceSheet, setBalanceSheet] = useState([]); // Balance sheet data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [submitted, setSubmitted] = useState(false); // Form submission state
  const [chartInstance, setChartInstance] = useState(null); // Chart instance state
  const [showQuarterly, setShowQuarterly] = useState(true); // Show quarterly data state
  const [showAnnual, setShowAnnual] = useState(false); // Show annual data state
  const [scaleOption, setScaleOption] = useState("normal"); // Scale option state
  const [selectedOptions, setSelectedOptions] = useState({
    // Selected options state
    netIncome: true,
    totalRevenue: true,
    totalShareholderEquity: true,
  });
  const [showModal, setShowModal] = useState(false); // Modal display state
  const [selectedOptionsTemp, setSelectedOptionsTemp] = useState({
    ...selectedOptions,
  }); // Temporary selected options state

  // Effect to fetch financial data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch income statement data
        const incomeStatementData = await fetchIncomeStatement(
          symbol,
          selectedOptionsTemp
        );
        setIncomeStatement(incomeStatementData);

        // Fetch balance sheet data
        const balanceSheetData = await fetchBalanceSheet(
          symbol,
          selectedOptionsTemp
        );
        setBalanceSheet(balanceSheetData);

        // Set loading state to false after data is fetched
        setLoading(false);
      } catch (error) {
        console.error("Error fetching financial data:", error);
        setError("Failed to fetch financial data. Please try again.");
        setLoading(false); // Set loading state to false in case of error
      }
    };

    fetchData(); // Invoke fetchData function
  }, []); // Empty dependency array ensures the effect runs only once on mount

  // Handler for input change in the form
  const handleInputChange = (event) => {
    setSymbol(event.target.value); // Set symbol state based on input value
    setError(null); // Reset error state
  };

  // Handler for form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    try {
      setLoading(true); // Set loading state to true
      // Fetch income statement data based on symbol and selected options
      const incomeStatementData = await fetchIncomeStatement(
        symbol.toLocaleUpperCase(),
        selectedOptionsTemp
      );
      setIncomeStatement(incomeStatementData); // Set income statement data

      // Fetch balance sheet data based on symbol and selected options
      const balanceSheetData = await fetchBalanceSheet(
        symbol.toLocaleUpperCase(),
        selectedOptionsTemp
      );
      setBalanceSheet(balanceSheetData); // Set balance sheet data

      setLoading(false); // Set loading state to false after data is fetched
      setSubmitted(true); // Set submitted state to true after successful form submission

      // Reset error state and destroy chart if it exists
      setError(null);
      if (chartInstance) {
        chartInstance.destroy(); // Destroy existing chart instance
        setChartInstance(null); // Reset chart instance state
      }
    } catch (error) {
      console.error("Error fetching financial data:", error);
      setError("Failed to fetch financial data. Please try again.");
      setLoading(false); // Set loading state to false in case of error

      // Destroy chart if it exists
      if (chartInstance) {
        chartInstance.destroy();
        setChartInstance(null);
      }
    }
  };

  // Handler for submitting settings changes
  const handleSettingsSubmit = (
    scaleOption,
    showQuarterly,
    selectedOptionsTemp
  ) => {
    setShowModal(false); // Close settings modal
    setScaleOption(scaleOption); // Apply scale option
    setShowQuarterly(showQuarterly); // Apply show quarterly option
    setSelectedOptions(selectedOptionsTemp); // Update selected options state
    renderChart(); // Re-render the chart with updated settings
  };

  // Function to extract keys from data for settings
  const getKeysFromData = (data) => {
    if (!data || data.length === 0) return [];
    const firstItem = data[0];
    if (!firstItem) return [];
    return Object.keys(firstItem).filter((key) => {
      const value = firstItem[key];
      return !isNaN(Number(value));
    });
  };

  // Effect to render chart when income statement and balance sheet data are available
  useEffect(() => {
    if (incomeStatement && balanceSheet) {
      renderChart();
    }
  }, [
    incomeStatement,
    balanceSheet,
    showQuarterly,
    showAnnual,
    scaleOption,
    selectedOptions,
  ]);

  // Function to generate data array based on report type
  const generateDataArray = (reports, reportType) => {
    if (!reports || !reports[reportType]) return [];
    return reports[reportType].map((report) => ({
      date: report.fiscalDateEnding,
      ...parseReportData(report),
    }));
  };

  // Extracting data arrays for quarterly and annual reports for income statement and balance sheet
  const quarterlyDataForIncomeStatement = generateDataArray(
    incomeStatement,
    "quarterlyReports"
  );
  const quarterlyDataForBalanceSheet = generateDataArray(
    balanceSheet,
    "quarterlyReports"
  );
  const annualDataForIncomeStatement = generateDataArray(
    incomeStatement,
    "annualReports"
  );
  const annualDataForBalanceSheet = generateDataArray(
    balanceSheet,
    "annualReports"
  );

  // Function to parse report data
  function parseReportData(report) {
    const parsedData = {};
    Object.keys(report).forEach((key) => {
      parsedData[key] = isNaN(Number(report[key]))
        ? report[key]
        : parseFloat(report[key]);
    });
    return parsedData;
  }

  // Function to render chart
  const renderChart = () => {
    // Get canvas element
    const canvas = document.getElementById("financialChart");
    if (!canvas) {
      console.error("Canvas element 'financialChart' not found in the DOM.");
      return;
    }

    // Get 2D context of the canvas
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Failed to get 2D context from canvas element.");
      return;
    }

    // Check if there's an existing chart on the canvas and destroy it if present
    if (ctx) {
      const activeChart = Chart.getChart(ctx);
      if (activeChart) {
        activeChart.destroy();
      }
    }

    // Determine which data to use based on quarterly or annual selection
    const selectedDataForIncomeStatement = showQuarterly
      ? quarterlyDataForIncomeStatement
      : annualDataForIncomeStatement;
    const selectedDataForBalanceSheet = showQuarterly
      ? quarterlyDataForBalanceSheet
      : annualDataForBalanceSheet;

    // Extract fiscal end dates from the selected data
    const incomeStatementDates = selectedDataForIncomeStatement.map(
      (report) => report.date
    );
    const balanceSheetDates = selectedDataForBalanceSheet.map(
      (report) => report.date
    );

    // Combine fiscal end dates from both sources and sort them
    const allDates = [
      ...new Set([...incomeStatementDates, ...balanceSheetDates]),
    ].sort();

    // Prepare datasets for chart
    const datasets = [];

    // Iterate through selected options to include them in the chart
    Object.keys(selectedOptions).forEach((option) => {
      if (selectedOptions[option]) {
        // Extract data for the current option from income statement and balance sheet data
        const dataForOptionIncomeStatement =
          selectedDataForIncomeStatement.reduce((acc, report) => {
            acc[report.date] = parseFloat(report[option]);
            return acc;
          }, {});

        const dataForOptionBalanceSheet = selectedDataForBalanceSheet.reduce(
          (acc, report) => {
            acc[report.date] = parseFloat(report[option]);
            return acc;
          },
          {}
        );

        // Combine data from both sources and map it to the dates array
        const dataForOption = allDates.map((date) => {
          const valueFromIncomeStatement = dataForOptionIncomeStatement[date];
          const valueFromBalanceSheet = dataForOptionBalanceSheet[date];
          // Use data from income statement if available, otherwise use balance sheet data
          return valueFromIncomeStatement || valueFromBalanceSheet;
        });

        // Push the dataset for the current option to the datasets array
        datasets.push({
          label: option,
          borderColor: getRandomColor(),
          data: dataForOption,
        });
      }
    });

    // Create a new chart instance
    const newChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: allDates,
        datasets: datasets,
      },
      // Chart options
      options: {
        responsive: true,
        maintainAspectRatio: false,
        // Define scales for x and y axes
        scales: {
          x: {
            type: "time",
            time: {
              // Set time unit based on quarterly or annual selection
              unit: showQuarterly ? "quarter" : "year",
              maxTicksLimit: allDates.length,
              autoSkip: false,
            },
            title: {
              display: true,
              text: "Fiscal Date Ending",
            },
          },
          y: {
            type: "linear",
            beginAtZero: true,
            // Set title and format tick values based on scale option
            title: {
              display: true,
              text: getScaleText(scaleOption),
            },
            ticks: {
              // Format tick values based on scale option
              callback: function (value, index, values) {
                switch (scaleOption) {
                  case "thousands":
                    return (value / 1000).toLocaleString() + " ($K)";
                  case "millions":
                    return (value / 1e6).toLocaleString() + " ($M)";
                  case "billions":
                    return (value / 1e9).toLocaleString() + " ($B)";
                  default:
                    return value.toLocaleString() + " ($)";
                }
              },
            },
          },
        },
        // Configure tooltip appearance and behavior
        plugins: {
          tooltip: {
            callbacks: {
              title: (tooltipItems) => {
                // Format tooltip title
                const item = tooltipItems[0];
                const dateRegex = /([A-Za-z]{3} \d{1,2}, \d{4})/;
                const match = item.label.match(dateRegex);
                const formattedDate = match ? match[0] : item.label;
                return `Fiscal Date: ${formattedDate}`;
              },
              label: (context) => {
                const { dataset, dataIndex } = context;
                const formattedValue = formatValue(
                  dataset.data[dataIndex],
                  selectedOptions.scaleOption
                );
                const tooltipText = `${
                  dataset.label
                }: $${formattedValue.toLocaleString()}`;
                return tooltipText;
              },
            },
            mode: "nearest",
            intersect: true,
          },
        },
      },
    });

    // Update chart instance state
    setChartInstance(newChartInstance);
  };

  // Function to format values based on scale option
  const formatValue = (value, scaleOption) => {
    switch (scaleOption) {
      case "thousands":
        return (value / 1000).toLocaleString() + " ($K)";
      case "millions":
        return (value / 1e6).toLocaleString() + " ($M)";
      case "billions":
        return (value / 1e9).toLocaleString() + " ($B)";
      default:
        return value.toLocaleString() + " ($)";
    }
  };

  // Handlers for checkbox and radio button changes
  const handleShowQuarterlyChange = () => {
    setShowQuarterly(true);
    setShowAnnual(false);
  };

  const handleShowAnnualChange = () => {
    setShowQuarterly(false);
    setShowAnnual(true);
  };

  const handleScaleOptionChange = (event) => {
    setScaleOption(event.target.value);
  };

  const handleOptionChange = (event) => {
    const { name, checked } = event.target;
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [name]: checked,
    }));
  };

  // Function to get scale text based on scale option
  const getScaleText = (scaleOption) => {
    switch (scaleOption) {
      case "thousands":
        return " (in Thousands USD)";
      case "millions":
        return " (in Millions USD)";
      case "billions":
        return " (in Billions USD)";
      default:
        return " (in USD)";
    }
  };

  // Function to generate random color
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Handler for input box key press
  const handleKeyDown = (event) => {
    if (event.code === "Enter") {
      handleSubmit(event);
    }
  };

  return (
    <div>
      <h2>Financial Data for {symbol.toLocaleUpperCase()}</h2>
      <FinancialForm
        symbol={symbol}
        onSubmit={handleSubmit}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        error={error}
        loading={loading}
      />
      <button className="settings-button" onClick={() => setShowModal(true)}>
        Customize Table Settings
      </button>
      <Settings
        incomeStatementKeys={getKeysFromData(incomeStatement.annualReports)}
        balanceSheetKeys={getKeysFromData(balanceSheet.annualReports)}
        selectedOptions={selectedOptions}
        scaleOption={scaleOption}
        showQuarterly={showQuarterly}
        handleOptionChange={handleOptionChange}
        handleScaleOptionChange={handleScaleOptionChange}
        handleShowQuarterlyChange={handleShowQuarterlyChange}
        handleShowAnnualChange={handleShowAnnualChange}
        handleClose={() => setShowModal(false)}
        handleSubmit={handleSettingsSubmit}
        showModal={showModal}
      />
      <FinancialChart />
    </div>
  );
};

export default FinancialData;
