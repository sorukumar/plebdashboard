// Function to create the fee rate chart
function createFeeRateChart() {
    fetch('data/FeeES.csv')
        .then(response => response.text())
        .then(csvText => {
            const data = processFeeData(csvText);
            drawFeeRateChart(data);
        })
        .catch(error => console.error('Error loading the CSV file:', error));
}

// Function to process CSV data
function processFeeData(csvText) {
    const rows = csvText.split('\n').slice(1).map(row => row.split(','));
    return rows.filter(row => row.length > 4).map(row => ({
        Transaction_Size: row[0],
        Capable_Channels: row[1],
        Median_Fee_Rate: row[2],
        Median_Base_Fee: row[3],
        Effective_Fee_Rate_BPS: parseFloat(row[4])
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
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const data = context.raw;
                            return [
                                `Transaction Size: ${context.label}`,
                                `Capable Channels: ${data.Capable_Channels}`,
                                `Median Fee Rate: ${data.Median_Fee_Rate}`,
                                `Median Base Fee: ${data.Median_Base_Fee}`,
                                `Effective Fee Rate (BPS): ${data.Effective_Fee_Rate_BPS.toFixed(2)}`
                            ];
                        }
                    }
                },
                legend: {
                    display: false
                },
                datalabels: {
                    align: 'top',
                    anchor: 'end',
                    formatter: (value, context) => {
                        // Only show labels for every 5th point to avoid clutter
                        return context.dataIndex % 5 === 0 ? value.toFixed(2) : null;
                    },
                    font: {
                        weight: 'bold',
                        size: 10
                    },
                    color: 'rgba(75, 192, 192, 1)'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Transaction Size'
                    }
                },
                y: {
                    display: false // Hide y-axis
                }
            }
        },
        plugins: [ChartDataLabels] // Enable data labels
    });
}

// Call the function to create the chart
createFeeRateChart();
