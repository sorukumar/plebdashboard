// Function to create the fee rate chart
function createFeeRateChart() {
    Papa.parse('data/FeeES.csv', {
        download: true,
        header: true,
        complete: function(results) {
            const data = processFeeData(results.data);
            drawFeeRateChart(data);
        },
        error: function(error) {
            console.error('Error loading the CSV file:', error);
        }
    });
}

// Function to process CSV data
function processFeeData(data) {
    // Filter out rows that don't have the required data
    return data.filter(row => row.Transaction_Size && row.Effective_Fee_Rate_BPS).map(row => ({
        Transaction_Size: row.Transaction_Size,
        Capable_Channels: row.Capable_Channels,
        Median_Fee_Rate: row.Median_Fee_Rate,
        Median_Base_Fee: row.Median_Base_Fee,
        Effective_Fee_Rate_BPS: parseFloat(row.Effective_Fee_Rate_BPS)
    }));
}

// Function to draw the fee rate chart
function drawFeeRateChart(data) {
    const ctx = document.getElementById('feeRateChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(item => item.Transaction_Size),
            datasets: [{
                label: 'Effective Fee Rate (BPS)',
                data: data.map(item => item.Effective_Fee_Rate_BPS),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                fill: true,
                pointRadius: 6, // Increased dot size
                pointHoverRadius: 8, // Increased hover dot size
                pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                pointBorderColor: 'rgba(75, 192, 192, 1)', // Ensure border color is set
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const item = data[context.dataIndex];
                            return [
                                `Capable Channels: ${item.Capable_Channels}`,
                                `Median Fee Rate: ${!isNaN(Number(item.Median_Fee_Rate)) ? (Number(item.Median_Fee_Rate) >= 1 ? Number(item.Median_Fee_Rate).toFixed(0) : Number(item.Median_Fee_Rate).toFixed(1)) : 'N/A'}`,
                                `Median Base Fee: ${!isNaN(Number(item.Median_Base_Fee)) ? (Number(item.Median_Base_Fee) >= 1 ? Number(item.Median_Base_Fee).toFixed(0) : Number(item.Median_Base_Fee).toFixed(1)) : 'N/A'}`


                            ];
                        }
                    }
                },
                legend: {
                    display: false
                },
                datalabels: {
                    display: true,
                    align: 'top',
                    anchor: 'end',
                    formatter: (value) => value.toFixed(2),
                    font: {
                        weight: 'bold',
                        size: 12 // Increased font size for better readability
                    },
                    color: 'rgba(75, 192, 192, 1)',
                    padding: {
                        top: 8 // Added padding to avoid overlap
                    },
                    clip: true, // Ensure labels are clipped within the chart area
                    backgroundColor: 'rgba(255, 255, 255, 0.8)' // Background color for better visibility
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Transaction Size'
                    },
                    ticks: {
                        autoSkip: false, // Ensure all x-axis labels are displayed
                        padding: 10 // Add padding around x-axis labels
                    },
                    grid: {
                        offset: true // Ensure that the grid lines don't overlap with labels
                    },
                    offset: true, // Add space on both sides of the x-axis
                },
                y: {
                    title: {
                        display: true,
                        text: 'Effective Fee Rate (BPS)'
                    },
                    min: 0, // Minimum value of the y-axis
                    max: 8, // Maximum value of the y-axis
                    ticks: {
                        beginAtZero: true // Ensure y-axis starts at 0
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

// Call the function to create the chart
createFeeRateChart();
