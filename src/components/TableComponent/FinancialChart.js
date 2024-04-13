import React, { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import "chartjs-adapter-date-fns";

Chart.register(...registerables);

const FinancialChart = ({
  incomeStatement,
  balanceSheet,
  showQuarterly,
  scaleOption,
  selectedOptions,
}) => {
  // State to store the chart instance
  const [chartInstance, setChartInstance] = useState(null);

  // Effect to render the chart when data or settings change
  useEffect(() => {
    if (incomeStatement && balanceSheet) {
      renderChart();
    }
  }, [incomeStatement, balanceSheet, showQuarterly, scaleOption, selectedOptions]);

  // Function to parse report data
  const parseReportData = (report) => {
    const parsedData = {};
    Object.keys(report).forEach((key) => {
      // Parse numeric data if possible
      parsedData[key] = isNaN(Number(report[key]))
        ? report[key]
        : parseFloat(report[key]);
    });
    return parsedData;
  };

  // Function to render the chart
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
      ? incomeStatement.quarterlyReports
      : incomeStatement.annualReports;
    const selectedDataForBalanceSheet = showQuarterly
      ? balanceSheet.quarterlyReports
      : balanceSheet.annualReports;

    // Extract fiscal end dates from the selected data
    const incomeStatementDates = selectedDataForIncomeStatement.map((report) => report.fiscalDateEnding);
    const balanceSheetDates = selectedDataForBalanceSheet.map((report) => report.fiscalDateEnding);

    // Combine fiscal end dates from both sources and sort them
    const allDates = [...new Set([...incomeStatementDates, ...balanceSheetDates])].sort();

    // Array to store datasets
    const datasets = [];

    // Iterate through selected options to include them in the chart
    Object.keys(selectedOptions).forEach((option) => {
      if (selectedOptions[option]) {
        // Extract data for the current option from income statement and balance sheet data
        const dataForOptionIncomeStatement = selectedDataForIncomeStatement.map((report) => parseReportData(report)[option] || 0);
        const dataForOptionBalanceSheet = selectedDataForBalanceSheet.map((report) => parseReportData(report)[option] || 0);

        // Combine data from both sources and map it to the dates array
        const dataForOption = allDates.map((date, index) => {
          const valueFromIncomeStatement = dataForOptionIncomeStatement[index];
          const valueFromBalanceSheet = dataForOptionBalanceSheet[index];
          // Use data from income statement if available, otherwise use balance sheet data
          return valueFromIncomeStatement || valueFromBalanceSheet || 0;
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
            title: {
              display: true,
              text: getScaleText(scaleOption),
            },
            ticks: {
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
        plugins: {
          tooltip: {
            callbacks: {
              title: (tooltipItems) => {
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
                  scaleOption
                );
                const tooltipText = `${dataset.label}: ${formattedValue.toLocaleString()}`;
                return tooltipText;
              },
            },
            mode: "nearest",
            intersect: true,
          },
        },
      },
    });

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

  // Function to generate a random color
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Function to get scale text for y-axis
  const getScaleText = (scaleOption) => {
    switch (scaleOption) {
      case "thousands":
        return "Value ($K)";
      case "millions":
        return "Value ($M)";
      case "billions":
        return "Value ($B)";
      default:
        return "Value ($)";
    }
  };

  return (
    <canvas
      id="financialChart"
      style={{ width: "100%", height: "500px", maxHeight: "80vh" }}
    ></canvas>
  );
};

export default FinancialChart;
